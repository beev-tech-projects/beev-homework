import { VehicleStats as VehicleStatsType } from "@/services/vehicle.service";

interface VehicleStatsProps {
  stats: VehicleStatsType;
}

export function VehicleStats({ stats }: VehicleStatsProps) {

  const StatCard = ({
    title,
    value,
    color,
  }: {
    title: string;
    value: number;
    color: string;
  }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}
        >
          <span className="text-white text-xl font-bold">{value}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
      <StatCard title="Total" value={stats.total} color="bg-blue-500" />
      <StatCard
        title="Disponibles"
        value={stats.available}
        color="bg-green-500"
      />
      <StatCard
        title="En charge"
        value={stats.charging}
        color="bg-yellow-500"
      />
      <StatCard
        title="En utilisation"
        value={stats.inUse}
        color="bg-orange-500"
      />
      <StatCard title="Électriques" value={stats.bev} color="bg-emerald-500" />
      <StatCard title="Thermiques" value={stats.ice} color="bg-gray-500" />
    </div>
  );
}
