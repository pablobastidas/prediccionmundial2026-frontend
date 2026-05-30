"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { getAllMatches } from '@/services/matchService';
import { getMyLeagues } from '@/services/leagueService';
import apiClient from '@/lib/api';
import { CalendarGrid } from '@/components/tournament/CalendarGrid';
import { Match, League, Prediction } from '@/types';
import { Spinner } from '@/components/ui/Spinner';
import { BarChart3, Trophy, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function ResultsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [predictionsLoading, setPredictionsLoading] = useState(false);

  // Fetch predictions for the selected league
  const fetchPredictions = useCallback(async (leagueId: number) => {
    try {
      setPredictionsLoading(true);
      const { data } = await apiClient.get(`/predictions?league_id=${leagueId}`);
      setPredictions(data);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setPredictionsLoading(false);
    }
  }, []);

  useEffect(() => {
    const initData = async () => {
      try {
        const [matchesData, leaguesData] = await Promise.all([
          getAllMatches(),
          getMyLeagues()
        ]);
        
        // Filter only finished matches
        setMatches(matchesData.filter(m => m.status === 'FINISHED' || m.result));
        setLeagues(leaguesData);
        
        if (leaguesData.length > 0) {
          const firstLeagueId = leaguesData[0].id;
          setSelectedLeagueId(firstLeagueId);
          await fetchPredictions(firstLeagueId);
        }
      } catch (error) {
        console.error('Error initializing results page:', error);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [fetchPredictions]);

  // Handle changing the selected league
  const handleLeagueChange = async (leagueId: number) => {
    setSelectedLeagueId(leagueId);
    await fetchPredictions(leagueId);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;

  return (
    <div className="animate-fade-up max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-wc-sky/10 border border-wc-sky/20 rounded-full">
          <BarChart3 size={12} className="text-wc-sky" />
          <span className="text-[10px] font-black uppercase tracking-widest text-wc-sky">Historial de Partidos</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-display font-800 text-wc-white uppercase tracking-tighter leading-none">Resultados</h1>
        <p className="text-wc-white/60 font-medium text-lg mt-2">Revisa los marcadores finales oficiales de la copa y tus puntuaciones.</p>
      </div>

      {/* Selector de Liga Glassmorphic */}
      {leagues.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-wc-white/[0.02] border border-wc-white/10 rounded-3xl backdrop-blur-md mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-wc-sky/10 border border-wc-sky/20 flex items-center justify-center text-wc-sky">
              <Trophy size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-wc-white/40 mb-0.5">Ver Puntos de</h4>
              <p className="text-sm font-bold text-wc-white">Historial de tus aciertos y plenos</p>
            </div>
          </div>
          <div className="relative">
            <select
              value={selectedLeagueId || ''}
              onChange={(e) => handleLeagueChange(Number(e.target.value))}
              className="appearance-none w-full sm:w-64 bg-wc-card/85 border border-wc-border rounded-xl px-5 py-3.5 pr-10 text-xs font-bold uppercase tracking-widest text-wc-white focus:outline-none focus:border-wc-sky focus:ring-1 focus:ring-wc-sky transition-all cursor-pointer"
            >
              {leagues.map((l) => (
                <option key={l.id} value={l.id} className="bg-wc-card text-wc-white">
                  {l.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-wc-white/40">
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      )}

      {/* Advertencia de No Ligas */}
      {leagues.length === 0 && (
        <div className="p-6 bg-wc-white/[0.02] border border-dashed border-wc-white/10 rounded-3xl text-center mb-8 flex flex-col items-center gap-3">
          <Trophy size={28} className="text-wc-white/20" />
          <p className="text-xs font-black uppercase tracking-widest text-wc-white/40">
            No tienes ligas activas
          </p>
          <p className="text-xs text-wc-white/60 max-w-md">
            Únete a una liga para ver tus pronósticos y el desglose de tus aciertos de cada partido.
          </p>
          <Link 
            href="/leagues"
            className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] bg-wc-red hover:bg-wc-red/90 text-wc-white px-6 py-3 rounded-xl transition-all shadow-glow-red"
          >
            Ir a Ligas
          </Link>
        </div>
      )}

      <div className={predictionsLoading ? 'opacity-60 transition-opacity pointer-events-none' : 'transition-opacity'}>
        <CalendarGrid 
          matches={matches} 
          predictions={predictions}
          leagueId={selectedLeagueId || undefined}
        />
      </div>
    </div>
  );
}
