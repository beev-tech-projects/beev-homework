import { useState, useEffect } from "react";
import {
  vehicleService,
  Vehicle,
  VehicleFilter,
  VehicleSort,
  VehiclesResponse,
} from "@/services/vehicle.service";

export function useVehicleTable(
  initialFilter?: VehicleFilter,
  initialSort?: VehicleSort,
  initialPage: number = 1,
  pageSize: number = 10
) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<VehicleFilter | undefined>(
    initialFilter
  );
  const [sort, setSort] = useState<VehicleSort | undefined>(initialSort);
  const [page, setPage] = useState(initialPage);

  useEffect(() => {
    const loadVehicles = async () => {
      setLoading(true);
      setError(null);

      try {
        const response: VehiclesResponse = await vehicleService.getVehicles(
          filter,
          sort,
          page,
          pageSize
        );
        setVehicles(response.vehicules);
        setTotal(response.total);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    };

    loadVehicles();
  }, [filter, sort, page, pageSize]);

  const updateFilter = (newFilter: VehicleFilter) => {
    const mergedFilter = { ...filter, ...newFilter };

    Object.keys(mergedFilter).forEach((key) => {
      if (!mergedFilter[key as keyof VehicleFilter]) {
        delete mergedFilter[key as keyof VehicleFilter];
      }
    });

    setFilter(mergedFilter);
    setPage(1);
  };

  const updateSort = (newSort: VehicleSort) => {
    setSort(newSort);
    setPage(1);
  };

  const updatePage = (newPage: number) => {
    setPage(newPage);
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);

    try {
      const response: VehiclesResponse = await vehicleService.getVehicles(
        filter,
        sort,
        page,
        pageSize
      );
      setVehicles(response.vehicules);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return {
    vehicles,
    total,
    loading,
    error,
    filter,
    sort,
    page,
    pageSize,
    updateFilter,
    updateSort,
    updatePage,
    refresh,
  };
}
