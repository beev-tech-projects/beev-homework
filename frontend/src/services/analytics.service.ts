import apiCall from "./api";

export interface FleetEfficiencyResponse {
  fleetEfficiency: number;
  comparison: {
    BEV: number;
    ICE: number;
  };
}

export interface FleetCompositionResponse {
  BEV: number;
  ICE: number;
}

export interface FleetOperationalResponse {
  fleetAvailabilityRate: number;
  chargingVehicules: number;
  inUseVehicules: number;
}

export interface AnalyticsFilter {
  brand?: string;
  model?: string;
  status?: string;
  type?: string;
  minBatteryCapacity?: number;
  maxBatteryCapacity?: number;
  minCurrentChargeLevel?: number;
  maxCurrentChargeLevel?: number;
  minAverageEnergyConsumption?: number;
  maxAverageEnergyConsumption?: number;
  minEmissionGco2Km?: number;
  maxEmissionGco2Km?: number;
}

const buildQueryParams = (filter?: AnalyticsFilter): string => {
  if (!filter) return "";

  const params = new URLSearchParams();

  Object.entries(filter).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(`filter[${key}]`, value.toString());
    }
  });

  return params.toString() ? `?${params.toString()}` : "";
};

export const analyticsService = {
  getFleetEfficiency: async (
    filter?: AnalyticsFilter
  ): Promise<FleetEfficiencyResponse> => {
    const queryParams = buildQueryParams(filter);
    return apiCall<FleetEfficiencyResponse>(
      `/analytics/fleet-efficiency${queryParams}`
    );
  },

  getFleetComposition: async (
    filter?: AnalyticsFilter
  ): Promise<FleetCompositionResponse> => {
    const queryParams = buildQueryParams(filter);
    return apiCall<FleetCompositionResponse>(
      `/analytics/fleet-composition${queryParams}`
    );
  },

  getFleetOperational: async (
    filter?: AnalyticsFilter
  ): Promise<FleetOperationalResponse> => {
    const queryParams = buildQueryParams(filter);
    return apiCall<FleetOperationalResponse>(
      `/analytics/fleet-operational${queryParams}`
    );
  },
};
