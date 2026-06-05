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
  }, [isAuthenticated, user?.id]);

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  const myStanding = backendUser?.id ? standings.find(s => s.user_id === backendUser.id) : null;
  const myPosition = myStanding ? myStanding.position : null;
  const leader = standings.find(s => s.position === 1);
  const ptsDiff = leader && myStanding ? leader.total_points - myStanding.total_points : null;

  const getMedalStyle = (position: number) => {
    if (position === 1) return { background: '#FFB800', color: 'white', boxShadow: '0 4px 12px rgba(255,184,0,0.4)' };
    if (position === 2) return { background: '#CBD5E1', color: 'white', boxShadow: '0 4px 12px rgba(203,213,225,0.4)' };
    if (position === 3) return { background: '#CD7F32', color: 'white', boxShadow: '0 4px 12px rgba(205,127,50,0.4)' };
    return { background: 'var(--bg)', color: 'var(--fg)' };
  };

  const getMedalLabel = (position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return position.toString();
  };

  return (
    <AppLayout activeRoute="/leagues">
      <style>{`
        .league-header-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          background: var(--surface);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          text-align: center;
          margin-bottom: 2rem;
        }
        @media (min-width: 768px) {
          .league-header-card {
            flex-direction: row;
            text-align: left;
            padding: 3rem;
            justify-content: space-between;
          }
        }
        .league-logo-large {
          width: 72px;
          height: 72px;
          background: var(--primary);
          color: white;
          border-radius: var(--radius-md);
          display: grid;
          place-items: center;
          font-size: 2rem;
          font-weight: 900;
          font-style: italic;
          box-shadow: 0 10px 20px var(--primary-soft);
          flex-shrink: 0;
        }
        .rank-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px;
        }
        .rank-table th {
          text-align: left;
          padding: 1.25rem 1rem;
          color: var(--fg-muted);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border-bottom: 2px solid var(--bg);
          font-style: normal;
          font-weight: 800;
        }
        .rank-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid var(--border);
          font-weight: 700;
          font-size: 0.9rem;
        }
        .rank-table tr:last-child td { border-bottom: none; }
        .rank-row-me { background: var(--primary-soft); }
        .rank-row-me:hover { background: var(--primary-soft) !important; }
        .rank-table tbody tr:hover { background: var(--bg); }
        .pos-badge {
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: var(--bg);
          font-weight: 900;
          font-size: 0.9rem;
        }
        .league-tab-nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: var(--bg);
          padding: 0.35rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
        }
        .league-tab-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          transition: all 0.2s;
          color: var(--fg-muted);
          background: transparent;
        }
        .league-tab-btn.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px var(--primary-soft);
        }
        .invite-token-display {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 2rem;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .pts-diff-banner {
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .pts-diff-banner.behind { background: rgba(240,165,0,0.08); border-color: rgba(240,165,0,0.25); }
        .pts-diff-banner.leader { background: rgba(0,210,106,0.08); border-color: rgba(0,210,106,0.25); color: var(--success); }
      `}</style>

      {/* Page Header */}
      <header className="page-header">
        <div>
          <div className="badge-slant" style={{ marginBottom: '0.5rem' }}><span>Competición Social</span></div>
          <h1>LIGAS <span className="text-accent">PRIVADAS</span></h1>
        </div>
        <div className="flex" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/explore-leagues" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem' }}>EXPLORAR</Link>
          <Link href="/join-league" className="btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem' }}>UNIRSE</Link>
          <Link href="/create-league" className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem' }}>CREAR LIGA</Link>
        </div>
      </header>

      {fetching && !selectedLeague ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
          <Spinner />
        </div>
      ) : !selectedLeague ? (
        /* ─── Empty State ─── */
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
          <h2 style={{ marginBottom: '1rem' }}>Aún no estás en ninguna liga</h2>
          <p className="text-muted" style={{ marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
            Crea tu propia liga o únete con un código de invitación para comenzar a competir.
          </p>
          <div className="flex" style={{ gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/create-league" className="btn-primary">🏆 Crear mi primera liga</Link>
            <Link href="/join-league" className="btn-secondary">🔑 Unirme con código</Link>
          </div>
        </div>
      ) : (
        <>
          {/* League Selector (if multiple) */}
          {leagues.length > 1 && (
            <div className="flex custom-scrollbar" style={{ gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
              {leagues.map(l => (
                <button
                  key={l.id}
                  onClick={() => switchLeague(l)}
                  className={selectedLeague.id === l.id ? 'pill accent' : 'pill'}
                  style={{ cursor: 'pointer', border: '1px solid var(--border)', whiteSpace: 'nowrap' }}
                >
                  {l.name}
                </button>
              ))}
            </div>
          )}

          {/* League Hero Card */}
          <div className="league-header-card">
            <div className="flex" style={{ gap: '1.5rem', flex: 1 }}>
              <div className="league-logo-large">{selectedLeague.name.charAt(0).toUpperCase()}</div>
              <div>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>{selectedLeague.name}</h2>
                <div className="flex" style={{ gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                  <span className="pill accent" style={{ fontSize: '0.65rem' }}>
                    👥 {selectedLeague.members_count ?? standings.length} Participantes
                  </span>
                  <span className="pill purple" style={{ fontSize: '0.65rem' }}>
                    ● Activa
                  </span>
                </div>
              </div>
            </div>

            {myPosition !== null && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem', textAlign: 'center', minWidth: '120px' }}>
                <p className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Tu Posición Actual</p>
                <div style={{ fontSize: '4rem', fontWeight: 900, fontStyle: 'italic', color: 'var(--accent)', lineHeight: 1 }}>{myPosition}°</div>
              </div>
            )}
          </div>

          {/* Points difference banner */}
          {ptsDiff !== null && ptsDiff > 0 && leader && (
            <div className="pts-diff-banner behind">
              <span style={{ fontSize: '1.25rem' }}>📊</span>
              <p>
                Estás a <strong style={{ color: '#F0A500' }}>{ptsDiff} pts</strong> del primer lugar
                {leader.display_name && <> — <span className="text-muted">{leader.display_name}</span></>}
              </p>
            </div>
          )}
          {ptsDiff === 0 && myStanding && (
            <div className="pts-diff-banner leader">
              <span style={{ fontSize: '1.25rem' }}>🏆</span>
              <p>¡Eres el líder de la clasificación!</p>
            </div>
          )}

          {/* Tabs */}
          <div className="league-tab-nav">
            <button
              id="league-tab-standings"
              className={`league-tab-btn ${activeTab === 'standings' ? 'active' : ''}`}
              onClick={() => setActiveTab('standings')}
            >
              📊 Clasificación
            </button>
            <button
              id="league-tab-invite"
              className={`league-tab-btn ${activeTab === 'invite' ? 'active' : ''}`}
              onClick={() => setActiveTab('invite')}
            >
              🔗 Invitar Amigos
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'standings' && (
            fetching ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
            ) : standings.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
                <h3 style={{ marginBottom: '0.5rem' }}>Sin clasificación aún</h3>
                <p className="text-muted">Los puntos aparecerán tras el primer partido finalizado.</p>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="custom-scrollbar" style={{ overflowX: 'auto' }}>
                  <table className="rank-table">
                    <thead>
                      <tr>
                        <th>Pos</th>
                        <th>Participante</th>
                        <th>Picks</th>
                        <th>Exactos</th>
                        <th style={{ textAlign: 'right' }}>Puntos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((std) => {
                        const isMe = backendUser?.id && std.user_id === backendUser.id;
                        const isTop3 = std.position <= 3;
                        const medalStyle = getMedalStyle(std.position);
                        const medalLabel = getMedalLabel(std.position);

                        return (
                          <tr
                            key={std.user_id}
                            className={isMe ? 'rank-row-me' : ''}
                            style={isTop3 ? { borderLeft: `3px solid ${medalStyle.background}` } : {}}
                          >
                            <td>
                              <div
                                className="pos-badge"
                                style={isTop3 ? medalStyle : {}}
                              >
                                {isTop3 ? medalLabel : std.position}
                              </div>
                            </td>
                            <td>
                              <div className="flex" style={{ gap: '0.75rem' }}>
                                <img
                                  src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${std.display_name}`}
                                  alt={std.display_name}
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    border: `2px solid ${isMe ? 'var(--primary)' : 'var(--border)'}`
                                  }}
                                />
                                <div>
                                  <div style={{ fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {std.display_name}
                                    {isMe && (
                                      <span className="pill accent" style={{ padding: '2px 8px', fontSize: '0.5rem', verticalAlign: 'middle' }}>TÚ</span>
                                    )}
                                    {((std as any).exact_predictions ?? 0) >= 3 && (
                                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--danger)' }} title="¡Racha de Exactos! 🔥">
                                        🔥 {(std as any).exact_predictions}
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.65rem', opacity: 0.6, textTransform: 'uppercase' }}>
                                    {std.predictions_count} {std.predictions_count === 1 ? 'pronóstico' : 'pronósticos'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ textAlign: 'center' }}>{std.correct_predictions}</td>
                            <td style={{ textAlign: 'center', color: 'var(--success)', fontWeight: 800 }}>{(std as any).exact_predictions ?? 0}</td>
                            <td style={{ textAlign: 'right', fontWeight: 900, fontSize: '1.1rem', color: isMe ? 'var(--accent)' : 'var(--fg)' }}>
                              {std.total_points}
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
            <div className="card">
              <h3 style={{ marginBottom: '0.5rem' }}>Invita a tus Amigos</h3>
              <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.85rem' }}>
                Comparte el enlace o el código de 6 dígitos para que se unan directamente.
              </p>

              {selectedLeague.invite_token ? (
                <>
                  <div className="invite-token-display">
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Código de Invitación
                    </div>
                    <div style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '0.4em', fontVariantNumeric: 'tabular-nums' }}>
                      {selectedLeague.invite_token}
                    </div>
                  </div>

                  <button
                    id="copy-invite-link"
                    onClick={copyInviteLink}
                    className={copied ? 'btn-secondary' : 'btn-primary'}
                    style={{ width: '100%', marginBottom: '1rem' }}
                  >
                    {copied ? '✅ ¡COPIADO!' : '📋 COPIAR ENLACE DE INVITACIÓN'}
                  </button>

                  <p className="text-muted" style={{ fontSize: '0.75rem', textAlign: 'center' }}>
                    💡 Comparte el enlace por WhatsApp, correo o redes sociales. Tus amigos podrán unirse directamente haciendo clic.
                  </p>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.5 }}>
                  Esta liga no tiene código de invitación activo.
                </div>
              )}

              {/* Quick Stats */}
              <div className="auto-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '2rem', textAlign: 'center' }}>
                {[
                  { label: 'Miembros', value: selectedLeague.members_count ?? standings.length, color: 'var(--primary)' },
                  { label: 'Mi Posición', value: myPosition !== null ? `${myPosition}°` : '—', color: 'var(--accent)' },
                  { label: 'Mis Pts', value: myStanding?.total_points ?? 0, color: 'var(--success)' },
                ].map(stat => (
                  <div key={stat.label} style={{ padding: '1rem', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: stat.color, marginBottom: '0.25rem' }}>{stat.value}</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.5, textTransform: 'uppercase' }}>{stat.label}</div>
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
