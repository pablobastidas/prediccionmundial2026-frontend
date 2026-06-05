"use client";
import React, { useState, useEffect } from 'react';
import LiveTicker from '@/components/LiveTicker';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import AppLayout from '@/components/layout/AppLayout';

type MatchNode = {
  id: string;
  team1: string | null;
  team2: string | null;
  winner: string | null;
};

const INITIAL_TEAMS = [
  "México", "Países Bajos", "Argentina", "Francia",
  "España", "Alemania", "Brasil", "Uruguay",
  "Inglaterra", "Senegal", "USA", "Gales",
  "Portugal", "Corea Sur", "Bélgica", "Japón"
];

const GROUPS = ['A','B','C','D','E','F','G','H','I','J','K','L'];   
const TEAMS_BY_GROUP: Record<string, string[]> = {
  A: ['México', 'Países Bajos', 'Ghana', 'Uzbekistán'],
  B: ['Canadá', 'Bélgica', 'Corea del Sur', 'Malí'],
  C: ['USA', 'España', 'Japón', 'Zambia'],
  D: ['Argentina', 'Dinamarca', 'Ecuador', 'Omán'],
  E: ['Brasil', 'Suiza', 'Costa Rica', 'Irak'],
  F: ['Francia', 'Colombia', 'Noruega', 'Egipto'],
  G: ['Inglaterra', 'Uruguay', 'Turquía', 'Jamaica'],
  H: ['Portugal', 'Croacia', 'Irán', 'Panamá'],
  I: ['Italia', 'Marruecos', 'Australia', 'Honduras'],
  J: ['Alemania', 'Chile', 'Nigeria', 'Catar'],
  K: ['España', 'Serbia', 'Arabia Saudita', 'Perú'],
  L: ['Polonia', 'Ucrania', 'Senegal', 'Túnez']
};

export default function Simulator() {
  const { signOut, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  const [activeTab, setActiveTab] = useState<'grupos' | 'eliminatorias'>('grupos');
  const [groupWinners, setGroupWinners] = useState<Record<string, string[]>>({});

  const handleGroupSelect = (group: string, team: string) => {
    setGroupWinners(prev => {
      const current = prev[group] || [];
      if (current.includes(team)) {
        return { ...prev, [group]: current.filter(t => t !== team) };
      }
      if (current.length >= 2) return prev;
      return { ...prev, [group]: [...current, team] };
    });
  };

  // Setup 8 octavos, 4 cuartos, 2 semis, 1 final
  const [octavos, setOctavos] = useState<MatchNode[]>(
    Array.from({ length: 8 }).map((_, i) => ({
      id: `o${i}`,
      team1: INITIAL_TEAMS[i * 2],
      team2: INITIAL_TEAMS[i * 2 + 1],
      winner: null
    }))
  );
  const [cuartos, setCuartos] = useState<MatchNode[]>(
    Array.from({ length: 4 }).map((_, i) => ({ id: `q${i}`, team1: null, team2: null, winner: null }))
  );
  const [semis, setSemis] = useState<MatchNode[]>(
    Array.from({ length: 2 }).map((_, i) => ({ id: `s${i}`, team1: null, team2: null, winner: null }))
  );
  const [final, setFinal] = useState<MatchNode[]>([
    { id: `f0`, team1: null, team2: null, winner: null }
  ]);
  const [champion, setChampion] = useState<string | null>(null);

  if (loading || !isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  const handleAdvance = (stage: string, matchIndex: number, winner: string) => {
    if (stage === 'octavos') {
      const newOctavos = [...octavos];
      newOctavos[matchIndex].winner = winner;
      setOctavos(newOctavos);

      const nextIndex = Math.floor(matchIndex / 2);
      const isTeam1 = matchIndex % 2 === 0;
      const newCuartos = [...cuartos];
      if (isTeam1) newCuartos[nextIndex].team1 = winner;
      else newCuartos[nextIndex].team2 = winner;
      newCuartos[nextIndex].winner = null; 
      setCuartos(newCuartos);
      resetDownstream('cuartos', nextIndex);
    } 
    else if (stage === 'cuartos') {
      const newCuartos = [...cuartos];
      newCuartos[matchIndex].winner = winner;
      setCuartos(newCuartos);

      const nextIndex = Math.floor(matchIndex / 2);
      const isTeam1 = matchIndex % 2 === 0;
      const newSemis = [...semis];
      if (isTeam1) newSemis[nextIndex].team1 = winner;
      else newSemis[nextIndex].team2 = winner;
      newSemis[nextIndex].winner = null;
      setSemis(newSemis);
      resetDownstream('semis', nextIndex);
    }
    else if (stage === 'semis') {
      const newSemis = [...semis];
      newSemis[matchIndex].winner = winner;
      setSemis(newSemis);

      const nextIndex = 0;
      const isTeam1 = matchIndex % 2 === 0;
      const newFinal = [...final];
      if (isTeam1) newFinal[nextIndex].team1 = winner;
      else newFinal[nextIndex].team2 = winner;
      newFinal[nextIndex].winner = null;
      setFinal(newFinal);
      setChampion(null);
    }
    else if (stage === 'final') {
      const newFinal = [...final];
      newFinal[matchIndex].winner = winner;
      setFinal(newFinal);
      setChampion(winner);
    }
  };

  const resetDownstream = (fromStage: string, index: number) => {
    if (fromStage === 'cuartos') {
      const nextIndex = Math.floor(index / 2);
      const newSemis = [...semis];
      if (index % 2 === 0) newSemis[nextIndex].team1 = null; else newSemis[nextIndex].team2 = null;
      newSemis[nextIndex].winner = null;
      setSemis(newSemis);
      resetDownstream('semis', nextIndex);
    } else if (fromStage === 'semis') {
      const newFinal = [...final];
      if (index % 2 === 0) newFinal[0].team1 = null; else newFinal[0].team2 = null;
      newFinal[0].winner = null;
      setFinal(newFinal);
      setChampion(null);
    }
  };

  return (
    <>
      <style>{`
        .tab-nav {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          border-bottom: 1px solid var(--border);
          padding-bottom: 1rem;
          overflow-x: auto;
        }
        .tab-btn {
          background: transparent;
          padding: 0.75rem 1.5rem;
          font-weight: 800;
          font-style: italic;
          text-transform: uppercase;
          color: var(--fg-muted);
          border-radius: var(--radius-sm);
          transition: all 0.2s;
          white-space: nowrap;
        }
        .tab-btn.active { background: var(--accent); color: white; }

        .section-sim { display: none; }
        .section-sim.active { display: block; }

        .groups-grid-full {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .group-card-sim {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .group-title-sim {
          font-weight: 900;
          color: var(--accent);
          margin-bottom: 1rem;
          font-style: italic;
          text-transform: uppercase;
        }
        .team-sim-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.75rem;
          background: var(--bg);
          margin-bottom: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid transparent;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .team-sim-row:hover { border-color: var(--accent-soft); }
        .team-sim-row.pos-1 { border-color: var(--success); background: #f0fdf4; }
        .team-sim-row.pos-2 { border-color: var(--primary); background: #f5f3ff; }

        .match-box {
          background: var(--surface);
          border-radius: var(--radius-lg);
          padding: 0.5rem;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          margin-bottom: 1rem;
        }
        .team-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          font-weight: 800;
          font-size: 0.9rem;
        }
        .team-row.selected { background: var(--accent); color: white; }

        .champion-box {
          margin-top: 4rem;
          padding: 3rem;
          background: var(--surface);
          border-radius: var(--radius-lg);
          border: 3px solid var(--accent);
          text-align: center;
          box-shadow: var(--shadow-lg);
        }
      `}</style>
      <AppLayout activeRoute="/simulator">
        <header className="page-header">
          <div>
            <div className="badge-slant" style={{ marginBottom: '0.5rem' }}><span>Simulador Pro</span></div>
            <h1>EL CAMINO A LA <span className="text-accent">GLORIA</span></h1>       
          </div>
          <div className="pill purple">Mundial Completo</div>
        </header>

        <nav className="tab-nav custom-scrollbar">
          <button className={`tab-btn ${activeTab === 'grupos' ? 'active' : ''}`} onClick={() => setActiveTab('grupos')}>1. Fase de Grupos</button>
          <button className={`tab-btn ${activeTab === 'eliminatorias' ? 'active' : ''}`} onClick={() => setActiveTab('eliminatorias')}>2. Eliminatorias</button>
        </nav>

        <div id="grupos" className={`section-sim ${activeTab === 'grupos' ? 'active' : ''}`}>
          <div className="groups-grid-full">
            {GROUPS.map(g => (
              <div key={g} className="group-card-sim">
                <div className="group-title-sim">GRUPO {g}</div>
                <div className="team-list">
                  {TEAMS_BY_GROUP[g].map(t => {
                    const isSelected = groupWinners[g]?.includes(t);
                    const pos = isSelected ? groupWinners[g].indexOf(t) + 1 : null;
                    return (
                      <div 
                        key={t} 
                        className={`team-sim-row ${pos ? 'pos-' + pos : ''}`} 
                        onClick={() => handleGroupSelect(g, t)}
                      >
                        <span>{t}</span>
                        <span className="pos-num" style={{ fontSize: '0.6rem', fontWeight: 800 }}>{pos ? pos + '°' : ''}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="eliminatorias" className={`section-sim ${activeTab === 'eliminatorias' ? 'active' : ''}`}>
          <div className="bracket-wrapper custom-scrollbar">
            <div className="round">
              {octavos.map((m, i) => (
                <div key={m.id} className="match-box">
                  <div className={`team-row ${m.winner === m.team1 && m.team1 ? 'selected' : ''}`} onClick={() => m.team1 && handleAdvance('octavos', i, m.team1)}>
                    <span>{m.team1 || 'TBD'}</span>
                  </div>
                  <div className={`team-row ${m.winner === m.team2 && m.team2 ? 'selected' : ''}`} onClick={() => m.team2 && handleAdvance('octavos', i, m.team2)}>
                    <span>{m.team2 || 'TBD'}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="round">
              {cuartos.map((m, i) => (
                <div key={m.id} className="match-box">
                  <div className={`team-row ${m.winner === m.team1 && m.team1 ? 'selected' : ''}`} onClick={() => m.team1 && handleAdvance('cuartos', i, m.team1)}>
                    <span>{m.team1 || 'TBD'}</span>
                  </div>
                  <div className={`team-row ${m.winner === m.team2 && m.team2 ? 'selected' : ''}`} onClick={() => m.team2 && handleAdvance('cuartos', i, m.team2)}>
                    <span>{m.team2 || 'TBD'}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="round">
              {semis.map((m, i) => (
                <div key={m.id} className="match-box">
                  <div className={`team-row ${m.winner === m.team1 && m.team1 ? 'selected' : ''}`} onClick={() => m.team1 && handleAdvance('semis', i, m.team1)}>
                    <span>{m.team1 || 'TBD'}</span>
                  </div>
                  <div className={`team-row ${m.winner === m.team2 && m.team2 ? 'selected' : ''}`} onClick={() => m.team2 && handleAdvance('semis', i, m.team2)}>
                    <span>{m.team2 || 'TBD'}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="round">
              {final.map((m, i) => (
                <div key={m.id} className="match-box">
                  <div className={`team-row ${m.winner === m.team1 && m.team1 ? 'selected' : ''}`} onClick={() => m.team1 && handleAdvance('final', i, m.team1)}>
                    <span>{m.team1 || 'TBD'}</span>
                  </div>
                  <div className={`team-row ${m.winner === m.team2 && m.team2 ? 'selected' : ''}`} onClick={() => m.team2 && handleAdvance('final', i, m.team2)}>
                    <span>{m.team2 || 'TBD'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="champion-box">
            <p className="text-muted" style={{ fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', fontSize: '0.7rem' }}>Campeón del Mundo</p>
            <h2 className="text-accent" id="championName" style={{ fontSize: '3rem' }}>{champion || '¿QUIÉN GANARÁ?'}</h2>
          </div>
        </div>
      </AppLayout>
    </>
  );
}
