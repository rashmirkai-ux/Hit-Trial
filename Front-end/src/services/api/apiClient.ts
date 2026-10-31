/**
 * SAJAG - Frontend API Client
 * Decoupled client abstraction for backend FastAPI and local AI/ML pipelines.
 */

import { RouteOption, RiskZone, SafeLocation, TelemetryData } from '../../types';
import { MOCK_ROUTES, MOCK_RISK_ZONES, MOCK_SAFE_LOCATIONS, INITIAL_TELEMETRY } from '../../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = {
  // Routes Service
  async getEvaluatedRoutes(originCoords: [number, number], destCoords: [number, number]): Promise<RouteOption[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/routes/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin: { lat: originCoords[0], lng: originCoords[1] },
          destination: { lat: destCoords[0], lng: destCoords[1] },
        }),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Gracefully fall back to local high-fidelity routes
    }
    return MOCK_ROUTES;
  },

  // Risk Assessment Service
  async getRiskZones(): Promise<RiskZone[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/risk/zones`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }
    return MOCK_RISK_ZONES;
  },

  // Safe Locations POI
  async getSafeLocations(): Promise<SafeLocation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/safe-havens`);
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback
    }
    return MOCK_SAFE_LOCATIONS;
  },

  // Live Telemetry
  async getLiveTelemetry(): Promise<TelemetryData> {
    return INITIAL_TELEMETRY;
  },

  // AI/ML Safety Scoring
  async predictSafetyScore(features: {
    lighting_density: number;
    police_patrol_rate: number;
    crime_incident_index: number;
    weather_severity: number;
    cctv_density: number;
    hour_of_day: number;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/ml/predict-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Fallback calculation
    }

    const baseScore = Math.min(98, Math.max(20, (features.lighting_density * 0.4 + features.cctv_density * 0.3 + features.police_patrol_rate * 10 - features.crime_incident_index * 0.3)));
    return {
      predicted_safety_score: Math.round(baseScore),
      risk_level: baseScore > 80 ? 'low' : baseScore > 60 ? 'moderate' : 'high',
      is_simulated: true,
      model_version: 'SAJAG-Local-Evaluator-v1.2',
    };
  },
};
