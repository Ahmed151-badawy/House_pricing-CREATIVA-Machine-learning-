import type { PredictionRequest, PredictionResponse, HealthResponse } from "../types/prediction";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (typeof errorData.detail === "string") {
        errorMessage = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail
          .map((item: { loc?: string[]; msg?: string }) => {
            const field = item.loc ? item.loc[item.loc.length - 1] : "field";
            return `${field}: ${item.msg || "Invalid value"}`;
          })
          .join("; ");
      }
    } catch {
      // Fallback to HTTP status text if JSON parsing fails
      errorMessage = response.statusText || errorMessage;
    }
    throw new ApiError(errorMessage, response.status);
  }
  return response.json() as Promise<T>;
}

export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return handleResponse<HealthResponse>(response);
}

export async function predictHousePrice(payload: PredictionRequest): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  return handleResponse<PredictionResponse>(response);
}

export async function fetchLocations(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/locations`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  return handleResponse<string[]>(response);
}

