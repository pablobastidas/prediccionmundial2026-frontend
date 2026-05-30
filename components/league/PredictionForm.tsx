import React, { useState } from 'react';
import { MatchScoreInput } from '../match/MatchScoreInput';
import { Button } from '../ui/Button';
import { createPrediction, updatePrediction } from '../../services/predictionService';

type Props = { 
  matchId: number; 
  leagueId: number; 
  existingId?: number; 
  initialHome?: number; 
  initialAway?: number; 
  onSuccess: () => void 
};

export const PredictionForm: React.FC<Props> = ({ matchId, leagueId, existingId, initialHome, initialAway, onSuccess }) => {
  const [home, setHome] = useState(initialHome ?? 0);
  const [away, setAway] = useState(initialAway ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (existingId) {
        await updatePrediction(existingId, home, away);
      } else {
        await createPrediction(leagueId, matchId, home, away);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error guardando predicción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      <h3 className="text-center font-bold mb-4">Tu Pronóstico</h3>
      <div className="flex justify-center gap-4 mb-4">
        <MatchScoreInput value={home} onChange={setHome} label="Local" />
        <span className="text-2xl mt-8">-</span>
        <MatchScoreInput value={away} onChange={setAway} label="Visita" />
      </div>
      {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
      <Button className="w-full" onClick={handleSubmit} loading={loading}>
        Guardar Pronóstico
      </Button>
    </div>
  );
};
