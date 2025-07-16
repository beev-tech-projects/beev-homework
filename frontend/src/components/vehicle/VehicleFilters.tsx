import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleFilter } from "@/services/vehicle.service";

interface VehicleFiltersProps {
  onFilterChange: (filter: VehicleFilter) => void;
  onClear: () => void;
}

export function VehicleFilters({
  onFilterChange,
  onClear,
}: VehicleFiltersProps) {
  const [filters, setFilters] = useState<VehicleFilter>({});

  const handleFilterChange = (key: keyof VehicleFilter, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    setFilters({});
    onClear();
  };

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filtres</h3>
        <Button onClick={handleClear} variant="outline" size="sm">
          Effacer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marque
          </label>
          <Input
            placeholder="Ex: Tesla"
            value={filters.brand || ""}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Modèle
          </label>
          <Input
            placeholder="Ex: Model S"
            value={filters.model || ""}
            onChange={(e) => handleFilterChange("model", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status || ""}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="charging">En charge</option>
            <option value="in_use">En utilisation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.type || ""}
            onChange={(e) => handleFilterChange("type", e.target.value)}
          >
            <option value="">Tous les types</option>
            <option value="BEV">Électrique</option>
            <option value="ICE">Thermique</option>
          </select>
        </div>
      </div>
    </div>
  );
}
