import { SelectQueryBuilder } from 'typeorm';
import { VehiculeModel } from '@fleet-management/infrastructure/type-orm/vehicule.model';
import { Status } from '@fleet-management/domain/types/status.enum';
import { VehiculeSorter } from '@fleet-management/domain/value-objects/vehicule-sorter.value-object';
import { VehiculeType } from '@fleet-management/domain/types/vehicule-type.enum';

export class VehiculeFilter {
  brand?: string;
  model?: string;
  status?: Status;
  type?: VehiculeType;
  minBatteryCapacity?: number;
  maxBatteryCapacity?: number;
  minCurrentChargeLevel?: number;
  maxCurrentChargeLevel?: number;
  minAverageEnergyConsumption?: number;
  maxAverageEnergyConsumption?: number;
  minEmissionGco2Km?: number;
  maxEmissionGco2Km?: number;

  constructor(init?: Partial<VehiculeFilter>) {
    Object.assign(this, init);
  }

  static applyFilterAndSort(
    queryBuilder: SelectQueryBuilder<VehiculeModel>,
    filter?: VehiculeFilter,
    sort?: VehiculeSorter,
    page?: number,
    pageSize?: number,
  ): SelectQueryBuilder<VehiculeModel> {
    const filteredQuery = queryBuilder;

    const allowedSortFields = [
      'brand',
      'model',
      'status',
      'type',
      'batteryCapacity',
      'currentChargeLevel',
      'averageEnergyConsumption',
      'emissionGco2Km',
    ];

    if (filter?.brand) {
      filteredQuery.andWhere('vehicule.brand = :brand', {
        brand: filter.brand,
      });
    }
    if (filter?.model) {
      filteredQuery.andWhere('vehicule.model = :model', {
        model: filter.model,
      });
    }
    if (filter?.status) {
      filteredQuery.andWhere('vehicule.status = :status', {
        status: filter.status,
      });
    }
    if (filter?.type) {
      filteredQuery.andWhere('vehicule.type = :type', {
        type: filter.type,
      });
    }

    if (filter?.minBatteryCapacity !== undefined) {
      filteredQuery.andWhere(
        'vehicule.batteryCapacity >= :minBatteryCapacity',
        {
          minBatteryCapacity: filter.minBatteryCapacity,
        },
      );
    }
    if (filter?.maxBatteryCapacity !== undefined) {
      filteredQuery.andWhere(
        'vehicule.batteryCapacity <= :maxBatteryCapacity',
        {
          maxBatteryCapacity: filter.maxBatteryCapacity,
        },
      );
    }

    if (filter?.minCurrentChargeLevel !== undefined) {
      filteredQuery.andWhere(
        'vehicule.currentChargeLevel >= :minCurrentChargeLevel',
        {
          minCurrentChargeLevel: filter.minCurrentChargeLevel,
        },
      );
    }
    if (filter?.maxCurrentChargeLevel !== undefined) {
      filteredQuery.andWhere(
        'vehicule.currentChargeLevel <= :maxCurrentChargeLevel',
        {
          maxCurrentChargeLevel: filter.maxCurrentChargeLevel,
        },
      );
    }

    if (filter?.minAverageEnergyConsumption !== undefined) {
      filteredQuery.andWhere(
        'vehicule.averageEnergyConsumption >= :minAverageEnergyConsumption',
        {
          minAverageEnergyConsumption: filter.minAverageEnergyConsumption,
        },
      );
    }
    if (filter?.maxAverageEnergyConsumption !== undefined) {
      filteredQuery.andWhere(
        'vehicule.averageEnergyConsumption <= :maxAverageEnergyConsumption',
        {
          maxAverageEnergyConsumption: filter.maxAverageEnergyConsumption,
        },
      );
    }

    if (filter?.minEmissionGco2Km !== undefined) {
      filteredQuery.andWhere('vehicule.emissionGco2Km >= :minEmissionGco2Km', {
        minEmissionGco2Km: filter.minEmissionGco2Km,
      });
    }
    if (filter?.maxEmissionGco2Km !== undefined) {
      filteredQuery.andWhere('vehicule.emissionGco2Km <= :maxEmissionGco2Km', {
        maxEmissionGco2Km: filter.maxEmissionGco2Km,
      });
    }

    if (
      sort?.field &&
      sort?.direction &&
      allowedSortFields.includes(sort.field)
    ) {
      filteredQuery.orderBy(`vehicule.${sort.field}`, sort.direction);
    }

    if (page !== undefined && pageSize !== undefined) {
      if (page < 1) {
        throw new Error('Page number must be greater than 0');
      }
      if (pageSize < 1) {
        throw new Error('Page size must be greater than 0');
      }
      filteredQuery
        .skip(((page ?? 1) - 1) * (pageSize ?? 10))
        .take(pageSize ?? 10);
    }

    return filteredQuery;
  }
}
