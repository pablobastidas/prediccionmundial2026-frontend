"use client";
import React, { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { Match } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const FeaturedMatch = () => {
  const [match, setMatch] = useState<Match | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await apiClient.get('/tournaments/current/matches');
        // Find a live match or the closest upcoming match
        const now = new Date();
        const live = data.find((m: Match) => m.status === 'PLAYING');
        if (live) {
          setMatch(live);
          return;
        }
        const upcoming = data.filter((m: Match) => new Date(m.match_datetime) > now);
        upcoming.sort((a: Match, b: Match) => new Date(a.match_datetime).getTime() - new Date(b.match_datetime).getTime());
        if (upcoming.length > 0) {
          setMatch(upcoming[0]);
        }
      } catch (error) {
        console.error('Error fetching featured match:', error);
      }
    };
    fetchFeatured();
  }, []);

  if (!match) return null;

  const isLive = match.status === 'PLAYING';

  return (
    <div className="mb-10 group relative overflow-hidden rounded-[2rem] bg-wc-card/50 border border-wc-border p-6 md:p-8 hover:border-wc-sky transition-colors cursor-pointer block">
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-wc-sky/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Context Info */}
        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-wc-dark/80 border border-wc-border rounded-full shadow-inner">
            <Star size={12} className={isLive ? "text-wc-red animate-pulse" : "text-wc-gold"} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${isLive ? 'text-wc-red' : 'text-wc-gold'}`}>
              {isLive ? 'PARTIDO EN VIVO' : 'PARTIDO DESTACADO'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-800 text-wc-white uppercase tracking-tighter">
            El Clásico del Grupo
          </h2>
          <p className="text-wc-white/50 text-xs font-bold uppercase tracking-widest">
            {format(new Date(match.match_datetime), "EEEE d 'DE' MMMM - HH:mm'H'", { locale: es })}
          </p>
        </div>

        {/* Score / Teams */}
        <div className="flex-shrink-0 flex items-center justify-center gap-6 bg-wc-dark/60 border border-wc-border p-4 md:px-8 md:py-6 rounded-3xl shadow-inner w-full md:w-auto">
          <div className="flex flex-col items-center gap-2 w-16">
            <span className="text-5xl md:text-6xl filter drop-shadow-lg">{match.home_team?.flag_emoji}</span>
            <span className="text-[10px] font-bold text-wc-white uppercase tracking-widest truncate w-full text-center">{match.home_team?.code}</span>
          </div>

          <div className="flex flex-col items-center gap-1 min-w-[80px]">
            {isLive ? (
              <div className="text-4xl md:text-5xl font-display font-800 text-wc-white tracking-tighter flex items-center gap-2">
                {match.result?.home_goals ?? 0} <span className="text-wc-white/30">:</span> {match.result?.away_goals ?? 0}
              </div>
            ) : (
              <span className="text-3xl md:text-4xl font-display font-800 text-wc-white/30 tracking-tighter">VS</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 w-16">
            <span className="text-5xl md:text-6xl filter drop-shadow-lg">{match.away_team?.flag_emoji}</span>
            <span className="text-[10px] font-bold text-wc-white uppercase tracking-widest truncate w-full text-center">{match.away_team?.code}</span>
          </div>
        </div>

        {/* Action Call */}
        <div className="flex-1 flex justify-center md:justify-end">
          <Link href="/matches" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-wc-sky hover:text-wc-white transition-colors">
            Ver Detalles <ChevronRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
};
