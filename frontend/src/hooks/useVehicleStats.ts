import { useState, useEffect } from "react";
import {
  vehicleService,
  VehicleFilter,
  VehicleStats,
} from "@/services/vehicle.service";

export function useVehicleStats(filter?: VehicleFilter) {
  const [stats, setStats] = useState<VehicleStats>({
    total: 0,
    available: 0,
    charging: 0,
    inUse: 0,
    bev: 0,
    ice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError(null);

      try {
        const globalStats = await vehicleService.getVehicleStats(filter);
        setStats(globalStats);
        console.log("Statistiques globales:", globalStats);
      } catch (err) {
        console.error("Erreur lors du chargement des statistiques:", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [filter]);

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const globalStats = await vehicleService.getVehicleStats(filter);
      setStats(globalStats);
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    refresh,
  };
}
