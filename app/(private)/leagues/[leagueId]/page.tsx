"use client";
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useLeague } from '@/hooks/useLeague';
import { LeagueHeader } from '@/components/league/LeagueHeader';
import { UpcomingMatches } from '@/components/league/UpcomingMatches';
import { LeagueStandings } from '@/components/league/LeagueStandings';
import { Spinner } from '@/components/ui/Spinner';
import { Trophy, Calendar, ListOrdered, Share2, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LeagueDetailPage() {
  const { leagueId } = useParams();
  const { league, loading } = useLeague(Number(leagueId));
  const [activeTab, setActiveTab] = useState<'matches' | 'standings' | 'members'>('matches');

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;
  if (!league) return <div className="p-8 text-center uppercase font-bold text-wc-white/50 italic animate-pulse">Liga no encontrada</div>;

  const tabs = [
    { id: 'matches', label: 'Partidos', icon: Calendar },
    { id: 'standings', label: 'Tabla', icon: ListOrdered },
    { id: 'members', label: 'Amigos', icon: Users },
  ] as const;

  return (
    <div className="animate-fade-up">
      <LeagueHeader league={league} />
      
      {/* Dashboard Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-px border-b border-wc-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all duration-300 text-xs font-bold uppercase tracking-widest whitespace-nowrap ${
              activeTab === tab.id 
              ? 'border-wc-sky text-wc-sky bg-wc-sky/5' 
              : 'border-transparent text-wc-white/50 hover:text-wc-white hover:bg-wc-card/50'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Primary View */}
        <div className="lg:col-span-8">
          {activeTab === 'matches' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-display font-800 uppercase tracking-tighter text-wc-white">Próximos Encuentros</h2>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-wc-red bg-wc-red/10 border border-wc-red/30 px-2.5 py-1 rounded-full uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-wc-red animate-pulse"></span>
                  EN VIVO
                </div>
              </div>
              <UpcomingMatches leagueId={Number(leagueId)} />
            </div>
          )}
          
          {activeTab === 'standings' && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-display font-800 uppercase tracking-tighter mb-4 text-wc-white">Clasificación General</h2>
              <LeagueStandings leagueId={Number(leagueId)} />
            </div>
          )}

          {activeTab === 'members' && (
            <div className="bg-wc-card/40 rounded-[2rem] p-10 border border-wc-border text-center">
              <Users size={48} className="mx-auto text-wc-white/20 mb-6" />
              <h2 className="text-3xl font-display font-800 uppercase tracking-tighter mb-2 text-wc-white">Compite con más gente</h2>
              <p className="text-wc-white/50 text-xs font-bold uppercase tracking-widest mb-8">Invita a tus amigos usando el link de la liga</p>
              <Button className="mx-auto">
                <Share2 size={16} className="mr-2" /> Copiar Enlace de Invitación
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Mini Stats (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          {activeTab !== 'standings' && (
            <div className="bg-wc-card/60 backdrop-blur-sm rounded-3xl p-6 border border-wc-border shadow-card">
              <h3 className="text-xs font-bold uppercase tracking-widest text-wc-white/50 mb-6 flex items-center justify-between">
                Top Competidores <Trophy size={14} className="text-wc-gold" />
              </h3>
              <LeagueStandings leagueId={Number(leagueId)} compact />
            </div>
          )}
          
          <div className="bg-gradient-to-br from-wc-sky/10 to-transparent rounded-3xl p-6 border border-wc-sky/20 shadow-soft">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-wc-sky mb-4">Resumen de Puntos</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-wc-white">
                <span className="text-wc-white/60">Aciertos Exactos</span>
                <span className="text-wc-green">--</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-wc-white">
                <span className="text-wc-white/60">Ganadores Acertados</span>
                <span className="text-wc-gold">--</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
