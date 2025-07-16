import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { vehicleService, type Vehicle } from "@/services/vehicle.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleStatusBadge } from "@/components/vehicle/VehicleStatusBadge";
import { VehicleTypeBadge } from "@/components/vehicle/VehicleTypeBadge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Edit3, Save, X, Trash2 } from "lucide-react";

export default function Vehicle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editedVehicle, setEditedVehicle] = useState<Vehicle | null>(null);

  const loadVehicle = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const vehicleData = await vehicleService.getVehicle(id);
      setVehicle(vehicleData);
      setEditedVehicle(vehicleData);
    } catch (err) {
      setError("Erreur lors du chargement du véhicule");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  const handleSave = async () => {
    if (!editedVehicle || !id) return;

    try {
      setSaving(true);
      const updatedVehicle = await vehicleService.updateVehicle(
        id,
        editedVehicle
      );
      setVehicle(updatedVehicle);
      setIsEditing(false);
      // Invalider le cache pour rafraîchir la liste
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicleStats"] });
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !vehicle) return;

    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer le véhicule ${vehicle.brand} ${vehicle.model} ?`
    );

    if (!confirmDelete) return;

    try {
      setDeleting(true);
      await vehicleService.deleteVehicle(id);
      navigate("/fleet-management");
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setEditedVehicle(vehicle);
    setIsEditing(false);
    setError(null);
  };

  const handleFieldChange = (field: keyof Vehicle, value: string | number) => {
    if (!editedVehicle) return;
    setEditedVehicle({ ...editedVehicle, [field]: value });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !vehicle) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => navigate("/fleet-management")}>
            Retour à la gestion de flotte
          </Button>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Véhicule non trouvé
          </h2>
          <Button onClick={() => navigate("/fleet-management")}>
            Retour à la gestion de flotte
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/fleet-management")}
          className="mb-4"
        >
          ← Retour à la gestion de flotte
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-gray-600">Détails et gestion du véhicule</p>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Éditer
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {deleting ? "Suppression..." : "Supprimer"}
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Annuler
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Informations générales
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marque
                </label>
                {isEditing ? (
                  <Input
                    value={editedVehicle?.brand || ""}
                    onChange={(e) => handleFieldChange("brand", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{vehicle.brand}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modèle
                </label>
                {isEditing ? (
                  <Input
                    value={editedVehicle?.model || ""}
                    onChange={(e) => handleFieldChange("model", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{vehicle.model}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                {isEditing ? (
                  <select
                    value={editedVehicle?.type || ""}
                    onChange={(e) => handleFieldChange("type", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="BEV">BEV</option>
                    <option value="ICE">ICE</option>
                  </select>
                ) : (
                  <VehicleTypeBadge type={vehicle.type} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut
                </label>
                {isEditing ? (
                  <select
                    value={editedVehicle?.status || ""}
                    onChange={(e) =>
                      handleFieldChange("status", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="available">Disponible</option>
                    <option value="charging">En charge</option>
                    <option value="in_use">En utilisation</option>
                  </select>
                ) : (
                  <VehicleStatusBadge status={vehicle.status} />
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Spécifications techniques
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacité batterie (kWh)
                </label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedVehicle?.batteryCapacity || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "batteryCapacity",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                ) : (
                  <p className="text-gray-900">{vehicle.batteryCapacity} kWh</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau de charge actuel (%)
                </label>
                {isEditing ? (
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editedVehicle?.currentChargeLevel || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "currentChargeLevel",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                ) : (
                  <p className="text-gray-900">{vehicle.currentChargeLevel}%</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consommation moyenne (kWh/100km)
                </label>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.1"
                    value={editedVehicle?.averageEnergyConsumption || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "averageEnergyConsumption",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                ) : (
                  <p className="text-gray-900">
                    {vehicle.averageEnergyConsumption} kWh/100km
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Émissions CO2 (g/km)
                </label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedVehicle?.emissionGco2Km || ""}
                    onChange={(e) =>
                      handleFieldChange(
                        "emissionGco2Km",
                        parseFloat(e.target.value)
                      )
                    }
                  />
                ) : (
                  <p className="text-gray-900">{vehicle.emissionGco2Km} g/km</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <h3 className="text-lg font-semibold mb-4">Informations système</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID du véhicule
              </label>
              <p className="text-gray-900 font-mono text-sm">{vehicle.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dernière mise à jour
              </label>
              <p className="text-gray-900">
                {new Date(vehicle.lastUpdated).toLocaleString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
