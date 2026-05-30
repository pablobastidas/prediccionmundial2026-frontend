"use client";
import React, { useState, useEffect } from 'react';
import { Match, Prediction } from '@/types';
import { MatchScoreInput } from './MatchScoreInput';
import { savePrediction } from '@/services/predictionService';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, Sparkles, Trophy } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  prediction?: Prediction;
  leagueId?: number;
  onPredictionSaved?: () => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, prediction, leagueId, onPredictionSaved }) => {
  const [homeGoals, setHomeGoals] = useState(prediction?.predicted_home_goals ?? 0);
  const [awayGoals, setAwayGoals] = useState(prediction?.predicted_away_goals ?? 0);
  const [predictionType, setPredictionType] = useState<'EXACT' | 'OUTCOME'>(prediction?.prediction_type ?? 'OUTCOME');
  const [predictedOutcome, setPredictedOutcome] = useState<'home' | 'draw' | 'away' | null>(prediction?.predicted_outcome ?? null);
  
  // Estado para Optimistic UI
  const [optimisticPrediction, setOptimisticPrediction] = useState<{
    predicted_home_goals?: number | null;
    predicted_away_goals?: number | null;
    prediction_type: 'EXACT' | 'OUTCOME';
    predicted_outcome?: 'home' | 'draw' | 'away' | null;
  } | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sincronizar si cambia el prop prediction
  useEffect(() => {
    if (prediction) {
      setHomeGoals(prediction.predicted_home_goals ?? 0);
      setAwayGoals(prediction.predicted_away_goals ?? 0);
      setPredictionType(prediction.prediction_type ?? 'OUTCOME');
      setPredictedOutcome(prediction.predicted_outcome ?? null);
      setOptimisticPrediction(null);
    } else {
      setPredictionType('OUTCOME');
      setPredictedOutcome(null);
      setHomeGoals(0);
      setAwayGoals(0);
    }
  }, [prediction]);

  const canEdit = !!leagueId && match.status === 'SCHEDULED' && new Date(match.match_datetime) > new Date();
  
  const getStatusInfo = () => {
    if (match.status === 'FINISHED' && match.result) {
      const activePred = optimisticPrediction ?? prediction;
      if (!activePred) return { label: 'SIN PRONÓSTICO', color: 'border-wc-white/10 text-wc-white/30', icon: XCircle };
      
      let pointsAwarded = prediction?.points ?? 0;
      
      if (activePred) {
        const type = activePred.prediction_type;
        const realWinner = match.result.home_goals > match.result.away_goals ? 'home' : match.result.home_goals < match.result.away_goals ? 'away' : 'draw';
        
        if (type === 'OUTCOME') {
          const isCorrect = activePred.predicted_outcome === realWinner;
          pointsAwarded = isCorrect ? 2 : 0;
        } else {
          const h = activePred.predicted_home_goals;
          const a = activePred.predicted_away_goals;
          const isCorrectOutcome = (h !== null && h !== undefined && h > a! && realWinner === 'home') || 
                                   (h !== null && h !== undefined && h < a! && realWinner === 'away') || 
                                   (h !== null && h !== undefined && h === a && realWinner === 'draw');
          const isExact = h === match.result.home_goals && a === match.result.away_goals;
          pointsAwarded = isExact ? 4 : (isCorrectOutcome ? 3 : 0);
        }
      }

      if (pointsAwarded >= 4) {
        return { label: `PLENO +${pointsAwarded}`, color: 'border-wc-green bg-wc-green/10 text-wc-green shadow-[0_0_20px_rgba(34,197,94,0.2)]', icon: Trophy };
      } else if (pointsAwarded > 0) {
        return { label: `ACIERTO +${pointsAwarded}`, color: 'border-wc-gold bg-wc-gold/10 text-wc-gold shadow-[0_0_20px_rgba(196,160,82,0.2)]', icon: CheckCircle2 };
      }
      return { label: 'FALLO 0', color: 'border-wc-white/10 bg-wc-white/5 text-wc-white/40', icon: XCircle };
    }
    if (match.status === 'SCHEDULED') return { label: 'PRÓXIMO', color: 'border-wc-sky/30 bg-wc-sky/10 text-wc-sky', icon: Clock };
    if (match.status === 'PLAYING') return { label: 'EN JUEGO', color: 'border-wc-red bg-wc-red/20 text-wc-red animate-pulse', icon: Clock };
    return { label: match.status, color: 'border-wc-white/10 text-wc-white/50', icon: Clock };
  };

  const status = getStatusInfo();

  const handleQuickOutcome = async (outcome: 'home' | 'draw' | 'away') => {
    if (!leagueId || isSaving) return;

    // LOGICA OPTIMISTA
    setOptimisticPrediction({
      predicted_home_goals: null,
      predicted_away_goals: null,
      prediction_type: 'OUTCOME',
      predicted_outcome: outcome
    });
    setPredictedOutcome(outcome);
    setPredictionType('OUTCOME');
    setIsSaving(true);

    try {
      await savePrediction({
        id: prediction?.id,
        league_id: leagueId,
        match_id: match.id,
        predicted_home_goals: undefined,
        predicted_away_goals: undefined,
        prediction_type: 'OUTCOME',
        predicted_outcome: outcome
      });
      
      // Feedback visual de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      if (onPredictionSaved) onPredictionSaved();
    } catch (error) {
      console.error('Error saving quick prediction:', error);
      // Revertimos en caso de error
      setOptimisticPrediction(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveExact = async () => {
    if (!leagueId || isSaving) return;
    
    let activeOutcome: 'home' | 'draw' | 'away' = 'draw';
    if (homeGoals > awayGoals) activeOutcome = 'home';
    else if (homeGoals < awayGoals) activeOutcome = 'away';

    // LOGICA OPTIMISTA
    setOptimisticPrediction({
      predicted_home_goals: homeGoals,
      predicted_away_goals: awayGoals,
      prediction_type: 'EXACT',
      predicted_outcome: activeOutcome
    });
    setPredictionType('EXACT');
    setIsSaving(true);

    try {
      await savePrediction({
        id: prediction?.id,
        league_id: leagueId,
        match_id: match.id,
        predicted_home_goals: homeGoals,
        predicted_away_goals: awayGoals,
        prediction_type: 'EXACT',
        predicted_outcome: activeOutcome
      });
      
      // Feedback visual de éxito
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      if (onPredictionSaved) onPredictionSaved();
    } catch (error) {
      console.error('Error saving exact prediction:', error);
      // Revertimos en caso de error
      setOptimisticPrediction(null);
    } finally {
      setIsSaving(false);
    }
  };

  const activePred = optimisticPrediction ?? prediction;
  const activePredType = activePred?.prediction_type ?? predictionType;
  const displayHome = optimisticPrediction?.predicted_home_goals !== undefined ? optimisticPrediction.predicted_home_goals : (match.status === 'FINISHED' ? match.result?.home_goals : prediction?.predicted_home_goals);
  const displayAway = optimisticPrediction?.predicted_away_goals !== undefined ? optimisticPrediction.predicted_away_goals : (match.status === 'FINISHED' ? match.result?.away_goals : prediction?.predicted_away_goals);
  const displayOutcome = activePred?.predicted_outcome ?? predictedOutcome;

  const isExactSaved = activePredType === 'EXACT' && 
                       prediction?.predicted_home_goals === homeGoals && 
                       prediction?.predicted_away_goals === awayGoals;

  return (
    <div className="relative group opacity-0 animate-reveal">
      <div className={`
        relative overflow-hidden transition-all duration-300 rounded-2xl 
        bg-wc-white/[0.03] backdrop-blur-xl border
        hover:bg-wc-white/[0.06] shadow-lg
        ${activePred 
          ? 'border-wc-green/20 bg-wc-green/[0.01] hover:border-wc-green/35' 
          : 'border-wc-white/10 hover:border-wc-white/20'
        }
        ${showSuccess ? 'ring-2 ring-wc-green/50 shadow-[0_0_20px_rgba(34,197,94,0.15)]' : ''}
      `}>
        {/* Glow de éxito */}
        <div className={`absolute inset-0 bg-wc-green/5 transition-opacity duration-1000 pointer-events-none ${showSuccess ? 'opacity-100' : 'opacity-0'}`} />

        <div className="p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            
            {/* Columna 1: Info & Equipos (cols 1-5 en md) */}
            <div className="md:col-span-5 flex flex-col gap-2.5">
              {/* Fecha y Estado del Partido */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-wc-white/40">
                  {format(new Date(match.match_datetime), "EEE d MMM • HH:mm", { locale: es })}
                </span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all duration-300 ${status.color}`}>
                  <status.icon size={10} />
                  {status.label}
                </div>
                {/* Indicación de Pick Actual del Usuario */}
                {activePred && (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 bg-wc-green/10 border border-wc-green/25 rounded-md">
                    <CheckCircle2 size={10} className="text-wc-green" />
                    <span className="text-[8px] font-black text-wc-green uppercase tracking-widest">
                      {activePred.prediction_type === 'EXACT' 
                        ? `PICK: ${activePred.predicted_home_goals ?? 0}-${activePred.predicted_away_goals ?? 0}` 
                        : `PICK: ${activePred.predicted_outcome === 'home' ? '1' : activePred.predicted_outcome === 'away' ? '2' : 'X'}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Equipos listados verticalmente (Estilo Betano) */}
              <div className="flex flex-col gap-2">
                {/* Local */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-wc-white/90">
                    <span className="text-xl filter drop-shadow-sm">{match.home_team?.flag_emoji}</span>
                    <span className="uppercase tracking-wider truncate max-w-[120px] sm:max-w-none">{match.home_team?.name}</span>
                  </div>
                  {match.status === 'FINISHED' ? (
                    <span className="text-sm font-black text-wc-white tabular-nums bg-wc-dark/40 px-2 py-0.5 border border-wc-white/5 rounded-md">
                      {match.result?.home_goals}
                    </span>
                  ) : activePredType === 'EXACT' && (
                    <span className="text-[10px] font-bold text-wc-white/40 tabular-nums">
                      ({displayHome ?? 0})
                    </span>
                  )}
                </div>

                {/* Visitante */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-wc-white/90">
                    <span className="text-xl filter drop-shadow-sm">{match.away_team?.flag_emoji}</span>
                    <span className="uppercase tracking-wider truncate max-w-[120px] sm:max-w-none">{match.away_team?.name}</span>
                  </div>
                  {match.status === 'FINISHED' ? (
                    <span className="text-sm font-black text-wc-white tabular-nums bg-wc-dark/40 px-2 py-0.5 border border-wc-white/5 rounded-md">
                      {match.result?.away_goals}
                    </span>
                  ) : activePredType === 'EXACT' && (
                    <span className="text-[10px] font-bold text-wc-white/40 tabular-nums">
                      ({displayAway ?? 0})
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Columna 2: Predictores (cols 6-12 en md) */}
            {canEdit ? (
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 md:border-l md:border-wc-white/5 md:pl-5">
                {/* Mercado 1X2 */}
                <div className={`transition-all duration-300 ${activePredType === 'OUTCOME' ? 'opacity-100' : 'opacity-40 hover:opacity-75'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-wc-sky">Resultado 1X2</span>
                    <span className="text-[8px] font-bold text-wc-sky/70 uppercase tracking-widest bg-wc-sky/5 px-1.5 py-0.2 rounded">+2 pts</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickOutcome('home')}
                      disabled={isSaving}
                      className={`h-10 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ${
                        displayOutcome === 'home' && activePredType === 'OUTCOME'
                          ? 'bg-wc-sky/20 border-wc-sky text-wc-sky shadow-[0_0_12px_rgba(0,157,220,0.2)] scale-[1.02]'
                          : 'bg-wc-white/[0.02] border-wc-white/10 text-wc-white/60 hover:border-wc-white/20 hover:bg-wc-white/[0.04]'
                      }`}
                    >
                      <span className="text-[8px] font-bold text-wc-white/30">1</span>
                      <span className="text-[10px] font-black truncate max-w-full">{match.home_team?.code ?? 'L'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickOutcome('draw')}
                      disabled={isSaving}
                      className={`h-10 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ${
                        displayOutcome === 'draw' && activePredType === 'OUTCOME'
                          ? 'bg-wc-sky/20 border-wc-sky text-wc-sky shadow-[0_0_12px_rgba(0,157,220,0.2)] scale-[1.02]'
                          : 'bg-wc-white/[0.02] border-wc-white/10 text-wc-white/60 hover:border-wc-white/20 hover:bg-wc-white/[0.04]'
                      }`}
                    >
                      <span className="text-[8px] font-bold text-wc-white/30">X</span>
                      <span className="text-[10px] font-black">X</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickOutcome('away')}
                      disabled={isSaving}
                      className={`h-10 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ${
                        displayOutcome === 'away' && activePredType === 'OUTCOME'
                          ? 'bg-wc-sky/20 border-wc-sky text-wc-sky shadow-[0_0_12px_rgba(0,157,220,0.2)] scale-[1.02]'
                          : 'bg-wc-white/[0.02] border-wc-white/10 text-wc-white/60 hover:border-wc-white/20 hover:bg-wc-white/[0.04]'
                      }`}
                    >
                      <span className="text-[8px] font-bold text-wc-white/30">2</span>
                      <span className="text-[10px] font-black truncate max-w-full">{match.away_team?.code ?? 'V'}</span>
                    </button>
                  </div>
                </div>

                {/* Marcador Exacto */}
                <div className={`transition-all duration-300 flex flex-col justify-between ${activePredType === 'EXACT' ? 'opacity-100' : 'opacity-40 hover:opacity-75'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-wc-sky">Marcador Exacto</span>
                    <span className="text-[8px] font-bold text-wc-sky/70 uppercase tracking-widest bg-wc-sky/5 px-1.5 py-0.2 rounded">+4 / +3 pts</span>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-center items-center gap-2 py-0.5 bg-wc-white/[0.01] border border-wc-white/5 rounded-xl">
                      <MatchScoreInput value={homeGoals} onChange={setHomeGoals} label="" disabled={isSaving} compact={true} />
                      <span className="text-wc-white/20 font-black text-xs">:</span>
                      <MatchScoreInput value={awayGoals} onChange={setAwayGoals} label="" disabled={isSaving} compact={true} />
                    </div>
                    <button 
                      onClick={handleSaveExact}
                      disabled={isSaving || isExactSaved}
                      className={`h-10 w-full rounded-xl font-black text-[9px] tracking-wider transition-all active:scale-[0.98] disabled:opacity-40 ${
                        isExactSaved
                          ? 'bg-wc-green/20 border border-wc-green/30 text-wc-green cursor-default'
                          : activePredType === 'EXACT'
                            ? 'bg-wc-red text-wc-white shadow-glow-red hover:bg-wc-red/90 hover:scale-[1.02]'
                            : 'bg-wc-white/10 hover:bg-wc-white/15 text-wc-white hover:text-wc-white/95 hover:scale-[1.02]'
                      }`}
                    >
                      {isExactSaved ? 'GUARDADO' : 'GUARDAR'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="md:col-span-7 flex items-center md:justify-end">
                {activePred ? (
                  <div className="px-4 py-2 bg-wc-white/5 border border-wc-white/10 rounded-xl text-left md:text-right w-full md:w-auto">
                    <span className="block text-[8px] font-black text-wc-white/30 uppercase tracking-widest mb-0.5">Tu Pronóstico final</span>
                    <span className="text-xs font-black text-wc-white">
                      {activePred.prediction_type === 'EXACT' 
                        ? `Marcador: ${activePred.predicted_home_goals ?? 0} - ${activePred.predicted_away_goals ?? 0}` 
                        : `Resultado 1X2: Gana ${activePred.predicted_outcome === 'home' ? 'Local' : activePred.predicted_outcome === 'away' ? 'Visita' : 'Empate'}`}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-black text-wc-white/20 uppercase tracking-widest">Sin Pronóstico</span>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};
