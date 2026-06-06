export interface PredictionRequest {
  date: string;
  plant: number;
  blaine: number;
  residue90: number;
  residue45: number;
  loi: number;
  so3: number;
  c3s: number;
  c2s: number;
  day2: number;
  day7: number;
}

export interface PredictionResponse {
  predicted_strength: number;
}