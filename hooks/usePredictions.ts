import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/apiClient';
import { Prediction } from '@/types';

export const usePredictions = (leagueId?: number) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPredictions = useCallback(async () => {
    try {
      setLoading(true);
      const url = leagueId ? `/predictions?league_id=${leagueId}` : '/predictions';
      const { data } = await apiClient.get(url);
      setPredictions(data);
    } catch (err: any) {
      setError('Error fetching predictions');
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  return { predictions, loading, error, refetch: fetchPredictions };
};
