"use client";
import React, { useEffect, useState } from 'react';
import { usePredictions } from '@/hooks/usePredictions';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Target, Trophy, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function MyPredictionsPage() {
  const { predictions, loading } = usePredictions();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;

  const totalPoints = predictions.reduce((sum, p) => sum + (p.points || 0), 0);
  const perfectHits = predictions.filter(p => p.points === 3).length;

  return (
    <div className="animate-fade-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-wc-green/10 border border-wc-green/20 rounded-full">
            <Target size={12} className="text-wc-green" />
            <span className="text-[10px] font-black uppercase tracking-widest text-wc-green">Mis Apuestas</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-800 text-wc-white uppercase tracking-tighter leading-none">Mis Picks</h1>
          <p className="text-wc-white/60 font-medium text-lg mt-2">Revisa el historial y rendimiento de tus pronósticos guardados.</p>
        </div>
      </div>

      {/* Mini Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Card className="p-6 bg-wc-card/40 border-wc-border text-center">
          <div className="text-wc-sky mb-2 flex justify-center"><Target size={24} /></div>
          <div className="text-3xl font-display font-800 text-wc-white">{predictions.length}</div>
          <div className="text-[10px] font-bold text-wc-white/40 uppercase tracking-widest">Picks Totales</div>
        </Card>
        <Card className="p-6 bg-wc-card/40 border-wc-border text-center">
          <div className="text-wc-gold mb-2 flex justify-center"><Trophy size={24} /></div>
          <div className="text-3xl font-display font-800 text-wc-gold">{totalPoints}</div>
          <div className="text-[10px] font-bold text-wc-white/40 uppercase tracking-widest">Puntos Totales</div>
        </Card>
        <Card className="p-6 bg-wc-card/40 border-wc-border text-center">
          <div className="text-wc-green mb-2 flex justify-center"><CheckCircle2 size={24} /></div>
          <div className="text-3xl font-display font-800 text-wc-green">{perfectHits}</div>
          <div className="text-[10px] font-bold text-wc-white/40 uppercase tracking-widest">Plenos (+3)</div>
        </Card>
        <Card className="p-6 bg-wc-card/40 border-wc-border text-center">
          <div className="text-wc-white/50 mb-2 flex justify-center"><Clock size={24} /></div>
          <div className="text-3xl font-display font-800 text-wc-white/80">{predictions.filter(p => p.points === null || p.points === undefined).length}</div>
          <div className="text-[10px] font-bold text-wc-white/40 uppercase tracking-widest">Pendientes</div>
        </Card>
      </div>

      {predictions.length === 0 ? (
        <Card className="p-10 text-center border-dashed border-wc-border bg-wc-dark/30">
          <div className="text-wc-white/30 flex justify-center mb-4"><Target size={48} /></div>
          <p className="text-wc-white/60 text-lg font-bold">Aún no has hecho ningún pronóstico.</p>
          <p className="text-wc-white/40 mt-2">Ve a la sección de partidos para comenzar a jugar.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {predictions.map(p => {
            const hasPlayed = p.points !== null && p.points !== undefined;
            const isPerfect = p.points === 3;
            const isMiss = p.points === 0;

            return (
              <Card key={p.id} className="p-6 bg-wc-card/60 flex items-center justify-between hover:border-wc-sky transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-wc-sky uppercase tracking-widest">Liga ID: {p.league_id} • Partido ID: {p.match_id}</span>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-3xl font-display font-800 text-wc-white tracking-tighter">
                      {p.predicted_home_goals} <span className="text-wc-white/30 font-black">:</span> {p.predicted_away_goals}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  {!hasPlayed ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-wc-sky/10 border border-wc-sky/30 text-wc-sky">
                      <Clock size={12} /> Pendiente
                    </div>
                  ) : (
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${isPerfect ? 'bg-wc-green/10 border-wc-green text-wc-green' : isMiss ? 'bg-wc-dark/50 border-wc-border text-wc-white/40' : 'bg-wc-gold/10 border-wc-gold text-wc-gold'}`}>
                      {isPerfect ? <CheckCircle2 size={12} /> : isMiss ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                      {isPerfect ? 'Pleno (+3)' : isMiss ? 'Fallo (0)' : `Acertado (+${p.points})`}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
