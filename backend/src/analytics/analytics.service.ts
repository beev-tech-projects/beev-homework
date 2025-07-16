import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from '@fleet-management/domain/types/status.enum';
import { VehiculeType } from '@fleet-management/domain/types/vehicule-type.enum';
import { Vehicule } from '@fleet-management/domain/vehicule.entity';
import { VehiculeFilter } from '@fleet-management/domain/value-objects/vehicule-filter.value-object';
import { VehiculeModel } from '@fleet-management/infrastructure/type-orm/vehicule.model';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(VehiculeModel)
    private readonly vehiculeRepository: Repository<VehiculeModel>,
  ) {}

  async getAverageEnergyConsumption(filter: VehiculeFilter): Promise<number> {
    const vehicules = await this.getFilteredVehicules(filter);

    if (!vehicules || vehicules.length === 0) {
      return 0;
    }

    const totalConsumption = vehicules.reduce(
      (sum, vehicule) => sum + vehicule.averageEnergyConsumption,
      0,
    );

    return totalConsumption / vehicules.length;
  }

  async getEmissionComparison(filter: VehiculeFilter): Promise<{
    [VehiculeType.BEV]: number;
    [VehiculeType.ICE]: number;
  }> {
    const vehicules = await this.getFilteredVehicules(filter);

    const comparison = { [VehiculeType.BEV]: 0, [VehiculeType.ICE]: 0 };

    vehicules.forEach((vehicule) => {
      console.log(
        `Vehicule Type: ${vehicule.type}, Emission: ${vehicule.emissionGco2Km}`,
      );
      if (vehicule.type === VehiculeType.BEV) {
        comparison[VehiculeType.BEV] += vehicule.emissionGco2Km;
      } else {
        comparison[VehiculeType.ICE] += vehicule.emissionGco2Km;
      }
    });

    return comparison;
  }

  async getFleetDistribution(filter: VehiculeFilter): Promise<{
    [VehiculeType.BEV]: number;
    [VehiculeType.ICE]: number;
  }> {
    const vehicules = await this.getFilteredVehicules(filter);

    const distribution = { [VehiculeType.BEV]: 0, [VehiculeType.ICE]: 0 };

    vehicules.forEach((vehicule) => {
      if (vehicule.type === VehiculeType.BEV) {
        distribution[VehiculeType.BEV]++;
      } else {
        distribution[VehiculeType.ICE]++;
      }
    });

    return distribution;
  }

  async getFleetAvailabilityRate(filter: VehiculeFilter): Promise<number> {
    const modifiedFilter = { ...filter, status: Status.available };

    const availableVehicules = await this.getFilteredVehicules(modifiedFilter);

    const vehicules = await this.getFilteredVehicules(new VehiculeFilter());

    if (!vehicules || vehicules.length === 0) {
      return 0;
    }

    if (availableVehicules.length === 0) {
      return 0;
    }

    return (availableVehicules.length / vehicules.length) * 100;
  }

  async getChargingVehicules(filter: VehiculeFilter): Promise<Vehicule[]> {
    const modifiedFilter = new VehiculeFilter({
      ...filter,
      status: Status.charging,
    });
    return await this.getFilteredVehicules(modifiedFilter);
  }

  async getInUseVehicules(filter: VehiculeFilter): Promise<Vehicule[]> {
    const modifiedFilter = new VehiculeFilter({
      ...filter,
      status: Status.in_use,
    });
    return await this.getFilteredVehicules(modifiedFilter);
  }

  private async getFilteredVehicules(
    filter: VehiculeFilter,
  ): Promise<Vehicule[]> {
    const queryBuilder = this.vehiculeRepository.createQueryBuilder('vehicule');
    const filteredQuery = VehiculeFilter.applyFilterAndSort(
      queryBuilder,
      filter,
    );
    return await filteredQuery.getMany();
  }
}
