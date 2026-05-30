export type User = { id: number; email: string; display_name: string; created_at: string };
export type League = { id: number; name: string; creator_id: number; members_count: number; invite_token?: string; created_at: string; is_active: boolean };
export type Team = { id: number; name: string; code: string; flag_emoji: string };
export type MatchResultInfo = { home_goals: number; away_goals: number };
export type Match = { id: number; home_team: Team; away_team: Team; match_datetime: string; stage: string; status: string; result?: MatchResultInfo };
export type Prediction = { 
  id: number; 
  league_id: number; 
  match_id: number; 
  predicted_home_goals?: number | null; 
  predicted_away_goals?: number | null; 
  prediction_type: 'EXACT' | 'OUTCOME';
  predicted_outcome?: 'home' | 'draw' | 'away' | null;
  points: number; 
};
export type Standing = { position: number; user_id: number; display_name: string; total_points: number; predictions_count: number; correct_predictions: number };
export type Tournament = { id: number; name: string; year: number };
