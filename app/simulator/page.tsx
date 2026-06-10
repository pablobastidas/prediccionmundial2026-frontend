"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import AppLayout from '@/components/layout/AppLayout';
import { getGroupsWithTeams } from '@/services/tournamentService';
import { 
  getSimulatorStatus, 
  loadSimulatorPrediction, 
  saveSimulatorPrediction, 
  SimulatorStatus, 
  BracketPredictionData 
} from '@/services/simulatorService';
import { showToast } from '@/components/ui/Toast';

// ─── TYPES ────────────────────────────────────────────────────────────────────
type TeamEntry = { name: string; flag: string };
type BracketSlot = { team: TeamEntry | null; winner: boolean };
type BracketMatch = { id: string; home: BracketSlot; away: BracketSlot };

function emptyMatch(id: string): BracketMatch {
  return { id, home: { team: null, winner: false }, away: { team: null, winner: false } };
}

const FLAG_URL = (code: string) =>
  `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

// Scoring rules constant — displayed in the rules panel
const SCORING_RULES = [
  { icon: '🎯', pts: '+5', label: 'Ganador de Grupo', desc: 'Acertaste el primer lugar del grupo' },
  { icon: '✅', pts: '+2', label: 'Clasificado', desc: 'Acertaste el segundo lugar del grupo' },
  { icon: '🏆', pts: '+10', label: 'Campeón', desc: 'Predijiste el campeón real del torneo' },
  { icon: '⚡', pts: '+2', label: 'Finalista', desc: 'Predijiste un equipo en la final real' },
  { icon: '🥉', pts: '+1', label: 'Top 4', desc: 'Predijiste un equipo en semifinales reales' },
];

export default function Simulator() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  const [activeTab, setActiveTab] = useState<'reglas' | 'grupos' | 'bracket'>('reglas');

  // GROUP PHASE state — track all 4 positions
  const [groupPicks, setGroupPicks] = useState<Record<string, string[]>>({});
  const [groupsData, setGroupsData] = useState<Record<string, { name: string; flag: string }[]>>({});
  const [groupsLoading, setGroupsLoading] = useState(true);

  // Best third-placed teams selection
  const [selectedThirds, setSelectedThirds] = useState<string[]>([]);

  // Bracket state
  const makeRound = (n: number, prefix: string) =>
    Array.from({ length: n }, (_, i) => emptyMatch(`${prefix}${i}`));

  const [r32, setR32] = useState<BracketMatch[]>(makeRound(16, 'r32_'));
  const [r16, setR16] = useState<BracketMatch[]>(makeRound(8, 'r16_'));
  const [qf, setQf] = useState<BracketMatch[]>(makeRound(4, 'qf_'));
  const [sf, setSf] = useState<BracketMatch[]>(makeRound(2, 'sf_'));
  const [final3rd, setFinal3rd] = useState<BracketMatch[]>(makeRound(1, 'f3_'));
  const [finalMatch, setFinalMatch] = useState<BracketMatch[]>(makeRound(1, 'fin_'));
  const [champion, setChampion] = useState<TeamEntry | null>(null);
  const [third, setThird] = useState<TeamEntry | null>(null);

  // Status and database state
  const [status, setStatus] = useState<SimulatorStatus | null>(null);
  const [saving, setSaving] = useState(false);
  const [isRestored, setIsRestored] = useState(false);

  // Load from database groups
  useEffect(() => {
    const fetchGroups = async () => {
      setGroupsLoading(true);
      try {
        const data = await getGroupsWithTeams();
        if (data && data.length > 0) {
          const parsedGroups: Record<string, { name: string; flag: string }[]> = {};
          data.forEach((g: any) => {
            const groupKey = g.name.replace('Grupo ', '').trim();
            parsedGroups[groupKey] = g.teams.map((t: any) => ({
              name: t.name,
              flag: t.flag_emoji || 'un'
            }));
          });
          setGroupsData(parsedGroups);
        }
      } catch (err) {
        console.error("Error fetching groups for simulator:", err);
      } finally {
        setGroupsLoading(false);
      }
    };
    if (isAuthenticated) {
      fetchGroups();
    }
  }, [isAuthenticated]);

  // Load State from Database first, fallback to localStorage
  useEffect(() => {
    const loadState = async () => {
      if (!isAuthenticated) return;
      try {
        // Load locks status
        const lockStatus = await getSimulatorStatus();
        setStatus(lockStatus);

        // Load database prediction
        const dbPred = await loadSimulatorPrediction();
        if (dbPred && (dbPred.group_picks || dbPred.bracket_picks)) {
          restoreState(dbPred);
        } else {
          // Fallback to local draft
          const saved = localStorage.getItem('wc_simulator_state');
          if (saved) {
            const parsed = JSON.parse(saved);
            restoreState(parsed);
          }
        }
      } catch (e) {
        console.error("Error loading simulator state:", e);
      } finally {
        setIsRestored(true);
      }
    };
    loadState();
  }, [isAuthenticated]);

  const restoreState = (data: BracketPredictionData | any) => {
    if (data.group_picks) setGroupPicks(data.group_picks);
    if (data.selected_thirds) setSelectedThirds(data.selected_thirds);
    if (data.r32) setR32(data.r32);
    else if (data.bracket_picks?.r32) setR32(data.bracket_picks.r32);
    
    if (data.r16) setR16(data.r16);
    else if (data.bracket_picks?.r16) setR16(data.bracket_picks.r16);

    if (data.qf) setQf(data.qf);
    else if (data.bracket_picks?.qf) setQf(data.bracket_picks.qf);

    if (data.sf) setSf(data.sf);
    else if (data.bracket_picks?.sf) setSf(data.bracket_picks.sf);

    if (data.finalMatch) setFinalMatch(data.finalMatch);
    else if (data.bracket_picks?.finalMatch) setFinalMatch(data.bracket_picks.finalMatch);

    if (data.final3rd) setFinal3rd(data.final3rd);
    else if (data.bracket_picks?.final3rd) setFinal3rd(data.bracket_picks.final3rd);

    if (data.champion) setChampion(data.champion);
    else if (data.champion_name) setChampion({ name: data.champion_name, flag: 'un' });

    if (data.third) setThird(data.third);
    else if (data.third_name) setThird({ name: data.third_name, flag: 'un' });

    if (data.activeTab) setActiveTab(data.activeTab);
  };

  // Local auto-save in localStorage (draft mode)
  useEffect(() => {
    if (isRestored) {
      const currentState = {
        groupPicks,
        selectedThirds,
        r32,
        r16,
        qf,
        sf,
        finalMatch,
        final3rd,
        champion,
        third,
        activeTab
      };
      localStorage.setItem('wc_simulator_state', JSON.stringify(currentState));
    }
  }, [groupPicks, selectedThirds, r32, r16, qf, sf, finalMatch, final3rd, champion, third, activeTab, isRestored]);

  // Handle Save to Database
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: BracketPredictionData = {
        group_picks: groupPicks,
        selected_thirds: selectedThirds,
        bracket_picks: {
          r32, r16, qf, sf, finalMatch, final3rd
        },
        champion_name: champion?.name || undefined,
        third_name: third?.name || undefined
      };
      await saveSimulatorPrediction(payload);
      showToast('¡Predicciones del simulador guardadas en base de datos! 💾', 'success');
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.detail || 'Error al guardar. Verifica las restricciones.';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Reset simulation state
  const handleReset = () => {
    if (window.confirm('¿Seguro que deseas reiniciar toda la simulación?')) {
      localStorage.removeItem('wc_simulator_state');
      setGroupPicks({});
      setSelectedThirds([]);
      setR32(makeRound(16, 'r32_'));
      setR16(makeRound(8, 'r16_'));
      setQf(makeRound(4, 'qf_'));
      setSf(makeRound(2, 'sf_'));
      setFinalMatch(makeRound(1, 'fin_'));
      setFinal3rd(makeRound(1, 'f3_'));
      setChampion(null);
      setThird(null);
      setActiveTab('reglas');
      showToast('Simulador reiniciado.', 'success');
    }
  };

  const handleGroupPick = useCallback((group: string, teamName: string) => {
    if (status?.group_locked) {
      showToast('La fase de grupos está bloqueada por fecha de fixture.', 'error');
      return;
    }

    setGroupPicks(prev => {
      const current = prev[group] || [];
      if (current.includes(teamName)) {
        // Reset group selection on double tap to allow re-ordering
        return { ...prev, [group]: [] };
      }
      
      const nextPicks = [...current, teamName];
      
      // Auto-fill 3rd and 4th place once top 2 are selected
      if (nextPicks.length === 2) {
        const groupTeams = groupsData[group] || [];
        const remaining = groupTeams
          .filter(t => !nextPicks.includes(t.name))
          .map(t => t.name);
        return { ...prev, [group]: [...nextPicks, ...remaining] };
      }
      
      return { ...prev, [group]: nextPicks };
    });
  }, [groupsData, status]);

  const toggleThirdPick = (teamName: string) => {
    if (status?.group_locked) {
      showToast('La fase de grupos está bloqueada.', 'error');
      return;
    }
    setSelectedThirds(prev => {
      if (prev.includes(teamName)) {
        return prev.filter(t => t !== teamName);
      }
      if (prev.length >= 8) return prev;
      return [...prev, teamName];
    });
  };

  const groupKeys = Object.keys(groupsData);
  const groupsCompleted = groupKeys.filter(g => (groupPicks[g]?.length ?? 0) === 4).length;
  const groupProgress = groupKeys.length > 0 ? Math.round((groupsCompleted / groupKeys.length) * 100) : 0;

  // Get the 12 third-place teams
  const thirdPlaceTeams = groupKeys.map(g => {
    const picks = groupPicks[g] || [];
    if (picks.length >= 3) {
      const teamName = picks[2];
      const groupTeams = groupsData[g] || [];
      const teamObj = groupTeams.find(t => t.name === teamName);
      return { name: teamName, flag: teamObj?.flag || 'un', group: g };
    }
    return null;
  }).filter(Boolean) as { name: string; flag: string; group: string }[];

  const getTeamOrPlaceholder = (groupKey: string, pos: 1 | 2) => {
    const picks = groupPicks[groupKey];
    if (picks && picks.length >= pos) {
      const teamName = picks[pos - 1];
      const groupTeams = groupsData[groupKey] || [];
      const teamObj = groupTeams.find(t => t.name === teamName);
      return { name: teamName, flag: teamObj?.flag || 'un' };
    }
    return { name: `${pos}° Grupo ${groupKey}`, flag: 'un' };
  };

  const getThirdTeamOrPlaceholder = (idx: number) => {
    if (selectedThirds.length > idx) {
      const teamName = selectedThirds[idx];
      let flag = 'un';
      for (const g of groupKeys) {
        const found = (groupsData[g] || []).find(t => t.name === teamName);
        if (found) {
          flag = found.flag;
          break;
        }
      }
      return { name: teamName, flag };
    }
    return { name: `3° Clasificado ${idx + 1}`, flag: 'un' };
  };

  const handleProceedToBracket = () => {
    if (!status?.knockout_unlocked) {
      showToast('La fase eliminatoria se habilitará cuando finalice la fase de grupos.', 'error');
      return;
    }
    const newR32: BracketMatch[] = [
      { id: 'r32_0', home: { team: getTeamOrPlaceholder('A', 2), winner: false }, away: { team: getTeamOrPlaceholder('B', 2), winner: false } },
      { id: 'r32_1', home: { team: getTeamOrPlaceholder('C', 1), winner: false }, away: { team: getTeamOrPlaceholder('F', 2), winner: false } },
      { id: 'r32_2', home: { team: getTeamOrPlaceholder('E', 1), winner: false }, away: { team: getThirdTeamOrPlaceholder(0), winner: false } },
      { id: 'r32_3', home: { team: getTeamOrPlaceholder('F', 1), winner: false }, away: { team: getTeamOrPlaceholder('C', 2), winner: false } },
      { id: 'r32_4', home: { team: getTeamOrPlaceholder('E', 2), winner: false }, away: { team: getTeamOrPlaceholder('I', 2), winner: false } },
      { id: 'r32_5', home: { team: getTeamOrPlaceholder('I', 1), winner: false }, away: { team: getThirdTeamOrPlaceholder(1), winner: false } },
      { id: 'r32_6', home: { team: getTeamOrPlaceholder('A', 1), winner: false }, away: { team: getThirdTeamOrPlaceholder(2), winner: false } },
      { id: 'r32_7', home: { team: getTeamOrPlaceholder('L', 1), winner: false }, away: { team: getThirdTeamOrPlaceholder(3), winner: false } },
      { id: 'r32_8', home: { team: getTeamOrPlaceholder('G', 1), winner: false }, away: { team: getThirdTeamOrPlaceholder(4), winner: false } },
      { id: 'r32_9', home: { team: getTeamOrPlaceholder('D', 1), winner: false }, away: { team: getThirdTeamOrPlaceholder(5), winner: false } },
      { id: 'r32_10', home: { team: getTeamOrPlaceholder('H', 1), winner: false }, away: { team: getTeamOrPlaceholder('J', 2), winner: false } },
      { id: 'r32_11', home: { team: getTeamOrPlaceholder('K', 2), winner: false }, away: { team: getTeamOrPlaceholder('L', 2), winner: false } },
      { id: 'r32_12', home: { team: getTeamOrPlaceholder('B', 1), winner: false }, away: { team: getThirdTeamOrPlaceholder(6), winner: false } },
      { id: 'r32_13', home: { team: getTeamOrPlaceholder('D', 2), winner: false }, away: { team: getTeamOrPlaceholder('G', 2), winner: false } },
      { id: 'r32_14', home: { team: getTeamOrPlaceholder('J', 1), winner: false }, away: { team: getTeamOrPlaceholder('H', 2), winner: false } },
      { id: 'r32_15', home: { team: getTeamOrPlaceholder('K', 1), winner: false }, away: { team: getThirdTeamOrPlaceholder(7), winner: false } },
    ];
    setR32(newR32);
    setR16(makeRound(8, 'r16_'));
    setQf(makeRound(4, 'qf_'));
    setSf(makeRound(2, 'sf_'));
    setFinal3rd(makeRound(1, 'f3_'));
    setFinalMatch(makeRound(1, 'fin_'));
    setChampion(null);
    setThird(null);
    setActiveTab('bracket');
  };

  // ─── RENDER HELPERS ─────────────────────────────────────────────────────────
  function TeamFlag({ team, size = 28 }: { team: TeamEntry | null; size?: number }) {
    if (!team) return <span style={{ opacity: 0.3, fontSize: '0.75rem', fontWeight: 800 }}>TBD</span>;
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <img
          src={FLAG_URL(team.flag)}
          alt={team.name}
          width={size}
          height={size * 0.67}
          style={{ borderRadius: 3, objectFit: 'cover', border: '1px solid var(--border)' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <span style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '-0.01em', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '120px' }}>
          {team.name}
        </span>
      </span>
    );
  }

  function BracketMatchCard({
    match, label, onPick,
  }: {
    match: BracketMatch;
    label?: string;
    onPick: (slot: 'home' | 'away') => void;
  }) {
    const isDisabled = !status?.knockout_unlocked;
    return (
      <div className="bracket-match-card">
        {label && (
          <div style={{ 
            fontSize: '0.55rem', 
            padding: '0.25rem 0.5rem', 
            background: 'var(--bg)', 
            borderBottom: '1px solid var(--border)', 
            textAlign: 'center', 
            fontWeight: 800,
            textTransform: 'uppercase',
            color: 'var(--accent)'
          }}>
            {label}
          </div>
        )}
        <button
          className={`bracket-team-row ${match.home.winner ? 'winner' : ''}`}
          onClick={() => onPick('home')}
          disabled={!match.home.team || isDisabled}
        >
          <TeamFlag team={match.home.team} />
          {match.home.winner && <span className="winner-crown">👑</span>}
        </button>
        <div className="bracket-vs">VS</div>
        <button
          className={`bracket-team-row ${match.away.winner ? 'winner' : ''}`}
          onClick={() => onPick('away')}
          disabled={!match.away.team || isDisabled}
        >
          <TeamFlag team={match.away.team} />
          {match.away.winner && <span className="winner-crown">👑</span>}
        </button>
      </div>
    );
  }

  return (
    <AppLayout activeRoute="/simulator">
      <style>{`
        /* ── TAB NAV ── */
        .sim-tab-nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2.5rem;
          background: var(--bg);
          padding: 0.35rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border);
          width: fit-content;
        }
        .sim-tab-btn {
          padding: 0.65rem 1.25rem;
          border-radius: 10px;
          font-weight: 800;
          font-size: 0.8rem;
          text-transform: uppercase;
          font-style: italic;
          transition: all 0.2s;
          color: var(--fg-muted);
          background: transparent;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .sim-tab-btn.active { background: var(--accent); color: white; }
        .sim-tab-btn:not(.active):hover { background: var(--surface); color: var(--fg); }

        /* ── PROGRESS BAR ── */
        .sim-progress-wrap {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 1rem 1.5rem;
        }
        .sim-progress-bar {
          flex: 1;
          height: 8px;
          background: var(--bg);
          border-radius: 99px;
          overflow: hidden;
        }
        .sim-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--primary));
          border-radius: 99px;
          transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* ── GROUP PHASE ── */
        .groups-grid-full {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1.25rem;
        }
        .group-card-sim {
          background: var(--surface);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
          transition: box-shadow 0.2s;
        }
        .group-card-sim:hover { box-shadow: var(--shadow-md); }
        .group-card-sim.complete { border-color: var(--success); }
        .group-title-sim {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 900;
          color: var(--accent);
          margin-bottom: 0.75rem;
          font-style: italic;
          text-transform: uppercase;
          font-size: 0.9rem;
        }
        .group-complete-badge {
          font-size: 0.55rem;
          font-weight: 900;
          background: var(--success);
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 99px;
          text-transform: uppercase;
          font-style: normal;
        }
        .team-sim-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.55rem 0.75rem;
          background: var(--bg);
          margin-bottom: 0.4rem;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid transparent;
          font-size: 0.82rem;
          font-weight: 700;
          transition: all 0.15s;
        }
        .team-sim-row:last-child { margin-bottom: 0; }
        .team-sim-row:hover { border-color: var(--accent-soft); background: rgba(255,61,0,0.03); }
        .team-sim-row.pos-1 { border-color: var(--success); background: rgba(0,210,106,0.06); }
        .team-sim-row.pos-2 { border-color: var(--primary); background: rgba(0,102,204,0.06); }
        .team-sim-row.pos-3 { border-color: var(--warning, #f0a500); background: rgba(240,165,0,0.06); }
        .team-sim-row.pos-4 { border-color: var(--danger, #ff3d00); background: rgba(255,61,0,0.06); }
        .team-flag-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .team-flag-row img { border-radius: 2px; border: 1px solid var(--border); }
        .pos-badge-sim {
          font-size: 0.6rem;
          font-weight: 900;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pos-1 .pos-badge-sim { background: var(--success); color: white; }
        .pos-2 .pos-badge-sim { background: var(--primary); color: white; }
        .pos-3 .pos-badge-sim { background: var(--warning, #f0a500); color: white; }
        .pos-4 .pos-badge-sim { background: var(--danger, #ff3d00); color: white; }

        /* ── BRACKET TREE STRUCTURE ── */
        .bracket-scroll-wrapper {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE/Edge */
        }
        .bracket-scroll-wrapper::-webkit-scrollbar {
          display: none; /* Safari/Chrome */
        }
        .bracket-container {
          display: flex;
          gap: 2rem;
          height: 980px;
          align-items: stretch;
          padding: 1rem 0.5rem;
          min-width: max-content;
        }
        .bracket-round-col {
          display: flex;
          flex-direction: column;
          min-width: 200px;
          max-width: 220px;
        }
        .bracket-round-title {
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--accent);
          padding: 0 0.5rem;
          margin-bottom: 0.5rem;
          text-align: center;
          border-bottom: 2px solid var(--border);
          padding-bottom: 0.5rem;
        }
        .bracket-round-matches {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          flex-grow: 1;
        }
        .bracket-match-card {
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .bracket-match-card:hover { 
          border-color: var(--accent); 
          box-shadow: var(--shadow-md), 0 5px 15px rgba(255, 61, 0, 0.08); 
          transform: scale(1.02);
        }
        .bracket-team-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.45rem 0.75rem;
          width: 100%;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: inherit;
          transition: background 0.15s;
          text-align: left;
        }
        .bracket-team-row:hover:not(:disabled) { background: var(--bg); }
        .bracket-team-row.winner { background: var(--accent); color: white; }
        .bracket-team-row.winner img { border-color: rgba(255,255,255,0.3); }
        .bracket-team-row:disabled { cursor: default; opacity: 0.6; }
        .bracket-vs {
          text-align: center;
          font-size: 0.55rem;
          font-weight: 900;
          opacity: 0.25;
          padding: 0.15rem;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .winner-crown { font-size: 0.8rem; margin-left: 0.25rem; }

        /* ── CHAMPION BOX ── */
        .champion-reveal {
          margin-top: 3rem;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, var(--primary) 0%, #3d2ec7 100%);
          border-radius: var(--radius-lg);
          text-align: center;
          color: white;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px var(--primary-soft);
        }
        .champion-reveal::before {
          content: '🏆';
          position: absolute;
          font-size: 12rem;
          opacity: 0.06;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .champion-name {
          font-size: clamp(2rem, 8vw, 4rem);
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          line-height: 1;
          margin-top: 1rem;
        }
        .champion-label {
          font-size: 0.7rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          opacity: 0.7;
        }

        /* ── RULES PANEL ── */
        .rules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .rule-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 1.25rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          box-shadow: var(--shadow-sm);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .rule-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }
        .rule-icon { font-size: 1.75rem; flex-shrink: 0; }
        .rule-pts {
          font-size: 1.5rem;
          font-weight: 900;
          font-style: italic;
          color: var(--accent);
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        .rule-label { font-weight: 900; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.25rem; }
        .rule-desc { font-size: 0.75rem; color: var(--fg-muted); font-weight: 600; line-height: 1.4; }

        .sim-info-box {
          background: var(--primary-soft);
          border: 1px solid rgba(92,69,242,0.2);
          border-radius: var(--radius-md);
          padding: 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .sim-info-box-icon { font-size: 1.5rem; flex-shrink: 0; }

        @media (max-width: 640px) {
          .sim-tab-nav { width: 100%; overflow-x: auto; }
          .groups-grid-full { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
        }
        @media (max-width: 400px) {
          .groups-grid-full { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── PAGE HEADER ── */}
      <header className="page-header">
        <div>
          <div className="badge-slant" style={{ marginBottom: '0.5rem' }}><span>Simulador Pro</span></div>
          <h1>EL CAMINO A LA <span className="text-accent">GLORIA</span></h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={handleSave} 
            className="btn-primary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            disabled={saving}
          >
            💾 {saving ? 'GUARDANDO...' : 'GUARDAR EN DB'}
          </button>
          <button onClick={handleReset} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
            🔄 REINICIAR
          </button>
          <span className="pill purple">Mundial 2026</span>
          <span className="pill" style={{ background: 'var(--bg)', border: '1px solid var(--border)', fontSize: '0.7rem' }}>
            48 equipos · 12 grupos
          </span>
        </div>
      </header>

      {/* ── TAB NAV ── */}
      <nav className="sim-tab-nav custom-scrollbar">
        <button
          className={`sim-tab-btn ${activeTab === 'reglas' ? 'active' : ''}`}
          onClick={() => setActiveTab('reglas')}
        >
          📋 Reglas
        </button>
        <button
          className={`sim-tab-btn ${activeTab === 'grupos' ? 'active' : ''}`}
          onClick={() => setActiveTab('grupos')}
        >
          ⚽ Fase de Grupos
          {groupsCompleted > 0 && (
            <span style={{
              background: 'rgba(255,255,255,0.25)',
              borderRadius: '99px',
              padding: '0.1rem 0.5rem',
              fontSize: '0.65rem',
            }}>
              {groupsCompleted}/12
            </span>
          )}
        </button>
        <button
          className={`sim-tab-btn ${activeTab === 'bracket' ? 'active' : ''}`}
          onClick={() => setActiveTab('bracket')}
        >
          🏆 Bracket Eliminatorio
        </button>
      </nav>

      {/* REGLAS TAB */}
      {activeTab === 'reglas' && (
        <div>
          <div className="sim-info-box">
            <span className="sim-info-box-icon">💡</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                ¿Cómo funciona el simulador completo?
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--fg-muted)', fontWeight: 600, lineHeight: 1.6 }}>
                Clasifica los 12 grupos seleccionando tu 1° y 2° puesto en cada uno. Los puestos 3° y 4° se llenarán automáticamente.
                Elige los <strong>8 mejores terceros</strong> para avanzar a la Ronda de 32, y finalmente juega el bracket interactivo hasta el campeón.
                Recuerda presionar el botón <strong>GUARDAR EN DB</strong> para registrar tu simulación.
              </p>
            </div>
          </div>

          <h3 style={{ marginBottom: '1.5rem' }}>Sistema de <span className="text-accent">Puntuación</span></h3>
          <div className="rules-grid">
            {SCORING_RULES.map(rule => (
              <div key={rule.label} className="rule-card">
                <span className="rule-icon">{rule.icon}</span>
                <div>
                  <div className="rule-pts">{rule.pts} pts</div>
                  <div className="rule-label">{rule.label}</div>
                  <div className="rule-desc">{rule.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GRUPOS TAB */}
      {activeTab === 'grupos' && (
        <div>
          <div className="sim-progress-wrap">
            <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', flexShrink: 0 }}>
              Progreso Grupos: <span className="text-accent">{groupsCompleted}/12</span>
            </div>
            <div className="sim-progress-bar">
              <div className="sim-progress-fill" style={{ width: `${groupProgress}%` }} />
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--fg-muted)', flexShrink: 0 }}>
              {groupProgress}%
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            {status?.group_locked ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--danger)', fontWeight: 800 }}>
                🔒 La fase de grupos está bloqueada. Ya inició el primer partido de la última fecha del fixture.
              </p>
            ) : (
              <p style={{ fontSize: '0.82rem', color: 'var(--fg-muted)', fontWeight: 600 }}>
                Selecciona tu <strong>1° y 2° lugar</strong>. Haz click en un equipo para seleccionarlo, o haz click de nuevo para reiniciar el grupo.
              </p>
            )}
          </div>

          {groupsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Spinner />
            </div>
          ) : (
            <>
              <div className="groups-grid-full">
                {groupKeys.map(g => {
                  const picks = groupPicks[g] || [];
                  const isComplete = picks.length === 4;
                  return (
                    <div key={g} className={`group-card-sim ${isComplete ? 'complete' : ''}`}>
                      <div className="group-title-sim">
                        GRUPO {g}
                        {isComplete && <span className="group-complete-badge">✓ Listo</span>}
                      </div>
                      <div>
                        {groupsData[g].map(team => {
                          const pickedPos = picks.indexOf(team.name);
                          const pos = pickedPos >= 0 ? pickedPos + 1 : null;
                          return (
                            <div
                              key={team.name}
                              className={`team-sim-row ${pos === 1 ? 'pos-1' : pos === 2 ? 'pos-2' : pos === 3 ? 'pos-3' : pos === 4 ? 'pos-4' : ''}`}
                              onClick={() => handleGroupPick(g, team.name)}
                              style={{ cursor: status?.group_locked ? 'not-allowed' : 'pointer' }}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => e.key === 'Enter' && handleGroupPick(g, team.name)}
                            >
                              <span className="team-flag-row">
                                <img
                                  src={FLAG_URL(team.flag)}
                                  alt={team.name}
                                  width={24}
                                  height={16}
                                  style={{ borderRadius: 2, border: '1px solid var(--border)' }}
                                />
                                {team.name}
                              </span>
                              {pos && (
                                <span className="pos-badge-sim">
                                  {pos}°
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selection of 8 best thirds */}
              {groupsCompleted === 12 && (
                <div className="card" style={{ marginTop: '2.5rem', border: '2px solid var(--accent)', background: 'var(--surface)', padding: '2rem' }}>
                  <h3 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>🌟</span> Selección de Mejores Terceros
                  </h3>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 600 }}>
                    Elige exactamente <strong style={{ color: 'var(--accent)' }}>8 equipos</strong> de los que terminaron en 3° lugar para avanzar al cuadro eliminatorio:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {thirdPlaceTeams.map(team => {
                      const isSelected = selectedThirds.includes(team.name);
                      return (
                        <button
                          key={team.name}
                          type="button"
                          onClick={() => toggleThirdPick(team.name)}
                          className={`team-sim-row ${isSelected ? 'pos-3' : ''}`}
                          style={{ 
                            cursor: status?.group_locked ? 'not-allowed' : 'pointer', 
                            opacity: !isSelected && selectedThirds.length >= 8 ? 0.5 : 1 
                          }}
                        >
                          <span className="team-flag-row">
                            <img
                              src={FLAG_URL(team.flag)}
                              alt={team.name}
                              width={24}
                              height={16}
                              style={{ borderRadius: 2, border: '1px solid var(--border)' }}
                            />
                            <span>{team.name} <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>({team.group})</span></span>
                          </span>
                          {isSelected && <span style={{ fontSize: '0.75rem' }}>⭐</span>}
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>
                      Seleccionados: <span className="text-accent" style={{ fontSize: '1.25rem' }}>{selectedThirds.length}/8</span>
                    </span>
                    {selectedThirds.length === 8 && (
                      <button className="btn-primary" onClick={handleProceedToBracket} style={{ padding: '0.75rem 2rem' }}>
                        🏆 Ir al Bracket Eliminatorio →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* BRACKET TAB */}
      {activeTab === 'bracket' && (
        <div>
          <div className="sim-info-box" style={{ marginBottom: '1.5rem' }}>
            <span className="sim-info-box-icon">📌</span>
            <div style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', fontWeight: 600 }}>
              {!status?.knockout_unlocked ? (
                <strong style={{ color: 'var(--danger)' }}>🔒 La fase eliminatoria está bloqueada hasta que finalice toda la fase de grupos.</strong>
              ) : (
                <>
                  <strong style={{ color: 'var(--fg)' }}>Instrucciones:</strong> Haz click en el equipo que ganará cada duelo para avanzarlo de ronda.
                </>
              )}
            </div>
          </div>

          <div className="bracket-scroll-wrapper custom-scrollbar">
            <div className="bracket-container">
              {/* 16avos de Final (32) */}
              <div className="bracket-round-col">
                <div className="bracket-round-title">16avos de Final (32)</div>
                <div className="bracket-round-matches">
                  {r32.map((m, i) => (
                    <BracketMatchCard
                      key={m.id}
                      match={m}
                      onPick={(slot) => {
                        const team = m[slot].team;
                        if (!team) return;
                        const newR32 = r32.map((x, xi) => xi !== i ? x : {
                          ...x,
                          home: { ...x.home, winner: slot === 'home' },
                          away: { ...x.away, winner: slot === 'away' },
                        });
                        setR32(newR32);
                        const nextMatchIdx = Math.floor(i / 2);
                        const nextSlot = i % 2 === 0 ? 'home' : 'away';
                        setR16(prev => prev.map((x, xi) => xi !== nextMatchIdx ? x : {
                          ...x,
                          [nextSlot]: { team, winner: false },
                        }));
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Octavos (16) */}
              <div className="bracket-round-col">
                <div className="bracket-round-title">Octavos (16)</div>
                <div className="bracket-round-matches">
                  {r16.map((m, i) => (
                    <BracketMatchCard
                      key={m.id}
                      match={m}
                      onPick={(slot) => {
                        const team = m[slot].team;
                        if (!team) return;
                        const newR16 = r16.map((x, xi) => xi !== i ? x : {
                          ...x,
                          home: { ...x.home, winner: slot === 'home' },
                          away: { ...x.away, winner: slot === 'away' },
                        });
                        setR16(newR16);
                        const nextMatchIdx = Math.floor(i / 2);
                        const nextSlot = i % 2 === 0 ? 'home' : 'away';
                        setQf(prev => prev.map((x, xi) => xi !== nextMatchIdx ? x : {
                          ...x,
                          [nextSlot]: { team, winner: false },
                        }));
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Cuartos (8) */}
              <div className="bracket-round-col">
                <div className="bracket-round-title">Cuartos (8)</div>
                <div className="bracket-round-matches">
                  {qf.map((m, i) => (
                    <BracketMatchCard
                      key={m.id}
                      match={m}
                      onPick={(slot) => {
                        const team = m[slot].team;
                        if (!team) return;
                        setQf(prev => prev.map((x, xi) => xi !== i ? x : {
                          ...x,
                          home: { ...x.home, winner: slot === 'home' },
                          away: { ...x.away, winner: slot === 'away' },
                        }));
                        const nextMatchIdx = Math.floor(i / 2);
                        const nextSlot = i % 2 === 0 ? 'home' : 'away';
                        setSf(prev => prev.map((x, xi) => xi !== nextMatchIdx ? x : {
                          ...x,
                          [nextSlot]: { team, winner: false },
                        }));
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Semifinales (4) */}
              <div className="bracket-round-col">
                <div className="bracket-round-title">Semifinales (4)</div>
                <div className="bracket-round-matches">
                  {sf.map((m, i) => (
                    <BracketMatchCard
                      key={m.id}
                      match={m}
                      onPick={(slot) => {
                        const team = m[slot].team;
                        if (!team) return;
                        const loser = m[slot === 'home' ? 'away' : 'home'].team;
                        setSf(prev => prev.map((x, xi) => xi !== i ? x : {
                          ...x,
                          home: { ...x.home, winner: slot === 'home' },
                          away: { ...x.away, winner: slot === 'away' },
                        }));
                        const nextSlot = i % 2 === 0 ? 'home' : 'away';
                        setFinalMatch(prev => [{
                          ...prev[0],
                          [nextSlot]: { team, winner: false },
                        }]);
                        const lSlot = i % 2 === 0 ? 'home' : 'away';
                        if (loser) setFinal3rd(prev => [{ ...prev[0], [lSlot]: { team: loser, winner: false } }]);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Final Match & 3rd Place */}
              <div className="bracket-round-col">
                <div className="bracket-round-title">🏆 Finales</div>
                <div className="bracket-round-matches">
                  {finalMatch.map((m) => (
                    <BracketMatchCard
                      key={m.id}
                      match={m}
                      label="Gran Final"
                      onPick={(slot) => {
                        const team = m[slot].team;
                        if (!team) return;
                        setFinalMatch([{
                          ...m,
                          home: { ...m.home, winner: slot === 'home' },
                          away: { ...m.away, winner: slot === 'away' },
                        }]);
                        setChampion(team);
                      }}
                    />
                  ))}
                  {final3rd.map((m) => (
                    <BracketMatchCard
                      key={m.id}
                      match={m}
                      label="Tercer Puesto"
                      onPick={(slot) => {
                        const team = m[slot].team;
                        if (!team) return;
                        setFinal3rd([{
                          ...m,
                          home: { ...m.home, winner: slot === 'home' },
                          away: { ...m.away, winner: slot === 'away' },
                        }]);
                        setThird(team);
                      }}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Champion Display */}
          {champion && (
            <div className="champion-reveal animate-fade-in">
              <div className="champion-label">🏆 Campeón del Mundo 2026</div>
              <div className="champion-name">{champion.name}</div>
              {third && (
                <div style={{ marginTop: '1.5rem', opacity: 0.8, fontSize: '0.85rem', fontWeight: 800 }}>
                  🥉 Tercer lugar: {third.name}
                </div>
              )}
            </div>
          )}
          {!champion && (
            <div className="champion-reveal" style={{ background: 'var(--surface)', color: 'var(--fg)', border: '2px dashed var(--border)' }}>
              <div className="champion-label" style={{ color: 'var(--fg-muted)' }}>Campeón del Mundo 2026</div>
              <div className="champion-name" style={{ color: 'var(--fg-muted)', opacity: 0.3, fontSize: '2rem' }}>¿QUIÉN GANARÁ?</div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
