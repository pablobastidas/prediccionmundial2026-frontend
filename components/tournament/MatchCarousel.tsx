"use client";
import React, { useEffect, useState, useRef } from 'react';
import apiClient from '@/lib/api';
import { Match } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const MatchCarousel = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await apiClient.get('/tournaments/current/matches');
        // Sort to show LIVE, then upcoming, then recent finished
        const sorted = data.sort((a: Match, b: Match) => {
          if (a.status === 'PLAYING' && b.status !== 'PLAYING') return -1;
          if (a.status !== 'PLAYING' && b.status === 'PLAYING') return 1;
          return new Date(a.match_datetime).getTime() - new Date(b.match_datetime).getTime();
        });
        setMatches(sorted.slice(0, 10));
      } catch (error) {
        console.error('Error fetching matches for carousel:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  useEffect(() => {
    if (loading || matches.length === 0 || isHovered) return;

    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    const speed = 0.6; // Píxeles por frame

    const scroll = () => {
      container.scrollLeft += speed;
      // Si llegamos a la mitad (el final de la primera tanda duplicada), reseteamos a 0
      if (container.scrollLeft >= container.scrollWidth / 2) {
        container.scrollLeft = 0;
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [matches, loading, isHovered]);

  if (loading || matches.length === 0) return null;

  // Duplicamos la lista para lograr un efecto infinito y continuo
  const displayMatches = [...matches, ...matches];

  return (
    <div className="w-full bg-wc-card/30 border-b border-wc-border mb-8 overflow-hidden">
      <div 
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="max-w-7xl mx-auto flex items-center overflow-x-auto py-3 px-4 gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
      >
        {displayMatches.map((match, index) => {
          const isLive = match.status === 'PLAYING';
          const isFinished = match.status === 'FINISHED';
          
          return (
            <div 
              key={`${match.id}-${index}`} 
              className="flex-shrink-0 flex items-center gap-4 bg-wc-dark/80 border border-wc-border rounded-xl px-4 py-2 min-w-[200px] hover:border-wc-sky transition-colors select-none"
            >
              <div className="flex flex-col items-center justify-center min-w-[30px]">
                {isLive ? (
                  <span className="text-[9px] font-black text-wc-red animate-pulse uppercase">Vivo</span>
                ) : isFinished ? (
                  <span className="text-[9px] font-bold text-wc-white/50 uppercase">FT</span>
                ) : (
                  <span className="text-[9px] font-bold text-wc-sky uppercase">
                    {format(new Date(match.match_datetime), "HH:mm", { locale: es })}
                  </span>
                )}
              </div>
              
              <div className="flex-1 flex flex-col gap-1.5 border-l border-wc-border pl-3">
                <div className="flex justify-between items-center text-xs font-bold text-wc-white">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{match.home_team?.flag_emoji}</span>
                    <span className="uppercase tracking-wide truncate max-w-[60px]">{match.home_team?.code || match.home_team?.name.substring(0,3)}</span>
                  </div>
                  <span className={isLive || isFinished ? 'text-wc-white' : 'text-wc-white/30'}>
                    {match.status === 'FINISHED' ? match.result?.home_goals : (isLive ? '0' : '-')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-wc-white">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{match.away_team?.flag_emoji}</span>
                    <span className="uppercase tracking-wide truncate max-w-[60px]">{match.away_team?.code || match.away_team?.name.substring(0,3)}</span>
                  </div>
                  <span className={isLive || isFinished ? 'text-wc-white' : 'text-wc-white/30'}>
                    {match.status === 'FINISHED' ? match.result?.away_goals : (isLive ? '0' : '-')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
