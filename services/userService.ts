import apiClient from '@/lib/apiClient';

export interface UserStats {
  position: string | number;
  total_points: number;
  correct_predictions: number;
  exact_predictions: number;
  predictions_count: number;
  effectiveness: number;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  unlocked: boolean;
}

export const getUserStats = async (): Promise<UserStats> => {
  const res = await apiClient.get('/users/me/stats');
  return res.data;
};

export const getMyBadges = async (): Promise<Badge[]> => {
  const res = await apiClient.get('/users/me/badges');
  return res.data;
};

export const updateUserProfile = async (data: { display_name: string; avatar_url?: string }) => {
  const res = await apiClient.put('/users/me', data);
  return res.data;
};
