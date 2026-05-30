import React from 'react';
import { Match, Prediction } from '@/types';
import { MatchCard } from '@/components/match/MatchCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarGridProps {
  matches: Match[];
  predictions?: Prediction[];
  leagueId?: number;
  onPredictionSaved?: () => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ 
  matches, 
  predictions = [], 
  leagueId, 
  onPredictionSaved 
}) => {
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
    <div className="space-y-8">
      {sortedDates.map(dateKey => {
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

            {/* Listado de partidos del día */}
            <div className="space-y-3">
              {matchesForDay.map((m) => {
                const p = predictions.find(pred => pred.match_id === m.id);
                return (
                  <MatchCard 
                    key={m.id} 
                    match={m} 
                    prediction={p}
                    leagueId={leagueId}
                    onPredictionSaved={onPredictionSaved}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
