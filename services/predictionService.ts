import apiClient from '@/lib/api';
import { Prediction } from '@/types';

export const createPrediction = async (
  league_id: number, 
  match_id: number, 
  predicted_home_goals?: number | null, 
  predicted_away_goals?: number | null,
  prediction_type: 'EXACT' | 'OUTCOME' = 'EXACT',
  predicted_outcome?: 'home' | 'draw' | 'away' | null
): Promise<Prediction> => {
  const { data } = await apiClient.post('/predictions', { 
    league_id, 
    match_id, 
    predicted_home_goals, 
    predicted_away_goals,
    prediction_type,
    predicted_outcome
  });
  return data;
};

export const updatePrediction = async (
  prediction_id: number, 
  predicted_home_goals?: number | null, 
  predicted_away_goals?: number | null,
  prediction_type: 'EXACT' | 'OUTCOME' = 'EXACT',
  predicted_outcome?: 'home' | 'draw' | 'away' | null
): Promise<Prediction> => {
  const { data } = await apiClient.put(`/predictions/${prediction_id}`, { 
    predicted_home_goals, 
    predicted_away_goals,
    prediction_type,
    predicted_outcome
  });
  return data;
};

export const savePrediction = async (predictionData: { 
  id?: number;
  league_id: number; 
  match_id: number; 
  predicted_home_goals?: number | null; 
  predicted_away_goals?: number | null; 
  prediction_type: 'EXACT' | 'OUTCOME';
  predicted_outcome?: 'home' | 'draw' | 'away' | null;
}): Promise<Prediction> => {
  if (predictionData.id) {
    const { data } = await apiClient.put(`/predictions/${predictionData.id}`, {
      predicted_home_goals: predictionData.predicted_home_goals,
      predicted_away_goals: predictionData.predicted_away_goals,
      prediction_type: predictionData.prediction_type,
      predicted_outcome: predictionData.predicted_outcome
    });
    return data;
  }
  const { data } = await apiClient.post('/predictions', predictionData);
  return data;
};
