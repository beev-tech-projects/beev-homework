import {
  Inject,
  Get,
  Query,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { VehiculeType } from '@fleet-management/domain/types/vehicule-type.enum';
import { VehiculeFilter } from '@fleet-management/domain/value-objects/vehicule-filter.value-object';
import { AnalyticsService } from '@analytics/analytics.service';

@Controller('analytics')
@UseInterceptors(CacheInterceptor)
export class AnalyticsController {
  constructor(
    @Inject()
    private readonly analyticsService: AnalyticsService,
  ) {}

  @Get('fleet-efficiency')
  @CacheTTL(300)
  async getFleetEfficiency(@Query('filter') filter: VehiculeFilter): Promise<{
    fleetEfficiency: number;
    comparison: {
      [VehiculeType.BEV]: number;
      [VehiculeType.ICE]: number;
    };
  }> {
    const fleetEfficiency =
      await this.analyticsService.getAverageEnergyConsumption(filter);

    const comparison =
      await this.analyticsService.getEmissionComparison(filter);

    return {
      fleetEfficiency,
      comparison,
    };
  }

  @Get('fleet-composition')
  @CacheTTL(300)
  async getFleetComposition(
    @Query('filter') filter: VehiculeFilter,
  ): Promise<{ [VehiculeType.BEV]: number; [VehiculeType.ICE]: number }> {
    return this.analyticsService.getFleetDistribution(filter);
  }

  @Get('fleet-operational')
  @CacheTTL(300)
  async getFleetOperationalStatus(
    @Query('filter') filter: VehiculeFilter,
  ): Promise<{
    fleetAvailabilityRate: number;
    chargingVehicules: number;
    inUseVehicules: number;
  }> {
    const fleetAvailabilityRate =
      await this.analyticsService.getFleetAvailabilityRate(filter);

    const chargingVehicules =
      await this.analyticsService.getChargingVehicules(filter);

    const inUseVehicules =
      await this.analyticsService.getInUseVehicules(filter);

    return {
      fleetAvailabilityRate,
      chargingVehicules: chargingVehicules.length,
      inUseVehicules: inUseVehicules.length,
    };
  }
}
