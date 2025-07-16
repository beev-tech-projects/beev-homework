import apiCall from "./api";

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  batteryCapacity: number;
  currentChargeLevel: number;
  status: "available" | "charging" | "in_use";
  lastUpdated: string;
  averageEnergyConsumption: number;
  type: "BEV" | "ICE";
  emissionGco2Km: number;
}

export interface VehicleFilter {
  brand?: string;
  model?: string;
  status?: string;
  type?: string;
  search?: string; // Nouveau champ pour la recherche globale
}

export interface VehicleSort {
  field?: string;
  direction?: "asc" | "desc";
}

export interface VehicleStats {
  total: number;
  available: number;
  charging: number;
  inUse: number;
  bev: number;
  ice: number;
}

export interface VehiclesResponse {
  vehicules: Vehicle[];
  total: number;
}

export const vehicleService = {
  async getVehicles(
    filter?: VehicleFilter,
    sort?: VehicleSort,
    page: number = 1,
    pageSize: number = 10
  ): Promise<VehiclesResponse> {
    const params = new URLSearchParams();
    
    if (filter) {
      params.append("filter", JSON.stringify(filter));
    }
    if (sort) {
      params.append("sort", JSON.stringify(sort));
    }

    params.append("page", page.toString());
    params.append("pageSize", pageSize.toString());

    const queryString = params.toString();
    const endpoint = `/vehicules?${queryString ?? ""}`;

    return apiCall<VehiclesResponse>(endpoint);
  },

  async getVehicleStats(filter?: VehicleFilter): Promise<VehicleStats> {
    const params = new URLSearchParams();

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        if (value) params.append(`filter[${key}]`, value);
      });
    }

    const queryString = params.toString();
    const endpoint = `/vehicules${queryString ? `?${queryString}` : ""}`;

    const response = await apiCall<VehiclesResponse>(endpoint);

    const stats: VehicleStats = {
      total: response.total,
      available: response.vehicules.filter((v) => v.status === "available")
        .length,
      charging: response.vehicules.filter((v) => v.status === "charging")
        .length,
      inUse: response.vehicules.filter((v) => v.status === "in_use").length,
      bev: response.vehicules.filter((v) => v.type === "BEV").length,
      ice: response.vehicules.filter((v) => v.type === "ICE").length,
    };

    return stats;
  },

  async getVehicle(id: string): Promise<Vehicle> {
    return apiCall<Vehicle>(`/vehicules/${id}`);
  },

  async createVehicle(vehicleData: Omit<Vehicle, "id">): Promise<Vehicle> {
    return apiCall<Vehicle>("/vehicules", {
      method: "POST",
      body: JSON.stringify(vehicleData),
    });
  },

  async updateVehicle(
    id: string,
    vehicleData: Partial<Vehicle>
  ): Promise<Vehicle> {
    return apiCall<Vehicle>(`/vehicules/${id}`, {
      method: "PUT",
      body: JSON.stringify(vehicleData),
    });
  },

  async deleteVehicle(id: string): Promise<void> {
    return apiCall<void>(`/vehicules/${id}`, {
      method: "DELETE",
    });
  },
};
