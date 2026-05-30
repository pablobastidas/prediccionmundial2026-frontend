"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { getAllMatches } from '@/services/matchService';
import { getMyLeagues } from '@/services/leagueService';
import apiClient from '@/lib/api';
import { CalendarGrid } from '@/components/tournament/CalendarGrid';
import { Match, League, Prediction } from '@/types';
import { Calendar, Sparkles, Trophy, ChevronDown } from 'lucide-react';
import { MatchSkeleton } from '@/components/ui/MatchSkeleton';
import Link from 'next/link';

export default function MatchesPage() {
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

  // Fetch matches and user leagues on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const [matchesData, leaguesData] = await Promise.all([
          getAllMatches(),
          getMyLeagues()
        ]);
        setMatches(matchesData);
        setLeagues(leaguesData);
        
        if (leaguesData.length > 0) {
          const firstLeagueId = leaguesData[0].id;
          setSelectedLeagueId(firstLeagueId);
          await fetchPredictions(firstLeagueId);
        }
      } catch (error) {
        console.error('Error initializing matches page:', error);
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

  const handlePredictionSaved = () => {
    if (selectedLeagueId) {
      fetchPredictions(selectedLeagueId);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Premium */}
      <div className="mb-12 space-y-4 opacity-0 animate-reveal" style={{ animationDelay: '0.1s' }}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-wc-red/10 border border-wc-red/20 rounded-full">
          <Calendar size={14} className="text-wc-red" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wc-red">Calendario Oficial</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-800 text-wc-white uppercase tracking-tighter leading-none">Partidos</h1>
        <p className="text-wc-white/40 font-medium text-lg max-w-2xl">Revisa las fechas y planifica tus pronósticos con anticipación.</p>
      </div>

      {/* Selector de Liga Glassmorphic */}
      {!loading && leagues.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-wc-white/[0.02] border border-wc-white/10 rounded-3xl backdrop-blur-md mb-8 opacity-0 animate-reveal" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-wc-sky/10 border border-wc-sky/20 flex items-center justify-center text-wc-sky">
              <Trophy size={18} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-wc-white/40 mb-0.5">Competir en</h4>
              <p className="text-sm font-bold text-wc-white">Guarda y edita pronósticos oficiales</p>
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
      {!loading && leagues.length === 0 && (
        <div className="p-6 bg-wc-white/[0.02] border border-dashed border-wc-white/10 rounded-3xl text-center mb-8 flex flex-col items-center gap-3 opacity-0 animate-reveal" style={{ animationDelay: '0.2s' }}>
          <Trophy size={28} className="text-wc-white/20 animate-pulse" />
          <p className="text-xs font-black uppercase tracking-widest text-wc-white/40">
            No tienes ligas activas
          </p>
          <p className="text-xs text-wc-white/60 max-w-md">
            Crea o únete a una liga para poder ingresar y guardar tus pronósticos oficiales del mundial.
          </p>
          <Link 
            href="/leagues"
            className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] bg-wc-red hover:bg-wc-red/90 text-wc-white px-6 py-3 rounded-xl transition-all shadow-glow-red"
          >
            Ir a Ligas
          </Link>
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          {[...Array(6)].map((_, i) => (
            <MatchSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className={predictionsLoading ? 'opacity-60 transition-opacity pointer-events-none' : 'transition-opacity'}>
          <CalendarGrid 
            matches={matches} 
            predictions={predictions}
            leagueId={selectedLeagueId || undefined}
            onPredictionSaved={handlePredictionSaved}
          />
        </div>
      )}

      {!loading && matches.length === 0 && (
        <div className="text-center py-20 bg-wc-white/[0.02] rounded-[3rem] border border-dashed border-wc-white/10">
          <Sparkles className="mx-auto text-wc-white/10 mb-4" size={48} />
          <p className="text-wc-white/20 font-bold uppercase tracking-widest">No hay partidos programados</p>
        </div>
      )}
    </div>
  );
}
