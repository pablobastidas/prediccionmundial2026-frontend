export interface League {
  id: number;
  name: string;
  creator_id: number;
  is_active: boolean;
  is_public: boolean;
  description?: string;
  max_members?: number;
  members_count?: number;
  invite_token?: string;
  created_at: string;
  updated_at?: string;
}

export interface Standing {
  position: number;
  user_id: number;
  display_name: string;
  total_points: number;
  predictions_count: number;
  correct_predictions: number;
  exact_predictions?: number;
}

export interface TeamInfo {
  id: number;
  name: string;
  code: string;
  flag_emoji?: string;
}

export interface Match {
  id: number;
  home_team?: TeamInfo;
  away_team?: TeamInfo;
  home_placeholder?: string;
  away_placeholder?: string;
  match_datetime: string;
  stage: string;
  status: string;
  result?: { home_goals: number; away_goals: number } | null;
}

export interface Prediction {
  id: number;
  league_id: number;
  match_id: number;
  predicted_home_goals?: number | null;
  predicted_away_goals?: number | null;
  prediction_type: 'EXACT' | 'OUTCOME';
  predicted_outcome?: 'home' | 'draw' | 'away' | null;
  points: number;
}

export interface TournamentGroup {
  id: number;
  name: string;
  teams: (TeamInfo & { points: number; position: number })[];
}

// Legacy aliases kept for backward compatibility
export type User = { id: number; email: string; display_name: string; created_at: string };
export type Team = TeamInfo & { flag_emoji: string };
export type MatchResultInfo = { home_goals: number; away_goals: number };
export type Tournament = { id: number; name: string; year: number };
export type GroupTeam = TeamInfo & { points: number; position: number };
