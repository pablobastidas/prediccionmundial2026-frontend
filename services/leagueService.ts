import apiClient from '@/lib/apiClient';
import { League, Standing } from '@/types';

export const createLeague = async (dataPayload: { name: string; description?: string; is_public?: boolean; max_members?: number }): Promise<League> => {
  const { data } = await apiClient.post('/leagues', dataPayload);
  return data;
};

export const getMyLeagues = async (): Promise<League[]> => {
  const { data } = await apiClient.get('/leagues');
  return data;
};

export const getPublicLeagues = async (): Promise<League[]> => {
  const { data } = await apiClient.get('/leagues/public');
  return data;
};

export const getLeagueById = async (id: number): Promise<League> => {
  const { data } = await apiClient.get(`/leagues/${id}`);
  return data;
};

export const joinLeagueByToken = async (token: string): Promise<League> => {
  const { data } = await apiClient.post(`/leagues/join/token`, { invite_token: token });
  return data;
};

export const joinLeagueById = async (id: number): Promise<League> => {
  const { data } = await apiClient.post(`/leagues/${id}/join`);
  return data;
};

export const getLeagueStandings = async (id: number): Promise<Standing[]> => {
  const { data } = await apiClient.get(`/standings/${id}`);
  return data;
};
