import apiClient from '@/lib/api';
import { Match } from '@/types';

export const getAllMatches = async (stage?: string): Promise<Match[]> => {
  const url = stage ? `/matches?stage=${stage}` : '/matches';
  const { data } = await apiClient.get(url);
  return data;
};

export const getMatchById = async (id: number): Promise<Match> => {
  const { data } = await apiClient.get(`/matches/${id}`);
  return data;
};
