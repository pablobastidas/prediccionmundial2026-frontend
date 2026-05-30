"use client";
import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/api';
import { Spinner } from '@/components/ui/Spinner';
import { Trophy, Medal, User as UserIcon } from 'lucide-react';

interface Standing {
  user_id: number;
  display_name: string;
  points: number;
  correct_predictions: number;
}

export const LeagueStandings: React.FC<{ leagueId: number, compact?: boolean }> = ({ leagueId, compact = false }) => {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const { data } = await apiClient.get(`/standings/${leagueId}`);
        setStandings(data);
      } catch (error) {
        console.error('Error fetching standings:', error);
      } finally {
        setLoading(false);
      }
    };
    if (leagueId) fetchStandings();
  }, [leagueId]);

  if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

  if (standings.length === 0) {
    return (
      <div className="text-center py-10 bg-wc-card/30 rounded-3xl border border-wc-border border-dashed">
        <p className="text-wc-white/40 font-bold uppercase text-[10px] tracking-widest">No hay datos de competencia aún</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {standings.map((user, index) => {
        const rank = index + 1;
        const isUser = rank === 4; // Mock logic for current user
        
        return (
          <div 
            key={user.user_id}
            className={`flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-3xl border transition-all duration-300 ${
              isUser ? 'bg-wc-sky/10 border-wc-sky/30 shadow-card scale-[1.02]' : 'bg-wc-card/50 border-wc-border hover:border-wc-sky/50'
            }`}
          >
            {/* Rank Indicator */}
            <div className="w-10 flex justify-center">
              {rank === 1 ? <Trophy className="text-wc-gold drop-shadow-lg" size={28} /> : 
               rank === 2 ? <Medal className="text-slate-300 drop-shadow-md" size={28} /> :
               rank === 3 ? <Medal className="text-[#B45309] drop-shadow-md" size={28} /> :
               <span className="text-xl font-display font-800 text-wc-white/50">#{rank}</span>}
            </div>

            {/* Avatar */}
            <div className={`hidden md:flex h-12 w-12 rounded-xl items-center justify-center transition-colors ${
              isUser ? 'bg-wc-sky text-wc-dark' : 'bg-wc-dark/50 text-wc-white/50 border border-wc-border'
            }`}>
              <UserIcon size={20} />
            </div>

            {/* Name and Stats */}
            <div className="flex-1 min-w-0">
              <h4 className={`text-lg font-display font-800 uppercase tracking-tighter truncate ${isUser ? 'text-wc-sky' : 'text-wc-white'}`}>
                {user.display_name || 'Competidor'}
                {isUser && <span className="ml-3 text-[9px] font-black bg-wc-sky text-wc-dark px-2 py-0.5 rounded uppercase tracking-widest">TÚ</span>}
              </h4>
              {!compact && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-wc-white/40 uppercase tracking-widest">
                    {user.correct_predictions} Plenos
                  </span>
                  {rank === 1 && <span className="text-[10px] font-bold text-wc-gold bg-wc-gold/10 px-2 py-0.5 rounded-full">🔥 LÍDER</span>}
                </div>
              )}
            </div>

            {/* Points Badge */}
            <div className="text-right">
              <span className={`block text-3xl font-display font-800 tracking-tighter ${isUser ? 'text-wc-sky' : rank === 1 ? 'text-wc-gold' : 'text-wc-white'}`}>
                {user.points}
              </span>
              <span className="block text-[9px] font-bold text-wc-white/30 uppercase tracking-widest leading-none">PTS</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
