import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api';
import { League } from '@/types';

export const useLeague = (leagueId: number) => {
  const [league, setLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeague = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/leagues/${leagueId}`);
      setLeague(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Error loading league');
    } finally {
      setLoading(false);
    }
  }, [leagueId]);

  useEffect(() => {
    if (leagueId) fetchLeague();
  }, [leagueId, fetchLeague]);

  return { league, loading, error, refetch: fetchLeague };
};
