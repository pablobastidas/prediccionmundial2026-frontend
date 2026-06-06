"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getUserStats, UserStats } from '@/services/userService';
import { getAllMatches } from '@/services/matchService';
import { getGroupsWithTeams } from '@/services/tournamentService';
import { Match, TournamentGroup } from '@/types';
import AppLayout from '@/components/layout/AppLayout';
import { Spinner } from '@/components/ui/Spinner';
import WorldCupCountdown from '@/components/WorldCupCountdown';
import FormattedDate from '@/components/FormattedDate';

export default function HomeDashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<UserStats | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [groups, setGroups] = useState<TournamentGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      const loadDashboardData = async () => {
        try {
          const [fetchedStats, fetchedMatches, fetchedGroups] = await Promise.all([
            getUserStats(),
            getAllMatches(),
            getGroupsWithTeams()
          ]);
          setStats(fetchedStats);
          setMatches(fetchedMatches);
          setGroups(fetchedGroups);
          if (fetchedGroups && fetchedGroups.length > 0) {
            setSelectedGroupId(fetchedGroups[0].id);
          }
        } catch (err) {
          console.error("Error loading dashboard data:", err);
        } finally {
          setFetching(false);
        }
      };
      loadDashboardData();
    }
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Spinner />
      </div>
    );
  }

  // Get live match (in progress) or fallback to the latest finished/upcoming match
  const liveMatch = matches.find(m => m.status === 'IN_PROGRESS') || 
                    matches.find(m => m.status === 'FINISHED') || 
                    matches.find(m => m.status === 'PENDING' || m.status === 'SCHEDULED') ||
                    matches[0];

  // Get next 3 upcoming matches to predict
  const upcomingMatches = matches
    .filter(m => m.status === 'PENDING' || m.status === 'SCHEDULED')
    .slice(0, 3);

  const displayName = user?.user_metadata?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario';

  const selectedGroup = groups.find(g => g.id === selectedGroupId) || groups[0];
  const sortedTeams = selectedGroup?.teams
    ? [...selectedGroup.teams].sort((a, b) => (a.position || 99) - (b.position || 99) || b.points - a.points)
    : [];

  return (
    <AppLayout activeRoute="/home">
      {/* Specific Home Dashboard Local Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .group-mini-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.8rem;
        }
        .group-mini-table th { 
          text-align: left; 
          opacity: 0.5; 
          padding-bottom: 0.5rem; 
          text-transform: uppercase; 
          font-size: 0.6rem; 
        }
        .group-mini-table td { 
          padding: 0.75rem 0; 
          font-weight: 700; 
          border-bottom: 1px solid var(--border); 
        }
        .group-mini-table tr:last-child td {
          border-bottom: none;
        }
        .group-select {
          width: auto;
          padding: 0.3rem 1.75rem 0.3rem 0.5rem;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--fg);
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 800;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 10px;
        }
      `}} />

      {/* Header */}
      <header className="page-header">
        <div>
          <div className="badge-slant" style={{ marginBottom: '0.5rem' }}><span>Mi Selección</span></div>
          <h1>MI <span className="text-accent">PANEL PRO</span></h1>
        </div>
        
        <div className="flex" style={{ gap: '1.5rem', background: 'var(--surface)', padding: '0.5rem 1rem', borderRadius: '99px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex" style={{ gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🏆</span>
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontSize: '0.6rem', opacity: 0.6, fontWeight: 800, textTransform: 'uppercase' }}>Puntos</div>
              <div style={{ fontWeight: 900, fontSize: '1rem' }}>{stats?.total_points ?? 0}</div>       
            </div>
          </div>
          <Link href="/me" className="flex" style={{ gap: '0.75rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem', alignItems: 'center' }}>
            <div className="w-8 h-8 rounded-full bg-wc-sky text-white flex items-center justify-center font-bold text-sm border-2 border-accent">
              {displayName.charAt(0).toUpperCase()}
            </div>
          </Link>
        </div>
      </header>

      {fetching ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <div className="dashboard-columns">
          {/* Left Column */}
          <div className="left-col">
            
            {/* Spotlight Hero Match */}
            {liveMatch && (
              <div className="live-hero">
                <div className="live-content">
                  <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <span className="pill" style={{ background: 'rgba(255,255,255,0.2)' }}>
                      {liveMatch.stage === 'group' ? 'Fase de Grupos' : 'Fase Eliminatoria'}
                    </span>
                    {liveMatch.status === 'IN_PROGRESS' ? (
                      <span className="pill" style={{ background: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="live-dot" style={{ background: 'white', boxShadow: '0 0 10px white' }}></span> EN VIVO
                      </span>
                    ) : liveMatch.status === 'FINISHED' ? (
                      <span className="pill" style={{ background: 'var(--success)' }}>
                        ✓ FINALIZADO
                      </span>
                    ) : (
                      <span className="pill" style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>
                        ⏳ PRÓXIMO
                      </span>
                    )}
                  </div>
                  
                  <div className="match-display">
                    {/* Home Team */}
                    <div className="team-display">
                      {liveMatch.home_team ? (
                        <>
                          <img 
                            src={`https://flagcdn.com/w160/${liveMatch.home_team.flag_emoji?.toLowerCase()}.png`} 
                            className="flag-large" 
                            alt={liveMatch.home_team.name} 
                          />
                          <span style={{ fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', fontSize: '1rem', textAlign: 'center' }}>
                            {liveMatch.home_team.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="flag-large bg-wc-muted/20 flex items-center justify-center font-bold text-lg text-white">?</div>
                          <span style={{ fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', fontSize: '1rem', opacity: 0.5 }}>
                            {liveMatch.home_placeholder}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Score or VS */}
                    <div className="score-large">
                      {liveMatch.status === 'FINISHED' || liveMatch.status === 'IN_PROGRESS' ? (
                        `${liveMatch.result?.home_goals ?? 0} - ${liveMatch.result?.away_goals ?? 0}`
                      ) : (
                        'VS'
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="team-display">
                      {liveMatch.away_team ? (
                        <>
                          <img 
                            src={`https://flagcdn.com/w160/${liveMatch.away_team.flag_emoji?.toLowerCase()}.png`} 
                            className="flag-large" 
                            alt={liveMatch.away_team.name} 
                          />
                          <span style={{ fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', fontSize: '1rem', textAlign: 'center' }}>
                            {liveMatch.away_team.name}
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="flag-large bg-wc-muted/20 flex items-center justify-center font-bold text-lg text-white">?</div>
                          <span style={{ fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', fontSize: '1rem', opacity: 0.5 }}>
                            {liveMatch.away_placeholder}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Link href="/predictions" className="btn-primary" style={{ background: 'white', color: 'var(--primary)', width: '100%', maxWidth: '300px' }}>
                      Ir a Pronosticar
                    </Link>    
                  </div>
                </div>
              </div>
            )}

            {/* World Cup Countdown */}
            <WorldCupCountdown />

            {/* Upcoming Matches */}
            <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'flex-end' }}>
              <h3>Próximos <span className="text-accent">Duelos</span></h3>
              <Link href="/predictions" className="text-primary font-bold text-xs uppercase hover:underline">
                Ver todos
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingMatches.length === 0 ? (
                <div className="card text-center py-8">
                  <p className="text-muted font-semibold">No hay duelos pendientes para pronosticar.</p>
                </div>
              ) : (
                upcomingMatches.map(match => (
                  <div key={match.id} className="match-card-modern">
                    <div className="team-item">
                      {match.home_team ? (
                        <>
                          <img 
                            src={`https://flagcdn.com/w160/${match.home_team.flag_emoji?.toLowerCase()}.png`} 
                            className="team-logo" 
                            alt={match.home_team.name} 
                          />
                          <span className="team-name">{match.home_team.name}</span>
                        </>
                      ) : (
                        <>
                          <div className="team-logo flex items-center justify-center bg-wc-muted/20 text-white font-bold">?</div>
                          <span className="team-name opacity-50">{match.home_placeholder}</span>
                        </>
                      )}
                    </div>

                    <div className="match-center-modern">
                      <span className="match-pill">
                        <FormattedDate dateStr={match.match_datetime} format="short" />
                      </span>
                      <div className="match-score">vs</div>
                      <Link href="/predictions" className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.75rem', borderRadius: '99px' }}>
                        Pronosticar
                      </Link>
                    </div>

                    <div className="team-item">
                      {match.away_team ? (
                        <>
                          <img 
                            src={`https://flagcdn.com/w160/${match.away_team.flag_emoji?.toLowerCase()}.png`} 
                            className="team-logo" 
                            alt={match.away_team.name} 
                          />
                          <span className="team-name">{match.away_team.name}</span>
                        </>
                      ) : (
                        <>
                          <div className="team-logo flex items-center justify-center bg-wc-muted/20 text-white font-bold">?</div>
                          <span className="team-name opacity-50">{match.away_placeholder}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="right-col">
            {/* Performance Stats */}
            <h3 style={{ marginBottom: '2.00rem' }}>Rendimiento <span className="text-accent">Pro</span></h3>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div className="auto-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.6, fontWeight: 800, textTransform: 'uppercase' }}>Posición</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)' }}>
                    {stats?.position && stats.position !== '-' ? `#${stats.position}` : '-'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.6, fontWeight: 800, textTransform: 'uppercase' }}>Efectividad</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--success)' }}>
                    {stats?.effectiveness ?? 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* Group Standings Mini */}
            <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Tablas de <span className="text-accent">Grupos</span></h3>
              {groups.length > 0 && (
                <select 
                  className="group-select" 
                  value={selectedGroupId || ''} 
                  onChange={(e) => setSelectedGroupId(Number(e.target.value))}
                >
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <table className="group-mini-table">
                <thead>
                  <tr>
                    <th>Pos</th>
                    <th>Equipo</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTeams.length > 0 ? (
                    sortedTeams.map((t, idx) => (
                      <tr key={t.id}>
                        <td>{t.position || idx + 1}</td>
                        <td className="flex" style={{ gap: '0.5rem', alignItems: 'center' }}>
                          {t.flag_emoji && (
                            <img 
                              src={`https://flagcdn.com/w20/${t.flag_emoji.toLowerCase()}.png`} 
                              alt={t.name}
                              width={20}
                              height={14}
                              style={{ borderRadius: '2px', border: '1px solid var(--border)' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                          )}
                          <span>{t.name}</span>
                        </td>
                        <td>{t.points}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', opacity: 0.5, padding: '1.5rem 0' }}>
                        No hay datos para este grupo
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  );
}
