import { SidebarTrigger } from "../components/ui/sidebar";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Dashboard() {
  const {
    fleetEfficiency,
    fleetComposition,
    fleetOperational,
    isLoading,
    isError,
    error,
  } = useAnalytics();

  if (isLoading) {
    return (
      <main className="flex flex-col items-center justify-start gap-4 px-8 py-16">
        <SidebarTrigger className="absolute top-4 left-4" />
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center justify-center">
          <div className="text-lg">Chargement des données...</div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex flex-col items-center justify-start gap-4 px-8 py-16">
        <SidebarTrigger className="absolute top-4 left-4" />
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center justify-center">
          <div className="text-lg text-red-500">
            Erreur lors du chargement : {error?.message}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start gap-4 px-8 py-16">
      <SidebarTrigger className="absolute top-4 left-4" />
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Efficacité de la flotte
          </h2>
          <div className="space-y-2">
            <p className="text-3xl font-bold text-blue-600">
              {fleetEfficiency.data?.fleetEfficiency.toFixed(2)} kWh/100km
            </p>
            <div className="text-sm text-gray-600">
              <p>
                BEV: {fleetEfficiency.data?.comparison.BEV.toFixed(2)} g CO2/km
              </p>
              <p>
                ICE: {fleetEfficiency.data?.comparison.ICE.toFixed(2)} g CO2/km
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Composition de la flotte
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Véhicules électriques (BEV):</span>
              <span className="font-bold text-green-600">
                {fleetComposition.data?.BEV || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Véhicules thermiques (ICE):</span>
              <span className="font-bold text-orange-600">
                {fleetComposition.data?.ICE || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Statut opérationnel</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Taux de disponibilité:</span>
              <span className="font-bold text-blue-600">
                {fleetOperational.data?.fleetAvailabilityRate.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>En charge:</span>
              <span className="font-bold text-yellow-600">
                {fleetOperational.data?.chargingVehicules || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>En utilisation:</span>
              <span className="font-bold text-red-600">
                {fleetOperational.data?.inUseVehicules || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
