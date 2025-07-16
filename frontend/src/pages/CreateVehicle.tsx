import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { vehicleService, type Vehicle } from "@/services/vehicle.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Save, X } from "lucide-react";

export default function CreateVehicle() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicleData, setVehicleData] = useState<
    Omit<Vehicle, "id" | "lastUpdated">
  >({
    brand: "",
    model: "",
    batteryCapacity: 0,
    currentChargeLevel: 100,
    status: "available",
    averageEnergyConsumption: 0,
    type: "BEV",
    emissionGco2Km: 0,
  });

  const handleSave = async () => {
    if (!vehicleData.brand || !vehicleData.model) {
      setError("La marque et le modèle sont requis");
      return;
    }

    if (vehicleData.batteryCapacity <= 0) {
      setError("La capacité de batterie doit être supérieure à 0");
      return;
    }

    if (
      vehicleData.currentChargeLevel < 0 ||
      vehicleData.currentChargeLevel > 100
    ) {
      setError("Le niveau de charge doit être entre 0 et 100");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const vehicleToCreate = {
        ...vehicleData,
        lastUpdated: new Date().toISOString(),
      };

      await vehicleService.createVehicle(vehicleToCreate);

      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicleStats"] });

      navigate("/fleet-management");
    } catch (err) {
      setError("Erreur lors de la création du véhicule");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate("/fleet-management");
  };

  const handleFieldChange = (
    field: keyof typeof vehicleData,
    value: string | number
  ) => {
    setVehicleData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Button variant="outline" onClick={handleCancel} className="mb-4">
          ← Retour à la gestion de flotte
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Créer un nouveau véhicule
            </h1>
            <p className="text-gray-600">
              Ajoutez un nouveau véhicule à votre flotte
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Création..." : "Créer"}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Annuler
            </Button>
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
                  Marque *
                </label>
                <Input
                  value={vehicleData.brand}
                  onChange={(e) => handleFieldChange("brand", e.target.value)}
                  placeholder="ex: Tesla"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modèle *
                </label>
                <Input
                  value={vehicleData.model}
                  onChange={(e) => handleFieldChange("model", e.target.value)}
                  placeholder="ex: Model 3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={vehicleData.type}
                  onChange={(e) => handleFieldChange("type", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="BEV">BEV (Battery Electric Vehicle)</option>
                  <option value="ICE">ICE (Internal Combustion Engine)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Statut initial
                </label>
                <select
                  value={vehicleData.status}
                  onChange={(e) => handleFieldChange("status", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="available">Disponible</option>
                  <option value="charging">En charge</option>
                  <option value="in_use">En utilisation</option>
                </select>
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
                  Capacité batterie (kWh) *
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={vehicleData.batteryCapacity}
                  onChange={(e) =>
                    handleFieldChange(
                      "batteryCapacity",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="ex: 75"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau de charge actuel (%)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={vehicleData.currentChargeLevel}
                  onChange={(e) =>
                    handleFieldChange(
                      "currentChargeLevel",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="ex: 80"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consommation moyenne (kWh/100km)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  value={vehicleData.averageEnergyConsumption}
                  onChange={(e) =>
                    handleFieldChange(
                      "averageEnergyConsumption",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="ex: 15.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Émissions CO2 (g/km)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={vehicleData.emissionGco2Km}
                  onChange={(e) =>
                    handleFieldChange(
                      "emissionGco2Km",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="ex: 0"
                />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex justify-end">
          <p className="text-sm text-gray-500">* Champs requis</p>
        </div>
      </div>
    </div>
  );
}
