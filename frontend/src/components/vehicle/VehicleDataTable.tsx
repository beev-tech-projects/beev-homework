import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleStatusBadge } from "./VehicleStatusBadge";
import { VehicleTypeBadge } from "./VehicleTypeBadge";
import { VehicleTableSkeleton } from "./VehicleTableSkeleton";
import {
  Vehicle,
  VehicleFilter,
  VehicleSort,
} from "@/services/vehicle.service";

interface VehicleDataTableProps {
  vehicles: Vehicle[];
  total: number;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  onFilterChange: (filter: VehicleFilter) => void;
  onSortChange: (sort: VehicleSort) => void;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export function VehicleDataTable({
  vehicles,
  total,
  loading,
  error,
  page,
  pageSize,
  onFilterChange,
  onSortChange,
  onPageChange,
  onRefresh,
}: VehicleDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      onFilterChange({
        search: value.trim(),
      });
    } else {
      onFilterChange({});
    }
  };

  const handleSort = (field: string) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    onSortChange({
      field,
      direction: newDirection,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatBatteryLevel = (currentLevel: number, capacity: number) => {
    const percentage = (currentLevel / capacity) * 100;
    return `${currentLevel}/${capacity} kWh (${percentage.toFixed(1)}%)`;
  };

  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return <VehicleTableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-red-500 mb-4">Erreur: {error}</p>
        <Button onClick={onRefresh} variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Rechercher par marque ou modèle..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={onRefresh} variant="outline" disabled={loading}>
            Actualiser
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {total} véhicule{total > 1 ? "s" : ""} au total
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("brand")}
                  className="h-auto p-0 font-semibold"
                >
                  Marque
                  {sortField === "brand" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("model")}
                  className="h-auto p-0 font-semibold"
                >
                  Modèle
                  {sortField === "model" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="h-auto p-0 font-semibold"
                >
                  Statut
                  {sortField === "status" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Button>
              </TableHead>
              <TableHead>Batterie</TableHead>
              <TableHead>Consommation</TableHead>
              <TableHead>CO₂</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("lastUpdated")}
                  className="h-auto p-0 font-semibold"
                >
                  Dernière mise à jour
                  {sortField === "lastUpdated" && (
                    <span className="ml-1">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Aucun véhicule trouvé
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.brand}</TableCell>
                  <TableCell>{vehicle.model}</TableCell>
                  <TableCell>
                    <VehicleTypeBadge type={vehicle.type} />
                  </TableCell>
                  <TableCell>
                    <VehicleStatusBadge status={vehicle.status} />
                  </TableCell>
                  <TableCell>
                    {formatBatteryLevel(
                      vehicle.currentChargeLevel,
                      vehicle.batteryCapacity
                    )}
                  </TableCell>
                  <TableCell>
                    {vehicle.averageEnergyConsumption.toFixed(1)} kWh/100km
                  </TableCell>
                  <TableCell>{vehicle.emissionGco2Km} g/km</TableCell>
                  <TableCell>{formatDate(vehicle.lastUpdated)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {page} sur {totalPages}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
