import { VehicleDataTable } from "@/components/vehicle/VehicleDataTable";
import { VehicleStats } from "@/components/vehicle/VehicleStats";
import { VehicleStatsSkeleton } from "@/components/vehicle/VehicleStatsSkeleton";
import { VehicleFilters } from "@/components/vehicle/VehicleFilters";
import { VehicleFilter } from "@/services/vehicle.service";
import { useVehicleStats, useVehicleTable } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

export default function FleetManagement() {
  const navigate = useNavigate();
  const {
    loading,
    filter,
    vehicles,
    total,
    page,
    pageSize,
    error,
    updateFilter,
    updatePage,
    updateSort,
    refresh,
  } = useVehicleTable();

  const { stats: vehicleStats, loading: vehicleStatsLoading } =
    useVehicleStats(filter);

  const handleClearFilters = () => {
    updateFilter({
      brand: undefined,
      model: undefined,
      status: undefined,
      type: undefined,
      search: undefined,
    });
  };

  const handleAdvancedFilterChange = (newFilter: VehicleFilter) => {
    const currentSearch = filter?.search;
    updateFilter({
      ...newFilter,
      search: currentSearch,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion de la Flotte
            </h1>
            <p className="text-gray-600">
              Gérez et surveillez tous vos véhicules depuis cette interface
              centralisée.
            </p>
          </div>
          <Button
            onClick={() => navigate("/create-vehicle")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nouveau véhicule
          </Button>
        </div>
      </div>

      {vehicleStatsLoading ? (
        <VehicleStatsSkeleton />
      ) : (
        <VehicleStats stats={vehicleStats} />
      )}

      <div className="mb-6">
        <VehicleFilters
          onFilterChange={handleAdvancedFilterChange}
          onClear={handleClearFilters}
        />
      </div>

      <VehicleDataTable
        vehicles={vehicles}
        total={total}
        loading={loading}
        error={error}
        page={page}
        pageSize={pageSize}
        onFilterChange={updateFilter}
        onSortChange={updateSort}
        onPageChange={updatePage}
        onRefresh={refresh}
      />
    </div>
  );
}
