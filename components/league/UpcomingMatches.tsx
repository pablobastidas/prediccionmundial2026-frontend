import React, { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import { Match, Prediction } from '../../types';
import { MatchCard } from '../match/MatchCard';
import { Spinner } from '../ui/Spinner';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const UpcomingMatches: React.FC<{ leagueId: number }> = ({ leagueId }) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPredictions = React.useCallback(async () => {
    try {
      const pRes = await apiClient.get(`/predictions?league_id=${leagueId}`);
      setPredictions(pRes.data);
    } catch (error) {
      console.error('Error fetching predictions in UpcomingMatches:', error);
    }
  }, [leagueId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes] = await Promise.all([
          apiClient.get('/tournaments/current/matches'),
          fetchPredictions()
        ]);
        const now = new Date();
        // Cargamos los siguientes 15 partidos
        const upcoming = mRes.data.filter((m: Match) => new Date(m.match_datetime) > now).slice(0, 15);
        setMatches(upcoming);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [leagueId, fetchPredictions]);

  if (loading) return <div className="py-10 flex justify-center"><Spinner /></div>;

  // Agrupar partidos por fecha local (YYYY-MM-DD)
  const groupedMatches: { [key: string]: Match[] } = {};
  matches.forEach(m => {
    const dateKey = format(new Date(m.match_datetime), 'yyyy-MM-dd');
    if (!groupedMatches[dateKey]) {
      groupedMatches[dateKey] = [];
    }
    groupedMatches[dateKey].push(m);
  });

  const sortedDates = Object.keys(groupedMatches).sort();

  return (
    <div className="mb-12 space-y-8">
      {matches.length === 0 ? (
        <div className="py-16 text-center bg-wc-card/40 rounded-[2rem] border border-dashed border-wc-border">
          <Calendar className="mx-auto text-wc-white/20 mb-4" size={40} />
          <p className="text-wc-white/50 font-bold text-sm uppercase tracking-widest">No hay partidos próximos programados.</p>
        </div>
      ) : (
        sortedDates.map(dateKey => {
          const matchesForDay = groupedMatches[dateKey];
          const representativeDate = new Date(matchesForDay[0].match_datetime);
          const formattedDate = format(representativeDate, "EEEE d 'de' MMMM", { locale: es });

          return (
            <div key={dateKey} className="space-y-4">
              {/* Encabezado de fecha consolidado */}
              <div className="flex items-center gap-3 pb-2 border-b border-wc-white/5">
                <h3 className="text-xs font-black uppercase tracking-widest text-wc-sky flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-wc-sky/50"></span>
                  {formattedDate}
                </h3>
                <span className="text-[9px] font-black text-wc-white/30 uppercase bg-wc-white/[0.03] border border-wc-white/5 px-2 py-0.5 rounded-full">
                  {matchesForDay.length} {matchesForDay.length === 1 ? 'partido' : 'partidos'}
                </span>
              </div>

              {/* Lista de partidos de este día */}
              <div className="space-y-3">
                {matchesForDay.map(m => {
                  const p = predictions.find(pred => pred.match_id === m.id);
                  return (
                    <MatchCard 
                      key={m.id} 
                      match={m} 
                      prediction={p} 
                      leagueId={leagueId}
                      onPredictionSaved={fetchPredictions}
                    />
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
