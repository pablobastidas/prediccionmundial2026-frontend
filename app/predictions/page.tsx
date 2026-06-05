"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import { getAllMatches } from '@/services/matchService';
import { getPredictions, savePrediction } from '@/services/predictionService';
import { getMyLeagues } from '@/services/leagueService';
import { getGroupsWithTeams } from '@/services/tournamentService';
import { Match, Prediction } from '@/types';
import { showToast } from '@/components/ui/Toast';
import AppLayout from '@/components/layout/AppLayout';

type StageType = 'group' | 'round_of_32' | 'round_of_16' | 'quarterfinals' | 'semifinals' | 'third_place' | 'final';

const STAGES: { id: StageType; label: string }[] = [
  { id: 'group', label: 'Grupos' },
  { id: 'round_of_32', label: '16avos' },
  { id: 'round_of_16', label: 'Octavos' },
  { id: 'quarterfinals', label: 'Cuartos' },
  { id: 'semifinals', label: 'Semis' },
  { id: 'third_place', label: '3er Puesto' },
  { id: 'final', label: 'Final' }
];

const SCORING_QUICK_RULES = [
  { pts: '+5', label: 'Marcador Exacto', icon: '🎯', color: 'var(--success)' },
  { pts: '+3', label: 'Resultado Correcto', icon: '✅', color: 'var(--primary)' },
  { pts: '+10', label: 'Bonus Campeón', icon: '🏆', color: '#F0A500' },
  { pts: '+2', label: 'Bonus Finalista', icon: '⚡', color: 'var(--accent)' },
];

export default function PredictionsPage() {
  const { user, loading, isAuthenticated, signOut } = useAuth();
  const router = useRouter();

  const [stage, setStage] = useState<StageType>('group');
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [fetching, setFetching] = useState(true);
  const [activeLeagueId, setActiveLeagueId] = useState<number | null>(null);
  const [noLeagues, setNoLeagues] = useState(false);
  const [quickFilter, setQuickFilter] = useState<'all' | 'pending' | 'finished'>('all');
  const [showRules, setShowRules] = useState(false);
  const [groupsData, setGroupsData] = useState<any[]>([]);

  const [edits, setEdits] = useState<Record<number, { home: string; away: string; id?: number }>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getGroupsWithTeams()
        .then(setGroupsData)
        .catch(err => console.error("Error loading groups in predictions:", err));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      getMyLeagues()
        .then((leagues) => {
          if (leagues.length > 0) {
            setActiveLeagueId(leagues[0].id);
          } else {
            setNoLeagues(true);
            setFetching(false);
          }
        })
        .catch((err) => console.error('Error loading leagues:', err));
    }
  }, [isAuthenticated]);

  const loadData = async (currentStage: StageType, leagueId: number) => {
    setFetching(true);
    try {
      const [fetchedMatches, fetchedPredictions] = await Promise.all([
        getAllMatches(currentStage),
        getPredictions(leagueId)
      ]);
      setMatches(fetchedMatches);
      setPredictions(fetchedPredictions);

      const initialEdits: Record<number, { home: string; away: string; id?: number }> = {};
      fetchedPredictions.forEach(p => {
        if (p.predicted_home_goals !== null && p.predicted_home_goals !== undefined &&
            p.predicted_away_goals !== null && p.predicted_away_goals !== undefined) {
          initialEdits[p.match_id] = {
            home: p.predicted_home_goals.toString(),
            away: p.predicted_away_goals.toString(),
            id: p.id
          };
        }
      });
      setEdits(initialEdits);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && activeLeagueId !== null) {
      loadData(stage, activeLeagueId);
    }
  }, [isAuthenticated, stage, activeLeagueId]);

  const handleScoreChange = (matchId: number, team: 'home' | 'away', value: string) => {
    setEdits(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: value,
        id: predictions.find(p => p.match_id === matchId)?.id
      }
    }));
  };

  const pendingChanges = Object.keys(edits).filter(matchIdStr => {
    const matchId = parseInt(matchIdStr);
    const edit = edits[matchId];
    if (!edit.home || !edit.away) return false;

    const match = matches.find(m => m.id === matchId);
    if (match?.status === 'FINISHED') return false;

    const existing = predictions.find(p => p.match_id === matchId);
    if (!existing) return true;

    return existing.predicted_home_goals?.toString() !== edit.home ||
           existing.predicted_away_goals?.toString() !== edit.away;
  });

  const handleSaveAll = async () => {
    if (pendingChanges.length === 0) return;
    setSaving(true);
    try {
      const promises = pendingChanges.map(matchIdStr => {
        const matchId = parseInt(matchIdStr);
        const edit = edits[matchId];
        
        if (activeLeagueId === null) return Promise.reject(new Error("No active league"));
        
        return savePrediction({
          id: edit.id,
          league_id: activeLeagueId,
          match_id: matchId,
          prediction_type: 'EXACT',
          predicted_home_goals: parseInt(edit.home),
          predicted_away_goals: parseInt(edit.away)
        });
      });
      await Promise.all(promises);
      showToast('¡Pronósticos guardados exitosamente! 🎯', 'success');
      if (activeLeagueId !== null) {
        await loadData(stage, activeLeagueId);
      }
    } catch (error) {
      console.error("Error saving predictions:", error);
      showToast('Hubo un error guardando tus pronósticos.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredMatches = useMemo(() => {
    return matches.filter(match => {
      const isFinished = match.status === 'FINISHED';
      const isPending = pendingChanges.includes(match.id.toString());
      const hasPrediction = !!predictions.find(p => p.match_id === match.id);

      if (quickFilter === 'all') return true;
      if (quickFilter === 'pending') {
        return !isFinished && (!hasPrediction || isPending);
      }
      if (quickFilter === 'finished') return isFinished;
      return true;
    });
  }, [matches, quickFilter, pendingChanges, predictions]);

  // Group matches by group_name or date
  const groupedMatches = useMemo(() => {
    const groups: Record<string, Match[]> = {};
    filteredMatches.forEach(m => {
      const g = m.stage || 'Fase Eliminatoria';
      if (!groups[g]) groups[g] = [];
      groups[g].push(m);
    });
    return groups;
  }, [filteredMatches]);

  if (loading || !isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  if (noLeagues) {
    return (
      <AppLayout activeRoute="/predictions">
        <header className="page-header">
          <div>
            <div className="badge-slant" style={{ marginBottom: '0.5rem' }}><span>World Cup 2026</span></div>
            <h1>MIS <span className="text-accent">PRONÓSTICOS</span></h1>
          </div>
        </header>
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: 500, margin: '0 auto' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎯</div>
          <h2 style={{ marginBottom: '1rem' }}>Necesitas una liga</h2>
          <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}>
            Los pronósticos se hacen dentro de una liga. Únete a una existente o crea la tuya propia para comenzar a competir.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/create-league" className="btn-primary">🏆 Crear una liga</Link>
            <Link href="/join-league" className="btn-secondary">🔑 Unirme con código</Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout activeRoute="/predictions">
      
      <header className="page-header">
        <div>
          <div className="badge-slant" style={{ marginBottom: '0.5rem' }}><span>World Cup 2026</span></div>
          <h1>MIS <span className="text-accent">PRONÓSTICOS</span></h1>
        </div>
        <div className="flex" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
          {pendingChanges.length > 0 && (
            <div className="pill accent">{pendingChanges.length} PENDIENTES</div>
          )}
          <div className="pill purple">{predictions.length} GUARDADOS</div>
          <button
            onClick={() => setShowRules(r => !r)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '99px',
              fontWeight: 800,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              background: showRules ? 'var(--fg)' : 'var(--bg)',
              color: showRules ? 'white' : 'var(--fg)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {showRules ? '✕ Cerrar' : '📋 Reglas'}
          </button>
        </div>
      </header>

      {/* ── SCORING RULES PANEL ── */}
      {showRules && (
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Sistema de <span className="text-accent">Puntuación</span></h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {SCORING_QUICK_RULES.map(r => (
              <div key={r.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'var(--bg)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: '1.25rem' }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.1rem', color: r.color, fontStyle: 'italic', lineHeight: 1 }}>{r.pts}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.7rem', textTransform: 'uppercase', marginTop: '0.15rem' }}>{r.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            background: 'rgba(255,61,0,0.05)',
            border: '1px solid var(--accent-soft)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--fg-muted)',
            lineHeight: 1.5,
          }}>
            ⚠️ <strong>Cierre de pronósticos:</strong> Los pronósticos cierran al inicio de cada partido. En eliminatorias, los resultados al 90min son los válidos (no tiempo extra). Los empates en puntos se resuelven por mayor cantidad de exactos.
          </div>
        </div>
      )}

      {/* Stage Navigation */}
      <div className="flex custom-scrollbar" style={{ gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
        {STAGES.map(s => (
          <button
            key={s.id}
            className={stage === s.id ? "pill accent" : "pill"}
            onClick={() => setStage(s.id)}
            style={{ cursor: 'pointer', border: 'none' }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Quick Filters */}
      <div className="flex custom-scrollbar" style={{ gap: '0.5rem', overflowX: 'auto', marginBottom: '2rem' }}>
        {[
          { id: 'all', label: 'Todos' },
          { id: 'pending', label: 'Pendientes' },
          { id: 'finished', label: 'Finalizados' }
        ].map(filter => (
          <button
            key={filter.id}
            className={quickFilter === filter.id ? "pill purple" : "pill"}
            onClick={() => setQuickFilter(filter.id as any)}
            style={{ cursor: 'pointer', border: 'none', padding: '0.25rem 0.75rem', fontSize: '0.7rem' }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {fetching ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}><Spinner /></div>
      ) : filteredMatches.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          No hay partidos para los filtros seleccionados en esta fase.
        </div>
      ) : (
        Object.entries(groupedMatches).map(([groupName, groupMatches]) => {
          const isGroup = groupName.toLowerCase().startsWith('grupo') || groupName.toLowerCase().startsWith('group');
          const matchingGroup = groupsData.find(g => g.name.toLowerCase() === groupName.toLowerCase());

          return (
            <div 
              className="group-grid-container" 
              key={groupName} 
              style={{ 
                marginBottom: '3rem',
                gridTemplateColumns: isGroup ? undefined : '1fr'
              }}
            >
              {isGroup && (
                <aside className="standings-mini-card">
                  <div className="flex" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>TABLA {groupName.toUpperCase()}</h4>
                  </div>
                  <table className="table-compact">
                    <thead>
                      <tr>
                        <th>Pos</th>
                        <th>Equipo</th>
                        <th>Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matchingGroup && matchingGroup.teams && matchingGroup.teams.length > 0 ? (
                        matchingGroup.teams
                          .slice()
                          .sort((a: any, b: any) => (a.position || 99) - (b.position || 99) || b.points - a.points)
                          .map((t: any, idx: number) => (
                            <tr key={t.id}>
                              <td>{t.position || idx + 1}</td>
                              <td className="flex" style={{ gap: '0.4rem' }}>
                                <img
                                  src={`https://flagcdn.com/w20/${t.flag_emoji?.toLowerCase()}.png`}
                                  alt={t.name}
                                  width={16}
                                  height={11}
                                  style={{ borderRadius: 1, border: '1px solid var(--border)' }}
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                <span style={{ fontWeight: 800 }}>{t.name}</span>
                              </td>
                              <td style={{ fontWeight: 900 }}>{t.points}</td>
                            </tr>
                          ))
                      ) : (
                        <tr><td colSpan={3} style={{ textAlign: 'center', opacity: 0.5, padding: '1rem 0' }}>Datos no disponibles</td></tr>
                      )}
                    </tbody>
                  </table>
                </aside>
              )}

              <section className="match-list">
              <div className="group-title">
                <h3>{groupName.toUpperCase()}</h3>
              </div>

              {groupMatches.map(match => {
                const edit = edits[match.id] || { home: '', away: '' };
                const isFinished = match.status === 'FINISHED';
                const isPending = pendingChanges.includes(match.id.toString());
                const existing = predictions.find(p => p.match_id === match.id);
                const isSaved = !!existing && !isPending;

                // Determine border color based on state
                const borderColor = isFinished
                  ? '#00D26A'  // wc-green
                  : isSaved
                  ? '#5C45F2'  // wc-sky
                  : isPending
                  ? '#F0A500'  // wc-gold
                  : undefined;

                const boxShadow = isFinished
                  ? '0 0 12px rgba(0,104,71,0.35)'
                  : isSaved
                  ? '0 0 12px rgba(0,157,220,0.3)'
                  : undefined;

                return (
                  <div
                    className="match-card-v2"
                    key={match.id}
                    style={{
                      opacity: isFinished ? 0.85 : 1,
                      borderColor: borderColor,
                      boxShadow: boxShadow,
                      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                  >
                    <div className="match-v2-header">
                      <span>🏟️ {new Date(match.match_datetime).toLocaleString('es-ES', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      {isFinished ? (
                        <span style={{ color: '#00D26A', fontWeight: 800, fontSize: '0.7rem' }}>✅ FINALIZADO</span>
                      ) : isSaved ? (
                        <span style={{ color: '#5C45F2', fontWeight: 800, fontSize: '0.7rem' }}>💾 GUARDADO</span>
                      ) : isPending ? (
                        <span style={{ color: '#F0A500', fontWeight: 800, fontSize: '0.7rem' }}>✏️ MODIFICADO</span>
                      ) : (
                        <span className="text-accent" style={{ fontSize: '0.7rem' }}>⏳ PENDIENTE</span>
                      )}
                    </div>
                    <div className="match-v2-body">
                      <div className="teams-info">
                        <div className="team-box">
                          {match.home_team ? (
                            <>
                              <img src={`https://flagcdn.com/w160/${match.home_team.flag_emoji?.toLowerCase()}.png`} alt={match.home_team.code} />
                              <span className="name">{match.home_team.name}</span>
                            </>
                          ) : (
                            <span className="name" style={{ opacity: 0.5 }}>{match.home_placeholder}</span>
                          )}
                        </div>
                        <div className="match-vs">
                          {isFinished && match.result ? `${match.result.home_goals} - ${match.result.away_goals}` : 'VS'}
                        </div>
                        <div className="team-box">
                          {match.away_team ? (
                            <>
                              <img src={`https://flagcdn.com/w160/${match.away_team.flag_emoji?.toLowerCase()}.png`} alt={match.away_team.code} />
                              <span className="name">{match.away_team.name}</span>
                            </>
                          ) : (
                            <span className="name" style={{ opacity: 0.5 }}>{match.away_placeholder}</span>
                          )}
                        </div>
                      </div>
                      <div className="prediction-controls">
                        {/* 1x2 Options Placeholder */}
                        <div className="options-1x2">
                          <button className="opt-btn"><span>L</span></button>
                          <button className="opt-btn"><span>E</span></button>
                          <button className="opt-btn"><span>V</span></button>
                        </div>
                        <div className="score-inputs">
                          <input 
                            type="number" 
                            placeholder="0" 
                            value={edit.home}
                            onChange={(e) => handleScoreChange(match.id, 'home', e.target.value)}
                            disabled={isFinished}
                            style={{
                              borderColor: isSaved && !isPending ? '#5C45F240' : undefined,
                            }}
                          />
                          <span>-</span>
                          <input 
                            type="number" 
                            placeholder="0" 
                            value={edit.away}
                            onChange={(e) => handleScoreChange(match.id, 'away', e.target.value)}
                            disabled={isFinished}
                            style={{
                              borderColor: isSaved && !isPending ? '#5C45F240' : undefined,
                            }}
                          />
                        </div>
                        {/* Points badge for finished matches */}
                        {isFinished && existing && (
                          <div style={{
                            marginTop: '0.5rem',
                            display: 'flex',
                            justifyContent: 'center',
                          }}>
                            <span style={{
                              background: 'rgba(0,104,71,0.15)',
                              border: '1px solid rgba(0,104,71,0.4)',
                              color: '#00D26A',
                              borderRadius: '99px',
                              padding: '0.2rem 0.75rem',
                              fontSize: '0.65rem',
                              fontWeight: 900,
                              letterSpacing: '0.05em',
                              textTransform: 'uppercase',
                            }}>
                              {existing.predicted_home_goals} - {existing.predicted_away_goals} • TU PICK
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
             </section>
           </div>
          );
        }))
      }

      {pendingChanges.length > 0 && (
        <div className="sticky-action-bar">
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontSize: '0.6rem', fontWeight: 800, opacity: 0.6, textTransform: 'uppercase' }}>Resumen Selección</div>
            <div style={{ fontWeight: 900, fontSize: '0.9rem', fontStyle: 'italic' }}>
              <span className="text-accent">{pendingChanges.length} CAMBIOS</span> PENDIENTES
            </div>
          </div>
          <button 
            className="btn-primary" 
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.8rem', borderRadius: '99px' }}
            onClick={handleSaveAll}
            disabled={saving}
          >
            {saving ? 'GUARDANDO...' : 'ENVIAR PRONÓSTICOS'}
          </button>
        </div>
      )}

    </AppLayout>
  );
}
