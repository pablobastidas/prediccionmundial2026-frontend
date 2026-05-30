"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { usePredictions } from '@/hooks/usePredictions';
import { Spinner } from '@/components/ui/Spinner';

export default function PredictionsPage() {
  const { leagueId } = useParams();
  const { predictions, loading } = usePredictions(Number(leagueId));

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Predicciones</h1>
      <div className="bg-white rounded shadow p-4">
        {predictions.length === 0 ? <p>No hay predicciones.</p> : (
          <ul>
            {predictions.map(p => (
              <li key={p.id} className="border-b py-2">
                Partido ID: {p.match_id} | Predicción: {p.predicted_home_goals} - {p.predicted_away_goals} | Puntos: {p.points}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
