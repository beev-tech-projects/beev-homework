import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehiculeFilter } from '@fleet-management/domain/value-objects/vehicule-filter.value-object';
import { VehiculeSorter } from '@fleet-management/domain/value-objects/vehicule-sorter.value-object';
import { Vehicule } from '@fleet-management/domain/vehicule.entity';
import { VehiculeModel } from '@fleet-management/infrastructure/type-orm/vehicule.model';

@Injectable()
export class VehiculeApplicationService {
  constructor(
    @InjectRepository(VehiculeModel)
    private vehiculeRepository: Repository<VehiculeModel>,
  ) {}

  async getFilteredVehicules(
    filter: VehiculeFilter,
    sort?: VehiculeSorter,
    page?: number,
    pageSize?: number,
  ): Promise<{ vehicules: Vehicule[]; total: number }> {
    const queryBuilder = this.vehiculeRepository.createQueryBuilder('vehicule');
    const filteredQuery = VehiculeFilter.applyFilterAndSort(
      queryBuilder,
      filter,
      sort,
      page,
      pageSize,
    );

    const [vehicules, total] = await filteredQuery.getManyAndCount();
    return { vehicules, total };
  }

  async getVehiculeById(id: string): Promise<Vehicule | null> {
    return this.vehiculeRepository.findOne({ where: { id } });
  }

  async createVehicule(vehicule: Omit<Vehicule, 'id'>): Promise<Vehicule> {
    const vehiculeModel = this.vehiculeRepository.create(vehicule);
    return this.vehiculeRepository.save(vehiculeModel);
  }

  async updateVehicule(vehicule: Vehicule): Promise<Vehicule> {
    await this.vehiculeRepository.update(vehicule.id, vehicule);
    const updatedVehicule = await this.vehiculeRepository.findOne({
      where: { id: vehicule.id },
    });
    if (!updatedVehicule) {
      throw new Error(`Vehicule with id ${vehicule.id} not found`);
    }
    return updatedVehicule;
  }

  async deleteVehicule(id: string): Promise<void> {
    const result = await this.vehiculeRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Vehicule with id ${id} not found`);
    }
  }
}
