import React from 'react';
import { League } from '@/types';
import { Trophy } from 'lucide-react';

export const LeagueHeader: React.FC<{ league: League }> = ({ league }) => {
  return (
    <div className="relative overflow-hidden rounded-[2.5rem] bg-wc-card/80 backdrop-blur-md border border-wc-border p-8 md:p-12 mb-8 shadow-card">
      {/* Decorative Background Icon */}
      <Trophy className="absolute top-1/2 -right-16 -translate-y-1/2 text-wc-gold/5" size={320} />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="space-y-4 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-wc-sky/10 border border-wc-sky/20 text-wc-sky rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest">Liga Privada</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-800 text-wc-white uppercase tracking-tighter leading-none filter drop-shadow-lg">
            {league.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-1.5 text-wc-white/70 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-wc-green shadow-glow-gold"></span>
              En Curso
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <div className="bg-wc-dark/50 border border-wc-border rounded-3xl p-6 min-w-[130px] text-center shadow-inner">
            <span className="block text-[10px] font-bold text-wc-white/40 uppercase tracking-widest mb-2">Tu Posición</span>
            <span className="text-4xl font-display font-800 text-wc-sky">#--</span>
          </div>
          <div className="bg-wc-dark/50 border border-wc-border rounded-3xl p-6 min-w-[130px] text-center shadow-inner">
            <span className="block text-[10px] font-bold text-wc-white/40 uppercase tracking-widest mb-2">Tus Puntos</span>
            <span className="text-4xl font-display font-800 text-wc-gold">--</span>
          </div>
        </div>
      </div>
    </div>
  );
};
