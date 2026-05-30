"use client";
import { Star, TrendingUp, Shield } from 'lucide-react';

export interface Team {
  id: number;
  name: string;
  code: string;
  flag_emoji: string;
  confederation: string;
  ranking: number;
  is_star: boolean;
  group_name?: string; // Optional if we want to show it
}

interface TeamCardProps {
  team: Team;
  onSelect: (team: Team) => void;
  selected: boolean;
}

export default function TeamCard({ team, onSelect, selected }: TeamCardProps) {
  return (
    <button
      onClick={() => onSelect(team)}
      className={`relative w-full text-left rounded-2xl p-5 transition-all duration-300 border group cursor-pointer ${
        selected
          ? 'bg-wc-blue border-wc-sky shadow-card-hover scale-[1.02]'
          : 'bg-card-gradient border-wc-border hover:border-wc-sky/50 hover:shadow-card-hover hover:scale-[1.01]'
      }`}
    >
      {/* Top badge */}
      <div className="flex items-start justify-between mb-4">
        {team.group_name && (
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full tracking-wider ${
              selected
                ? 'bg-wc-sky/20 text-wc-sky'
                : 'bg-wc-muted text-wc-white/50 group-hover:bg-wc-sky/10 group-hover:text-wc-sky/80'
            } transition-colors`}
          >
            {team.group_name}
          </span>
        )}
        {!team.group_name && <div />}
        {team.is_star && (
          <Star size={14} className="text-wc-gold fill-wc-gold" />
        )}
      </div>

      {/* Flag + name */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl leading-none">{team.flag_emoji}</span>
        <div>
          <div className="font-display font-700 text-wc-white text-xl leading-tight">{team.name}</div>
          <div className="text-wc-white/50 text-xs mt-0.5">{team.confederation}</div>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 pt-3 border-t border-wc-border/50">
        <div className="flex items-center gap-1.5 text-wc-white/60 text-xs">
          <TrendingUp size={12} className="text-wc-gold" />
          <span>Ranking <strong className="text-wc-white/90">#{team.ranking}</strong></span>
        </div>
        <div className="flex items-center gap-1.5 text-wc-white/60 text-xs">
          <Shield size={12} className="text-wc-sky" />
          <span>{team.confederation}</span>
        </div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-wc-sky animate-pulse-slow" />
      )}
    </button>
  );
}
