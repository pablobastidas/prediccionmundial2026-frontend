"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getPublicLeagues } from '@/services/leagueService';
import { League } from '@/types';
import { Spinner } from '@/components/ui/Spinner';
import AppLayout from '@/components/layout/AppLayout';
import { joinLeagueByToken } from '@/services/leagueService';
import { showToast } from '@/components/ui/Toast';

export default function ExploreLeagues() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [joiningId, setJoiningId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchPublic = async () => {
        try {
          const data = await getPublicLeagues();
          setLeagues(data);
        } catch (error) {
          console.error('Failed to fetch public leagues', error);
        } finally {
          setLoading(false);
        }
      };
      fetchPublic();
    }
  }, [isAuthenticated]);

  const handleJoin = async (league: League) => {
    if (!league.invite_token) return;
    setJoiningId(league.id);
    try {
      await joinLeagueByToken(league.invite_token);
      showToast(`¡Te uniste a ${league.name}! 🏆`, 'success');
      router.push('/leagues');
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'No se pudo unir. Puede que ya seas miembro.';
      showToast(msg, 'error');
    } finally {
      setJoiningId(null);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-wc-dark">
        <Spinner />
      </div>
    );
  }

  const filteredLeagues = leagues.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout activeRoute="/explore-leagues">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 bg-wc-sky/10 border border-wc-sky/20 rounded-full px-3 py-1 text-xs font-bold text-wc-sky uppercase tracking-widest mb-3">
              🌍 Comunidad
            </div>
            <h1 className="text-3xl font-black text-wc-white uppercase tracking-tight">
              Explorar <span className="text-wc-sky">Ligas</span>
            </h1>
            <p className="text-wc-white/50 text-sm mt-1 font-semibold">
              Descubre ligas públicas y únete para competir
            </p>
          </div>
          <Link
            href="/create-league"
            className="inline-flex items-center gap-2 px-5 py-3 bg-wc-sky text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-glow-sky hover:opacity-90 transition-all shrink-0"
          >
            🏆 Crear Mi Liga
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-wc-white/30 text-sm">🔍</span>
            <input
              id="explore-search"
              type="text"
              className="
                w-full bg-wc-card/60 border border-wc-border text-wc-white
                placeholder-wc-white/30 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold
                transition-all outline-none focus:border-wc-sky focus:ring-1 focus:ring-wc-sky
              "
              placeholder="Buscar por nombre de liga..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Pills */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 bg-wc-card/60 border border-wc-border rounded-full px-4 py-2 text-sm">
          <span className="text-wc-gold font-black">{leagues.length}</span>
          <span className="text-wc-white/50 font-semibold">Ligas públicas</span>
        </div>
        {searchTerm && (
          <div className="flex items-center gap-2 bg-wc-sky/10 border border-wc-sky/20 rounded-full px-4 py-2 text-sm">
            <span className="text-wc-sky font-black">{filteredLeagues.length}</span>
            <span className="text-wc-white/50 font-semibold">resultados</span>
          </div>
        )}
      </div>

      {/* Leagues Grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filteredLeagues.length === 0 ? (
        <div className="text-center py-16 bg-wc-card/30 border border-wc-border rounded-2xl">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-black text-wc-white mb-2">
            {searchTerm ? 'Sin resultados' : 'No hay ligas públicas aún'}
          </h3>
          <p className="text-wc-white/50 text-sm font-semibold mb-6">
            {searchTerm
              ? 'Prueba con otro nombre o revisa las letras.'
              : 'Sé el primero en crear una liga pública.'}
          </p>
          <Link
            href="/create-league"
            className="inline-flex items-center gap-2 px-6 py-3 bg-wc-sky text-white font-black text-sm uppercase tracking-widest rounded-xl hover:opacity-90 transition-all"
          >
            🏆 Crear Primera Liga
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLeagues.map((league) => (
            <div
              key={league.id}
              className="card"
              style={{ padding: 0, overflow: 'hidden' }}
            >
              <div style={{ height: '120px', background: 'linear-gradient(135deg, var(--primary), var(--accent))', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '-20px', left: '1.5rem', width: '60px', height: '60px', background: 'white', borderRadius: '12px', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '1.5rem', color: 'var(--primary)', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                  {league.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div style={{ padding: '2.5rem 1.5rem 1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{league.name}</h3>
                <p className="text-muted" style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: '1.5rem' }}>
                  {league.members_count ?? 0} {(league.members_count ?? 0) === 1 ? 'Miembro' : 'Miembros'} · Pública
                </p>
                <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <span style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase' }}>Premio</span>
                    <div style={{ fontWeight: 900, color: 'var(--success)' }}>Honor & Gloria 🏆</div>
                  </div>
                  <button
                    id={`join-league-${league.id}`}
                    onClick={() => handleJoin(league)}
                    disabled={joiningId === league.id || !league.invite_token}
                    className="pill accent"
                    style={{ border: 'none', cursor: 'pointer' }}
                  >
                    {joiningId === league.id ? '...' : 'UNIRSE'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      {!loading && filteredLeagues.length > 0 && (
        <div className="mt-10 text-center py-8 border-t border-wc-border/30">
          <p className="text-wc-white/40 text-sm font-semibold mb-3">¿Tienes un código de invitación?</p>
          <Link
            href="/join-league"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-wc-muted/50 border border-wc-border text-wc-white/70 font-bold text-sm rounded-xl hover:border-wc-sky hover:text-wc-sky transition-all"
          >
            🔑 Ingresar con código
          </Link>
        </div>
      )}
    </AppLayout>
  );
}
