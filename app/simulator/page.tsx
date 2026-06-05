"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/Spinner';
import AppLayout from '@/components/layout/AppLayout';
import { getGroupsWithTeams } from '@/services/tournamentService';

// ─── DATA ───────────────────────────────────────────────────────────────────────
const GROUPS: Record<string, { name: string; flag: string }[]> = {
  A: [{ name: 'México', flag: 'mx' }, { name: 'Países Bajos', flag: 'nl' }, { name: 'Ghana', flag: 'gh' }, { name: 'Uzbekistán', flag: 'uz' }],
  B: [{ name: 'Canadá', flag: 'ca' }, { name: 'Bélgica', flag: 'be' }, { name: 'Corea del Sur', flag: 'kr' }, { name: 'Malí', flag: 'ml' }],
  C: [{ name: 'USA', flag: 'us' }, { name: 'España', flag: 'es' }, { name: 'Japón', flag: 'jp' }, { name: 'Zambia', flag: 'zm' }],
  D: [{ name: 'Argentina', flag: 'ar' }, { name: 'Dinamarca', flag: 'dk' }, { name: 'Ecuador', flag: 'ec' }, { name: 'Omán', flag: 'om' }],
  E: [{ name: 'Brasil', flag: 'br' }, { name: 'Suiza', flag: 'ch' }, { name: 'Costa Rica', flag: 'cr' }, { name: 'Irak', flag: 'iq' }],
  F: [{ name: 'Francia', flag: 'fr' }, { name: 'Colombia', flag: 'co' }, { name: 'Noruega', flag: 'no' }, { name: 'Egipto', flag: 'eg' }],
  G: [{ name: 'Inglaterra', flag: 'gb-eng' }, { name: 'Uruguay', flag: 'uy' }, { name: 'Turquía', flag: 'tr' }, { name: 'Jamaica', flag: 'jm' }],
  H: [{ name: 'Portugal', flag: 'pt' }, { name: 'Croacia', flag: 'hr' }, { name: 'Irán', flag: 'ir' }, { name: 'Panamá', flag: 'pa' }],
  I: [{ name: 'Italia', flag: 'it' }, { name: 'Marruecos', flag: 'ma' }, { name: 'Australia', flag: 'au' }, { name: 'Honduras', flag: 'hn' }],
  J: [{ name: 'Alemania', flag: 'de' }, { name: 'Chile', flag: 'cl' }, { name: 'Nigeria', flag: 'ng' }, { name: 'Catar', flag: 'qa' }],
  K: [{ name: 'Serbia', flag: 'rs' }, { name: 'Arabia Saudita', flag: 'sa' }, { name: 'Perú', flag: 'pe' }, { name: 'Irlanda', flag: 'ie' }],
  L: [{ name: 'Polonia', flag: 'pl' }, { name: 'Ucrania', flag: 'ua' }, { name: 'Senegal', flag: 'sn' }, { name: 'Túnez', flag: 'tn' }],
};

const GROUP_KEYS = Object.keys(GROUPS);

// Scoring rules constant — displayed in the rules panel
const SCORING_RULES = [
  { icon: '🎯', pts: '+5', label: 'Marcador Exacto', desc: 'Predijiste el score exacto (ej: 2-1)' },
  { icon: '✅', pts: '+3', label: 'Resultado Correcto', desc: 'Acertaste ganador o empate sin score exacto' },
  { icon: '🏆', pts: '+10', label: 'Campeón', desc: 'Predijiste el campeón del torneo (bonus eliminatorias)' },
  { icon: '⚡', pts: '+2', label: 'Finalista', desc: 'Predijiste un equipo en la final' },
  { icon: '🥉', pts: '+1', label: 'Top 4', desc: 'Predijiste un equipo en semifinales' },
  { icon: '❌', pts: '0', label: 'Incorrecto', desc: 'El resultado no coincidió' },
];

// ─── TYPES ────────────────────────────────────────────────────────────────────
type TeamEntry = { name: string; flag: string };
type BracketSlot = { team: TeamEntry | null; winner: boolean };
type BracketMatch = { id: string; home: BracketSlot; away: BracketSlot };

function emptyMatch(id: string): BracketMatch {
  return { id, home: { team: null, winner: false }, away: { team: null, winner: false } };
}

const FLAG_URL = (code: string) =>
  `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function Simulator() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login');
  }, [loading, isAuthenticated, router]);

  const [activeTab, setActiveTab] = useState<'reglas' | 'grupos' | 'bracket'>('reglas');
  const [showRulesPanel, setShowRulesPanel] = useState(false);

  // GROUP PHASE state — track 1st and 2nd place per group
  const [groupPicks, setGroupPicks] = useState<Record<string, string[]>>({});
  const [groupsData, setGroupsData] = useState<Record<string, { name: string; flag: string }[]>>(GROUPS);

  useEffect(() => {
    const fetchGroups = async () => {
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
      }
    };
    if (isAuthenticated) {
      fetchGroups();
    }
  }, [isAuthenticated]);

  const handleGroupPick = useCallback((group: string, teamName: string) => {
    setGroupPicks(prev => {
      const current = prev[group] || [];
      if (current.includes(teamName)) {
        return { ...prev, [group]: current.filter(t => t !== teamName) };
      }
      if (current.length >= 2) return prev;
      return { ...prev, [group]: [...current, teamName] };
    });
  }, []);

  const groupKeys = Object.keys(groupsData);
  const groupsCompleted = groupKeys.filter(g => (groupPicks[g]?.length ?? 0) >= 2).length;
  const groupProgress = groupKeys.length > 0 ? Math.round((groupsCompleted / groupKeys.length) * 100) : 0;

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

  const handleProceedToBracket = () => {
    const newR32: BracketMatch[] = [
      { id: 'r32_0', home: { team: getTeamOrPlaceholder('A', 2), winner: false }, away: { team: getTeamOrPlaceholder('B', 2), winner: false } },
      { id: 'r32_1', home: { team: getTeamOrPlaceholder('C', 1), winner: false }, away: { team: getTeamOrPlaceholder('F', 2), winner: false } },
      { id: 'r32_2', home: { team: getTeamOrPlaceholder('E', 1), winner: false }, away: { team: { name: '3° Grupo A/B/C/D/F', flag: 'un' }, winner: false } },
      { id: 'r32_3', home: { team: getTeamOrPlaceholder('F', 1), winner: false }, away: { team: getTeamOrPlaceholder('C', 2), winner: false } },
      { id: 'r32_4', home: { team: getTeamOrPlaceholder('E', 2), winner: false }, away: { team: getTeamOrPlaceholder('I', 2), winner: false } },
      { id: 'r32_5', home: { team: getTeamOrPlaceholder('I', 1), winner: false }, away: { team: { name: '3° Grupo C/D/F/G/H', flag: 'un' }, winner: false } },
      { id: 'r32_6', home: { team: getTeamOrPlaceholder('A', 1), winner: false }, away: { team: { name: '3° Grupo C/E/F/H/I', flag: 'un' }, winner: false } },
      { id: 'r32_7', home: { team: getTeamOrPlaceholder('L', 1), winner: false }, away: { team: { name: '3° Grupo E/H/I/J/K', flag: 'un' }, winner: false } },
      { id: 'r32_8', home: { team: getTeamOrPlaceholder('G', 1), winner: false }, away: { team: { name: '3° Grupo A/E/H/I/J', flag: 'un' }, winner: false } },
      { id: 'r32_9', home: { team: getTeamOrPlaceholder('D', 1), winner: false }, away: { team: { name: '3° Grupo B/E/F/I/J', flag: 'un' }, winner: false } },
      { id: 'r32_10', home: { team: getTeamOrPlaceholder('H', 1), winner: false }, away: { team: getTeamOrPlaceholder('J', 2), winner: false } },
      { id: 'r32_11', home: { team: getTeamOrPlaceholder('K', 2), winner: false }, away: { team: getTeamOrPlaceholder('L', 2), winner: false } },
      { id: 'r32_12', home: { team: getTeamOrPlaceholder('B', 1), winner: false }, away: { team: { name: '3° Grupo E/F/G/I/J', flag: 'un' }, winner: false } },
      { id: 'r32_13', home: { team: getTeamOrPlaceholder('D', 2), winner: false }, away: { team: getTeamOrPlaceholder('G', 2), winner: false } },
      { id: 'r32_14', home: { team: getTeamOrPlaceholder('J', 1), winner: false }, away: { team: getTeamOrPlaceholder('H', 2), winner: false } },
      { id: 'r32_15', home: { team: getTeamOrPlaceholder('K', 1), winner: false }, away: { team: { name: '3° Grupo D/E/I/J/L', flag: 'un' }, winner: false } },
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

  // BRACKET state — 16avos (32), octavos (16), cuartos (8), semis (4), final (2), tercer puesto (1)
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

  // Generic advance function: picks winner in current round, seeds next round
  const advanceTeam = useCallback((
    roundSetter: React.Dispatch<React.SetStateAction<BracketMatch[]>>,
    round: BracketMatch[],
    matchIdx: number,
    slot: 'home' | 'away',
    nextRoundSetter?: React.Dispatch<React.SetStateAction<BracketMatch[]>>,
    nextRound?: BracketMatch[],
    nextMatchIdx?: number,
    nextSlot?: 'home' | 'away',
    onChampion?: (team: TeamEntry) => void
  ) => {
    const team = round[matchIdx][slot].team;
    if (!team) return;

    const newRound = round.map((m, i) => {
      if (i !== matchIdx) return m;
      return {
        ...m,
        home: { ...m.home, winner: slot === 'home' },
        away: { ...m.away, winner: slot === 'away' },
      };
    });
    roundSetter(newRound);

    if (onChampion) {
      onChampion(team);
      return;
    }

    if (nextRoundSetter && nextRound && nextMatchIdx !== undefined && nextSlot) {
      const newNext = nextRound.map((m, i) => {
        if (i !== nextMatchIdx) return m;
        return { ...m, [nextSlot]: { team, winner: false } };
      });
      nextRoundSetter(newNext);
    }
  }, []);

  if (loading || !isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  // ─── RENDER HELPERS ─────────────────────────────────────────────────────────
  function TeamFlag({ team, size = 28 }: { team: TeamEntry | null; size?: number }) {
    if (!team) return <span style={{ opacity: 0.3, fontSize: '0.75rem', fontWeight: 800 }}>TBD</span>;
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={FLAG_URL(team.flag)}
          alt={team.name}
          width={size}
          height={size * 0.67}
          style={{ borderRadius: 3, objectFit: 'cover', border: '1px solid var(--border)' }}
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <span style={{ fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
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
    return (
      <div className="bracket-match-card">
        {label && <div className="bracket-match-label">{label}</div>}
        <button
          className={`bracket-team-row ${match.home.winner ? 'winner' : ''}`}
          onClick={() => onPick('home')}
          disabled={!match.home.team}
          title={match.home.team ? `Seleccionar ${match.home.team.name}` : 'Equipo no definido aún'}
        >
          <TeamFlag team={match.home.team} />
          {match.home.winner && <span className="winner-crown">👑</span>}
        </button>
        <div className="bracket-vs">VS</div>
        <button
          className={`bracket-team-row ${match.away.winner ? 'winner' : ''}`}
          onClick={() => onPick('away')}
          disabled={!match.away.team}
          title={match.away.team ? `Seleccionar ${match.away.team.name}` : 'Equipo no definido aún'}
        >
          <TeamFlag team={match.away.team} />
          {match.away.winner && <span className="winner-crown">👑</span>}
        </button>
      </div>
    );
  }

  function RoundColumn({ title, matches, onPick }: {
    title: string;
    matches: BracketMatch[];
    onPick: (idx: number, slot: 'home' | 'away') => void;
  }) {
    return (
      <div className="bracket-round-col">
        <div className="bracket-round-title">{title}</div>
        <div className="bracket-round-matches">
          {matches.map((m, i) => (
            <BracketMatchCard
              key={m.id}
              match={m}
              onPick={(slot) => onPick(i, slot)}
            />
          ))}
        </div>
      </div>
    );
  }

  // ─── JSX ────────────────────────────────────────────────────────────────────
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
        .team-sim-row.pos-2 { border-color: var(--primary); background: rgba(92,69,242,0.06); }
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

        /* ── BRACKET ── */
        .bracket-scroll-wrapper {
          overflow-x: auto;
          padding-bottom: 1rem;
          -webkit-overflow-scrolling: touch;
        }
        .bracket-container {
          display: flex;
          gap: 1rem;
          min-width: max-content;
          padding: 1rem 0.5rem 2rem;
          align-items: flex-start;
        }
        .bracket-round-col {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 190px;
          max-width: 210px;
        }
        .bracket-round-title {
          font-size: 0.6rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--fg-muted);
          padding: 0 0.5rem;
          margin-bottom: 0.25rem;
        }
        .bracket-round-matches {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .bracket-match-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .bracket-match-card:hover { border-color: var(--accent-soft); box-shadow: var(--shadow-md); }
        .bracket-match-label {
          font-size: 0.5rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--fg-muted);
          padding: 0.3rem 0.75rem;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
        }
        .bracket-team-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.75rem;
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
        .bracket-team-row:disabled { cursor: default; opacity: 0.5; }
        .bracket-vs {
          text-align: center;
          font-size: 0.6rem;
          font-weight: 900;
          opacity: 0.3;
          padding: 0.15rem;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
        }
        .winner-crown { font-size: 0.75rem; margin-left: 0.25rem; }

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

        /* ── BRACKET SEPARATOR ── */
        .bracket-divider {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 0.25rem;
          color: var(--border);
          font-size: 1.5rem;
          opacity: 0.4;
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
          .bracket-round-col { min-width: 160px; }
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

      {/* ════════════════════════════════════════════
          TAB: REGLAS
      ════════════════════════════════════════════ */}
      {activeTab === 'reglas' && (
        <div>
          <div className="sim-info-box">
            <span className="sim-info-box-icon">💡</span>
            <div>
              <div style={{ fontWeight: 900, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                ¿Cómo funciona el sistema de puntos?
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--fg-muted)', fontWeight: 600, lineHeight: 1.6 }}>
                Cada vez que se juega un partido, comparamos tu pronóstico con el resultado real.
                Puedes ganar puntos por acertar el ganador <strong>(resultado)</strong>, por acertar el 
                score exacto, o por acertar qué equipos llegan lejos en el torneo. 
                ¡Entre más preciso seas, más puntos sumas!
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

          <h3 style={{ marginBottom: '1.5rem' }}>Reglas <span className="text-accent">Generales</span></h3>
          <div className="card">
            {[
              { n: '01', rule: 'Cierre de pronósticos', detail: 'Los pronósticos de cada partido cierran exactamente cuando empieza el partido. Ningún cambio después del pitazo inicial.' },
              { n: '02', rule: 'Pronóstico mínimo', detail: 'Para participar en una liga, debes haber pronosticado al menos 1 partido. Sin pronósticos = sin posición en la tabla.' },
              { n: '03', rule: 'Empates', detail: 'En fase de grupos puede haber empates. En eliminatorias, si el partido va a tiempo extra o penales, el pronóstico válido es solo el resultado al 90 minutos.' },
              { n: '04', rule: 'Bonus de eliminatorias', detail: 'Los puntos por campeón, finalista y semifinalistas se otorgan una sola vez al finalizar cada ronda. Se calculan retroactivamente si el equipo llegó lejos.' },
              { n: '05', rule: 'Privacidad de pronósticos', detail: 'Los pronósticos de otros miembros son invisibles hasta que el partido comienza. Así todos juegan de forma independiente.' },
              { n: '06', rule: 'Empate en clasificación', detail: 'Si dos jugadores tienen los mismos puntos, se desempata por: (1) mayor número de exactos, (2) mayor número de partidos pronosticados.' },
            ].map(item => (
              <div key={item.n} style={{
                display: 'flex',
                gap: '1.25rem',
                paddingBottom: '1.25rem',
                marginBottom: '1.25rem',
                borderBottom: '1px solid var(--border)',
                alignItems: 'flex-start',
              }}
                className="last:border-0 last:mb-0 last:pb-0"
              >
                <span style={{
                  fontWeight: 900,
                  fontSize: '1.25rem',
                  fontStyle: 'italic',
                  color: 'var(--accent)',
                  opacity: 0.4,
                  lineHeight: 1,
                  flexShrink: 0,
                  minWidth: '2rem',
                }}>
                  {item.n}
                </span>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                    {item.rule}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', fontWeight: 600, lineHeight: 1.5 }}>
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => setActiveTab('grupos')}>
              ⚽ Ir a Fase de Grupos →
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════
          TAB: GRUPOS
      ════════════════════════════════════════════ */}
      {activeTab === 'grupos' && (
        <div>
          {/* Progress */}
          <div className="sim-progress-wrap">
            <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', flexShrink: 0 }}>
              Progreso: <span className="text-accent">{groupsCompleted}/12</span>
            </div>
            <div className="sim-progress-bar">
              <div className="sim-progress-fill" style={{ width: `${groupProgress}%` }} />
            </div>
            <div style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--fg-muted)', flexShrink: 0 }}>
              {groupProgress}%
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--fg-muted)', fontWeight: 600 }}>
              Selecciona los <strong>2 clasificados por grupo</strong> (1° y 2° puesto). Haz click en el 1° primero y luego en el 2°.
            </p>
          </div>

          <div className="groups-grid-full">
            {groupKeys.map(g => {
              const picks = groupPicks[g] || [];
              const isComplete = picks.length === 2;
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
                          className={`team-sim-row ${pos === 1 ? 'pos-1' : pos === 2 ? 'pos-2' : ''}`}
                          onClick={() => handleGroupPick(g, team.name)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleGroupPick(g, team.name)}
                        >
                          <span className="team-flag-row">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={FLAG_URL(team.flag)}
                              alt={team.name}
                              width={24}
                              height={16}
                              style={{ borderRadius: 2, border: '1px solid var(--border)' }}
                              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                            {team.name}
                          </span>
                          {pos && (
                            <span className="pos-badge-sim">
                              {pos === 1 ? '1°' : '2°'}
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

          {groupsCompleted >= 6 && (
            <div style={{ marginTop: '2rem' }}>
              <button className="btn-primary" onClick={handleProceedToBracket}>
                🏆 Continuar al Bracket Eliminatorio →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════
          TAB: BRACKET
      ════════════════════════════════════════════ */}
      {activeTab === 'bracket' && (
        <div>
          <div className="sim-info-box" style={{ marginBottom: '1.5rem' }}>
            <span className="sim-info-box-icon">📌</span>
            <div style={{ fontSize: '0.8rem', color: 'var(--fg-muted)', fontWeight: 600 }}>
              <strong style={{ color: 'var(--fg)' }}>Cómo usar:</strong> Haz click en el equipo que crees que ganará cada partido para avanzarlo a la siguiente ronda.
              El bracket se actualiza automáticamente. Puedes cambiar tu selección en cualquier momento.
            </div>
          </div>

          <div className="bracket-scroll-wrapper custom-scrollbar">
            <div className="bracket-container">

              {/* ── 16avos de Final ── */}
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

              {/* Octavos */}
              <div className="bracket-round-col">
                <div className="bracket-round-title">Octavos de Final (16)</div>
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

              {/* Cuartos */}
              <div className="bracket-round-col">
                <div className="bracket-round-title">Cuartos de Final (8)</div>
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

              {/* Semis */}
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
                        // Winner → final
                        const nextSlot = i % 2 === 0 ? 'home' : 'away';
                        setFinalMatch(prev => [{
                          ...prev[0],
                          [nextSlot]: { team, winner: false },
                        }]);
                        // Loser → 3rd place
                        const lSlot = i % 2 === 0 ? 'home' : 'away';
                        if (loser) setFinal3rd(prev => [{ ...prev[0], [lSlot]: { team: loser, winner: false } }]);
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Final + 3er Puesto */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 190 }}>
                <div className="bracket-round-col">
                  <div className="bracket-round-title">🏆 Gran Final</div>
                  <div className="bracket-round-matches">
                    {finalMatch.map((m, i) => (
                      <BracketMatchCard
                        key={m.id}
                        match={m}
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
                  </div>
                </div>
                <div className="bracket-round-col">
                  <div className="bracket-round-title">🥉 3er Puesto</div>
                  <div className="bracket-round-matches">
                    {final3rd.map((m) => (
                      <BracketMatchCard
                        key={m.id}
                        match={m}
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
          </div>

          {/* Champion reveal */}
          {champion && (
            <div className="champion-reveal">
              <div className="champion-label">🏆 Campeón del Mundo 2026</div>
              <div className="champion-name">{champion.name}</div>
              {third && (
                <div style={{ marginTop: '1.5rem', opacity: 0.7, fontSize: '0.8rem', fontWeight: 800 }}>
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
