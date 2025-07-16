import { useQuery } from "@tanstack/react-query";
import {
  analyticsService,
  type AnalyticsFilter,
} from "@/services/analytics.service";

export const analyticsQueryKeys = {
  all: ["analytics"] as const,
  fleetEfficiency: (filter?: AnalyticsFilter) =>
    [...analyticsQueryKeys.all, "fleet-efficiency", filter] as const,
  fleetComposition: (filter?: AnalyticsFilter) =>
    [...analyticsQueryKeys.all, "fleet-composition", filter] as const,
  fleetOperational: (filter?: AnalyticsFilter) =>
    [...analyticsQueryKeys.all, "fleet-operational", filter] as const,
};

export const useFleetEfficiency = (filter?: AnalyticsFilter) => {
  return useQuery({
    queryKey: analyticsQueryKeys.fleetEfficiency(filter),
    queryFn: () => analyticsService.getFleetEfficiency(filter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFleetComposition = (filter?: AnalyticsFilter) => {
  return useQuery({
    queryKey: analyticsQueryKeys.fleetComposition(filter),
    queryFn: () => analyticsService.getFleetComposition(filter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useFleetOperational = (filter?: AnalyticsFilter) => {
  return useQuery({
    queryKey: analyticsQueryKeys.fleetOperational(filter),
    queryFn: () => analyticsService.getFleetOperational(filter),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useAnalytics = (filter?: AnalyticsFilter) => {
  const fleetEfficiency = useFleetEfficiency(filter);
  const fleetComposition = useFleetComposition(filter);
  const fleetOperational = useFleetOperational(filter);

  return {
    fleetEfficiency,
    fleetComposition,
    fleetOperational,
    isLoading:
      fleetEfficiency.isLoading ||
      fleetComposition.isLoading ||
      fleetOperational.isLoading,
    isError:
      fleetEfficiency.isError ||
      fleetComposition.isError ||
      fleetOperational.isError,
    error:
      fleetEfficiency.error || fleetComposition.error || fleetOperational.error,
  };
};
