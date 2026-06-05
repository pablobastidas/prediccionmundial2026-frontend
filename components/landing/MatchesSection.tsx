"use client";
import { Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

interface TeamInfo {
  id: number;
  name: string;
  code: string;
  flag_emoji: string;
}

interface VenueInfo {
  name: string;
  city: string;
}

interface Match {
  id: number;
  home_team?: TeamInfo;
  away_team?: TeamInfo;
  home_placeholder?: string;
  away_placeholder?: string;
  match_datetime: string;
  stage: string;
  status: string;
  venue?: VenueInfo;
  result?: { home_goals: number; away_goals: number };
}

function formatDate(isoStr: string) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(isoStr: string) {
  const d = new Date(isoStr);
  return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export default function MatchesSection() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/tournaments/current/matches')
      .then(res => {
        if (Array.isArray(res.data)) setMatches(res.data);
        else setMatches([]);
      })
      .catch(err => console.error("Error fetching matches:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <section id="matches" className="py-24 bg-wc-dark/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <p className="text-wc-sky text-xs font-black tracking-[0.3em] uppercase mb-3">Rumbo a la Final</p>
          <h2 className="font-display font-800 text-wc-white text-4xl sm:text-6xl leading-tight">
            Próximos <span className="text-transparent bg-clip-text bg-gold-gradient">Partidos</span>
          </h2>
        </div>

        {/* Match cards */}
        <div className="flex flex-col gap-5">
          {matches.length === 0 ? (
            <div className="text-center py-10 text-wc-white/20 italic">
              Calendario no disponible.
            </div>
          ) : (
            matches.map((match, idx) => (
              <div
                key={match.id}
                className="group bg-card-gradient border border-wc-border hover:border-wc-sky/40 rounded-3xl p-6 transition-all duration-500 hover:shadow-card-hover"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Stage badge */}
                  <div className="lg:w-32 shrink-0">
                    <span className="inline-block bg-wc-red/20 text-wc-red text-[10px] font-black px-4 py-1.5 rounded-full tracking-widest uppercase border border-wc-red/30">
                      {match.stage}
                    </span>
                  </div>

                  {/* Teams */}
                  <div className="flex-1 flex items-center justify-center gap-6 sm:gap-10">
                    {/* Home Team */}
                    <div className="flex items-center gap-4 flex-1 justify-end">
                      <span className="font-display font-700 text-wc-white text-xl sm:text-2xl text-right truncate">
                        {match.home_team?.name || match.home_placeholder || 'TBD'}
                      </span>
                      <span className="text-4xl sm:text-5xl shadow-sm">
                        {match.home_team?.flag_emoji || '🏳️'}
                      </span>
                    </div>

                    <div className="flex flex-col items-center shrink-0">
                      {match.result ? (
                        <div className="bg-wc-blue border border-wc-sky rounded-2xl px-6 py-2 font-display font-800 text-wc-white text-3xl tracking-widest shadow-glow-sky">
                          {match.result.home_goals} – {match.result.away_goals}
                        </div>
                      ) : (
                        <div className="bg-wc-card border border-wc-border rounded-2xl px-6 py-2 font-display font-600 text-wc-white/40 text-lg tracking-widest">
                          VS
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="flex items-center gap-4 flex-1 justify-start">
                      <span className="text-4xl sm:text-5xl shadow-sm">
                        {match.away_team?.flag_emoji || '🏳️'}
                      </span>
                      <span className="font-display font-700 text-wc-white text-xl sm:text-2xl truncate">
                        {match.away_team?.name || match.away_placeholder || 'TBD'}
                      </span>
                    </div>
                  </div>

                  {/* Date & venue */}
                  <div className="lg:w-64 flex flex-col gap-2 lg:items-end shrink-0 border-t lg:border-t-0 lg:border-l border-wc-border/40 pt-4 lg:pt-0 lg:pl-6">
                    <div className="flex items-center gap-2 text-wc-white/70 text-sm font-bold">
                      <Clock size={14} className="text-wc-gold" />
                      <span>{formatDate(match.match_datetime)} · {formatTime(match.match_datetime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-wc-white/50 text-xs font-semibold">
                      <MapPin size={14} className="text-wc-sky" />
                      <span>{match.venue?.name || 'Estadio por definir'}, {match.venue?.city || 'TBD'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-12 text-center">
          <button className="bg-wc-card hover:bg-wc-muted border border-wc-border text-wc-white/60 hover:text-wc-white font-black uppercase tracking-widest px-10 py-4 rounded-2xl transition-all text-xs shadow-soft">
            Ver calendario completo
          </button>
        </div>
      </div>
    </section>
  );
}
