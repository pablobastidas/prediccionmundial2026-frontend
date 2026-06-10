import apiClient from '@/lib/apiClient';

export interface SimulatorStatus {
  group_locked: boolean;
  knockout_unlocked: boolean;
  server_time: string;
  group_lock_time?: string;
  knockout_unlock_time?: string;
}

export interface BracketPredictionData {
  group_picks?: Record<string, string[]>;
  selected_thirds?: string[];
  bracket_picks?: any;
  champion_name?: string;
  third_name?: string;
}

export const getSimulatorStatus = async (): Promise<SimulatorStatus> => {
  const { data } = await apiClient.get('/simulator/status');
  return data;
};

export const loadSimulatorPrediction = async (): Promise<BracketPredictionData | null> => {
  const { data } = await apiClient.get('/simulator/load');
  return data;
};

export const saveSimulatorPrediction = async (pred: BracketPredictionData): Promise<BracketPredictionData> => {
  const { data } = await apiClient.post('/simulator/save', pred);
  return data;
};
