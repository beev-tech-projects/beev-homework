import { cn } from "@/lib/utils";

interface VehicleTypeBadgeProps {
  type: "BEV" | "ICE";
  className?: string;
}

export function VehicleTypeBadge({ type, className }: VehicleTypeBadgeProps) {
  const getTypeConfig = (type: string) => {
    switch (type) {
      case "BEV":
        return {
          label: "Électrique",
          className:
            "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
        };
      case "ICE":
        return {
          label: "Thermique",
          className:
            "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        };
      default:
        return {
          label: type,
          className:
            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
        };
    }
  };

  const config = getTypeConfig(type);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
