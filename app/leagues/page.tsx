"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import { getMyLeagues, getLeagueStandings } from '@/services/leagueService';
import { League, Standing } from '@/types';
import { showToast } from '@/components/ui/Toast';
import apiClient from '@/lib/apiClient';
import AppLayout from '@/components/layout/AppLayout';
import LiveTicker from '@/components/LiveTicker';

type Tab = 'standings' | 'invite';

export default function LeaguesPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [standings, setStandings] = useState<Standing[]>([]);
  const [fetching, setFetching] = useState(true);
  const [backendUser, setBackendUser] = useState<{ id: number } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('standings');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const [meRes, userLeagues] = await Promise.all([
            apiClient.get('/users/me'),
            getMyLeagues()
          ]);
          setBackendUser(meRes.data);
          setLeagues(userLeagues);

          if (userLeagues.length > 0) {
            const active = userLeagues[0];
            setSelectedLeague(active);
            const stds = await getLeagueStandings(active.id);
            setStandings(stds);
          }
        } catch (error) {
          console.error('Error fetching leagues:', error);
          showToast('Error cargando ligas. Verifica tu conexión.', 'error');
        } finally {
          setFetching(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated, user?.id, user?.user_metadata?.display_name]);

  const switchLeague = useCallback(async (league: League) => {
    setSelectedLeague(league);
    setFetching(true);
    try {
      const stds = await getLeagueStandings(league.id);
      setStandings(stds);
    } catch (e) {
      console.error(e);
      showToast('Error cargando clasificación.', 'error');
    } finally {
      setFetching(false);
    }
  }, []);

  const copyInviteLink = () => {
    if (!selectedLeague?.invite_token) return;
    const link = `${window.location.origin}/join-league?token=${selectedLeague.invite_token}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      showToast('¡Enlace copiado al portapapeles! 📋', 'success');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wc-dark">
        <Spinner />
      </div>
    );
  }

  const myStanding = backendUser?.id ? standings.find(s => s.user_id === backendUser.id) : null;
  const myPosition = myStanding ? myStanding.position : null;
  const leader = standings.find(s => s.position === 1);
  const ptsDiff = leader && myStanding ? leader.total_points - myStanding.total_points : null;

  const getMedalColor = (position: number) => {
    if (position === 1) return { border: '#F0A500', glow: 'rgba(240,165,0,0.4)', badge: 'bg-wc-gold text-wc-dark', label: '🥇' };
    if (position === 2) return { border: '#CBD5E1', glow: 'rgba(203,213,225,0.3)', badge: 'bg-gray-400 text-white', label: '🥈' };
    if (position === 3) return { border: '#CD7F32', glow: 'rgba(205,127,50,0.35)', badge: 'bg-amber-700 text-white', label: '🥉' };
    return { border: '', glow: '', badge: 'bg-wc-muted text-wc-white/60', label: '' };
  };

  return (
    <AppLayout activeRoute="/leagues">

      {/* Page Header */}
      <div className="mb-6 mt-2">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 bg-wc-sky/10 border border-wc-sky/20 rounded-full px-3 py-1 text-xs font-bold text-wc-sky uppercase tracking-widest mb-3">
              🏆 Competición Social
            </div>
            <h1 className="text-3xl font-black text-wc-white uppercase tracking-tight">
              LIGAS <span className="text-wc-sky">PRIVADAS</span>
            </h1>
          </div>
          <div className="flex gap-2 flex-wrap shrink-0">
            <Link href="/explore-leagues" className="px-4 py-2.5 rounded-xl bg-wc-card/60 border border-wc-border text-wc-white/70 font-bold text-xs uppercase tracking-wide hover:border-wc-sky hover:text-wc-sky transition-all">
              🌍 Explorar
            </Link>
            <Link href="/join-league" className="px-4 py-2.5 rounded-xl bg-wc-card/60 border border-wc-border text-wc-white/70 font-bold text-xs uppercase tracking-wide hover:border-wc-sky hover:text-wc-sky transition-all">
              🔑 Unirse
            </Link>
            <Link href="/create-league" className="px-4 py-2.5 rounded-xl bg-wc-sky text-white font-black text-xs uppercase tracking-wide shadow-glow-sky hover:opacity-90 transition-all">
              ＋ Crear Liga
            </Link>
          </div>
        </div>
      </div>

      {fetching && !selectedLeague ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : !selectedLeague ? (
        /* ─── Empty State ─── */
        <div className="text-center py-20 px-4 bg-wc-card/30 border border-wc-border rounded-3xl">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-black text-wc-white mb-2 uppercase">Aún no estás en ninguna liga</h2>
          <p className="text-wc-white/50 text-sm font-semibold mb-8 max-w-sm mx-auto">
            Crea tu propia liga o únete con un código de invitación y comienza a competir.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/create-league"
              className="inline-flex items-center gap-2 px-6 py-3 bg-wc-sky text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-glow-sky hover:opacity-90 transition-all"
            >
              🏆 Crear mi primera liga
            </Link>
            <Link
              href="/join-league"
              className="inline-flex items-center gap-2 px-6 py-3 bg-wc-card border border-wc-border text-wc-white/70 font-bold text-sm uppercase rounded-xl hover:border-wc-sky hover:text-wc-sky transition-all"
            >
              🔑 Unirme con código
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* League Selector (if multiple) */}
          {leagues.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 [&::-webkit-scrollbar]:hidden">
              {leagues.map(l => (
                <button
                  key={l.id}
                  onClick={() => switchLeague(l)}
                  className={`
                    shrink-0 px-4 py-2 rounded-xl font-bold text-sm uppercase tracking-wide transition-all border
                    ${selectedLeague.id === l.id
                      ? 'bg-wc-sky text-white border-wc-sky shadow-glow-sky'
                      : 'bg-wc-card/60 border-wc-border text-wc-white/60 hover:border-wc-sky hover:text-wc-sky'
                    }
                  `}
                >
                  {l.name}
                </button>
              ))}
            </div>
          )}

          {/* League Hero Card */}
          <div className="bg-wc-card/60 border border-wc-border rounded-2xl overflow-hidden mb-6 backdrop-blur-sm">
            <div className="h-2 bg-hero-gradient" />
            <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-wc-dark border border-wc-border flex items-center justify-center text-3xl font-black text-wc-gold shadow-glow-gold shrink-0">
                {selectedLeague.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-black text-wc-white mb-1">{selectedLeague.name}</h2>
                <div className="flex gap-2 justify-center sm:justify-start flex-wrap">
                  <span className="text-xs font-bold text-wc-white/40 bg-wc-muted/30 border border-wc-border rounded-full px-3 py-1">
                    👥 {selectedLeague.members_count ?? standings.length} participantes
                  </span>
                  <span className="text-xs font-bold text-wc-green bg-wc-green/10 border border-wc-green/30 rounded-full px-3 py-1">
                    ● Activa
                  </span>
                </div>
              </div>

              {/* My Position */}
              {myPosition !== null && (
                <div className="text-center shrink-0">
                  <div className="text-xs font-black text-wc-white/40 uppercase tracking-widest mb-1">Tu posición</div>
                  <div className="text-5xl font-black italic text-wc-sky leading-none">{myPosition}°</div>
                </div>
              )}
            </div>

            {/* Leader difference banner */}
            {ptsDiff !== null && ptsDiff > 0 && leader && (
              <div className="mx-4 mb-4 p-3 bg-wc-gold/10 border border-wc-gold/20 rounded-xl flex items-center gap-3">
                <span className="text-xl">📊</span>
                <p className="text-xs font-bold text-wc-gold/80">
                  Estás a <span className="text-wc-gold font-black text-sm">{ptsDiff} pts</span> del primer lugar
                  {leader.display_name && <> — <span className="text-wc-white/60">{leader.display_name}</span></>}
                </p>
              </div>
            )}
            {ptsDiff === 0 && myStanding && (
              <div className="mx-4 mb-4 p-3 bg-wc-green/10 border border-wc-green/30 rounded-xl flex items-center gap-3">
                <span className="text-xl">🏆</span>
                <p className="text-xs font-bold text-wc-green">¡Eres el líder de la clasificación!</p>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-wc-card/40 border border-wc-border rounded-xl p-1">
            {[
              { id: 'standings' as Tab, icon: '📊', label: 'Clasificación' },
              { id: 'invite' as Tab, icon: '🔗', label: 'Invitar Amigos' },
            ].map(tab => (
              <button
                key={tab.id}
                id={`league-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all
                  ${activeTab === tab.id
                    ? 'bg-wc-sky text-white shadow-glow-sky'
                    : 'text-wc-white/50 hover:text-wc-white'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'standings' && (
            fetching ? (
              <div className="flex justify-center py-12"><Spinner /></div>
            ) : standings.length === 0 ? (
              <div className="text-center py-12 bg-wc-card/30 border border-wc-border rounded-2xl">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg font-black text-wc-white mb-1">Sin clasificación aún</h3>
                <p className="text-wc-white/50 text-sm">Los puntos aparecerán tras el primer partido finalizado.</p>
              </div>
            ) : (
              <div className="bg-wc-card/60 border border-wc-border rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b border-wc-border">
                        <th className="text-left px-5 py-4 text-xs font-black text-wc-white/40 uppercase tracking-widest">Pos</th>
                        <th className="text-left px-5 py-4 text-xs font-black text-wc-white/40 uppercase tracking-widest">Participante</th>
                        <th className="text-center px-3 py-4 text-xs font-black text-wc-white/40 uppercase tracking-widest">Picks</th>
                        <th className="text-center px-3 py-4 text-xs font-black text-wc-white/40 uppercase tracking-widest">Exactos</th>
                        <th className="text-right px-5 py-4 text-xs font-black text-wc-white/40 uppercase tracking-widest">Puntos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((std) => {
                        const isMe = backendUser?.id && std.user_id === backendUser.id;
                        const medal = getMedalColor(std.position);
                        const isTop3 = std.position <= 3;

                        return (
                          <tr
                            key={std.user_id}
                            className={`
                              border-b border-wc-border/30 last:border-0 transition-colors
                              ${isMe ? 'bg-wc-sky/5' : 'hover:bg-wc-muted/20'}
                            `}
                            style={isTop3 ? { borderLeft: `3px solid ${medal.border}` } : {}}
                          >
                            {/* Position */}
                            <td className="px-5 py-4">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black ${medal.badge}`}
                                style={isTop3 ? { boxShadow: `0 0 12px ${medal.glow}` } : {}}
                              >
                                {isTop3 ? medal.label : std.position}
                              </div>
                            </td>

                            {/* Name */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${std.display_name}`}
                                  alt={std.display_name}
                                  className="w-9 h-9 rounded-full border-2"
                                  style={{ borderColor: isMe ? '#5C45F2' : 'rgba(0, 0, 0, 0.08)' }}
                                />
                                <div>
                                  <div className="text-sm font-black text-wc-white flex items-center gap-2">
                                    {std.display_name}
                                    {isMe && (
                                      <span className="text-xs bg-wc-sky/20 border border-wc-sky/40 text-wc-sky rounded-full px-2 py-0.5">TÚ</span>
                                    )}
                                    {((std as any).exact_predictions ?? 0) >= 3 && (
                                      <span className="text-xs bg-wc-red/20 border border-wc-red/40 text-wc-red rounded-full px-2 py-0.5 flex items-center gap-0.5" title="¡Racha de Exactos! 🔥">
                                        🔥 {((std as any).exact_predictions ?? 0)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-xs text-wc-white/30 font-semibold">
                                    {std.predictions_count} {std.predictions_count === 1 ? 'pronóstico' : 'pronósticos'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Correct */}
                            <td className="px-3 py-4 text-center">
                              <span className="text-sm font-bold text-wc-white/70">{std.correct_predictions}</span>
                            </td>

                            {/* Exact */}
                            <td className="px-3 py-4 text-center">
                              <span className="text-sm font-bold text-wc-green">{(std as any).exact_predictions ?? 0}</span>
                            </td>

                            {/* Points */}
                            <td className="px-5 py-4 text-right">
                              <span
                                className="text-lg font-black"
                                style={{ color: isMe ? '#5C45F2' : isTop3 ? medal.border : '#12141D' }}
                              >
                                {std.total_points}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          )}

          {activeTab === 'invite' && (
            <div className="space-y-5">
              <div className="bg-wc-card/60 border border-wc-border rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-black text-wc-white mb-1">Invita a tus Amigos</h3>
                <p className="text-wc-white/50 text-sm font-semibold mb-6">
                  Comparte el enlace o el código de 6 dígitos para que se unan directamente.
                </p>

                {selectedLeague.invite_token ? (
                  <>
                    {/* Token Code Display */}
                    <div className="bg-wc-dark border border-wc-border rounded-xl p-5 text-center mb-5">
                      <div className="text-xs font-black text-wc-white/40 uppercase tracking-widest mb-2">Código de Invitación</div>
                      <div className="text-4xl font-black tracking-[0.4em] text-wc-white" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {selectedLeague.invite_token}
                      </div>
                    </div>

                    {/* Copy Link Button */}
                    <button
                      id="copy-invite-link"
                      onClick={copyInviteLink}
                      className={`
                        w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all
                        flex items-center justify-center gap-2
                        ${copied
                          ? 'bg-wc-green/20 border border-wc-green/40 text-wc-green'
                          : 'bg-wc-sky text-white shadow-glow-sky hover:opacity-90'
                        }
                      `}
                    >
                      {copied ? '✅ ¡COPIADO!' : '📋 COPIAR ENLACE DE INVITACIÓN'}
                    </button>

                    {/* Share hint */}
                    <div className="mt-4 p-4 bg-wc-sky/5 border border-wc-sky/20 rounded-xl">
                      <p className="text-xs text-wc-white/50 font-semibold text-center leading-relaxed">
                        💡 Comparte el enlace por WhatsApp, correo o redes sociales. Tus amigos podrán unirse directamente haciendo clic.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-wc-white/40 font-semibold">
                    Esta liga no tiene código de invitación activo.
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Miembros', value: selectedLeague.members_count ?? standings.length, color: 'text-wc-sky' },
                  { label: 'Mi Posición', value: myPosition !== null ? `${myPosition}°` : '—', color: 'text-wc-gold' },
                  { label: 'Mis Pts', value: myStanding?.total_points ?? 0, color: 'text-wc-green' },
                ].map(stat => (
                  <div key={stat.label} className="bg-wc-card/60 border border-wc-border rounded-xl p-4 text-center">
                    <div className={`text-2xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                    <div className="text-xs text-wc-white/40 font-bold uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
}
