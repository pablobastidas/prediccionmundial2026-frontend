import apiClient from '@/lib/api';
import { League } from '@/types';

export const createLeague = async (name: string): Promise<League> => {
  const { data } = await apiClient.post('/leagues', { name });
  return data;
};

export const getMyLeagues = async (): Promise<League[]> => {
  const { data } = await apiClient.get('/leagues');
  return data;
};

export const getLeagueById = async (id: number): Promise<League> => {
  const { data } = await apiClient.get(`/leagues/${id}`);
  return data;
};

export const joinLeagueByToken = async (id: number, token: string): Promise<League> => {
  const { data } = await apiClient.post(`/leagues/${id}/join`, { invite_token: token });
  return data;
};
