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

    if (sort?.field && sort?.direction) {
      filteredQuery.orderBy(`vehicule.${sort.field}`, sort.direction);
    }

    filteredQuery
      .skip(((page ?? 1) - 1) * (pageSize ?? 10))
      .take(pageSize ?? 10);

    return filteredQuery;
  }
}
