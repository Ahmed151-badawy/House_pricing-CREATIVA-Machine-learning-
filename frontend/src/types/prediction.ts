export interface PredictionRequest {
  location: string;
  carpet_area_sqft: number;
  floor_num: number;
  bathroom: number;
  balcony: number;
  furnishing: string;
  transaction: string;
  ownership: string;
  facing: string;
}

export interface PredictionResponse {
  predicted_price: number;
  formatted_price: string;
  currency: string;
  status: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  model_loaded: boolean;
}

export interface PredictionResultState {
  request: PredictionRequest;
  response: PredictionResponse;
}

