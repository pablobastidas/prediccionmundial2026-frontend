import apiClient from '@/lib/api';
import { Tournament, Team } from '@/types';

export const getCurrentTournament = async (): Promise<Tournament> => {
  const { data } = await apiClient.get('/tournaments/current');
  return data;
};

export const getGroupsWithTeams = async () => {
  const { data } = await apiClient.get('/tournaments/current/groups');
  return data;
};
