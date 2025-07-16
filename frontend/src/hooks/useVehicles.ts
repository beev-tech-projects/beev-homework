import { useVehicleStats } from "./useVehicleStats";
import { useVehicleTable } from "./useVehicleTable";
import { VehicleFilter, VehicleSort } from "@/services/vehicle.service";

export function useVehicles(
  initialFilter?: VehicleFilter,
  initialSort?: VehicleSort,
  initialPage: number = 1,
  pageSize: number = 10
) {
  const tableHook = useVehicleTable(
    initialFilter,
    initialSort,
    initialPage,
    pageSize
  );

  const statsHook = useVehicleStats(tableHook.filter);

  const refresh = async () => {
    await Promise.all([tableHook.refresh(), statsHook.refresh()]);
  };

  return {
    // Données du tableau
    vehicles: tableHook.vehicles,
    total: tableHook.total,
    loading: tableHook.loading,
    error: tableHook.error,
    filter: tableHook.filter,
    sort: tableHook.sort,
    page: tableHook.page,
    pageSize: tableHook.pageSize,
    stats: statsHook.stats,
    statsLoading: statsHook.loading,
    updateFilter: tableHook.updateFilter,
    updateSort: tableHook.updateSort,
    updatePage: tableHook.updatePage,
    refresh,
  };
}
