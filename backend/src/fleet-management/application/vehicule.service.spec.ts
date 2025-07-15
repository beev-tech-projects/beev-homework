/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Vehicule } from '@fleet-management/domain/vehicule.entity';
import { Status } from '@fleet-management/domain/types/status.enum';
import { VehiculeType } from '@fleet-management/domain/types/vehicule-type.enum';
import { VehiculeFilter } from '@fleet-management/domain/value-objects/vehicule-filter.value-object';
import { VehiculeSorter } from '@fleet-management/domain/value-objects/vehicule-sorter.value-object';
import { VehiculeModel } from '@fleet-management/infrastructure/type-orm/vehicule.model';
import { VehiculeApplicationService } from '@fleet-management/application/vehicule.service';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('VehiculeApplicationService', () => {
  let service: VehiculeApplicationService;
  let repository: any;

  const mockVehicule: Vehicule = {
    id: '1',
    brand: 'Tesla',
    model: 'Model 3',
    batteryCapacity: 75,
    currentChargeLevel: 80,
    status: Status.available,
    lastUpdated: new Date(),
    averageEnergyConsumption: 15,
    type: VehiculeType.BEV,
    emissionGco2Km: 0,
  };

  const mockQueryBuilder = {
    getManyAndCount: jest.fn(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiculeApplicationService,
        {
          provide: getRepositoryToken(VehiculeModel),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VehiculeApplicationService>(
      VehiculeApplicationService,
    );
    repository = mockRepository;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFilteredVehicules', () => {
    it('should return filtered vehicules with total count', async () => {
      const filter = new VehiculeFilter({ brand: 'Tesla' });
      const sort = new VehiculeSorter('brand', 'ASC');

      mockQueryBuilder.getManyAndCount.mockResolvedValue([[mockVehicule], 1]);
      jest
        .spyOn(VehiculeFilter, 'applyFilterAndSort')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getFilteredVehicules(filter, sort, 1, 10);

      expect(result).toEqual({
        vehicules: [mockVehicule],
        total: 1,
      });
    });
  });

  describe('getVehiculeById', () => {
    it('should return a vehicule by id', async () => {
      repository.findOne.mockResolvedValue(mockVehicule);

      const result = await service.getVehiculeById('1');

      expect(result).toEqual(mockVehicule);
    });

    it('should return null if vehicule not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.getVehiculeById('999');

      expect(result).toBeNull();
    });
  });

  describe('createVehicule', () => {
    it('should create a new vehicule', async () => {
      const newVehiculeData = {
        brand: 'BMW',
        model: 'i3',
        batteryCapacity: 60,
        currentChargeLevel: 100,
        status: Status.available,
        lastUpdated: new Date(),
        averageEnergyConsumption: 12,
        type: VehiculeType.BEV,
        emissionGco2Km: 0,
      };

      const createdVehicule = { id: '2', ...newVehiculeData };

      repository.create.mockReturnValue(createdVehicule);
      repository.save.mockResolvedValue(createdVehicule);

      const result = await service.createVehicule(newVehiculeData);

      expect(result).toEqual(createdVehicule);
    });
  });

  describe('updateVehicule', () => {
    it('should update an existing vehicule', async () => {
      const updatedVehicule = { ...mockVehicule, brand: 'BMW' };

      repository.update.mockResolvedValue({ affected: 1 });
      repository.findOne.mockResolvedValue(updatedVehicule);

      const result = await service.updateVehicule(updatedVehicule);

      expect(result).toEqual(updatedVehicule);
    });

    it('should throw error if vehicule not found after update', async () => {
      repository.update.mockResolvedValue({ affected: 1 });
      repository.findOne.mockResolvedValue(null);

      await expect(service.updateVehicule(mockVehicule)).rejects.toThrow(
        `Vehicule with id ${mockVehicule.id} not found`,
      );
    });
  });

  describe('deleteVehicule', () => {
    it('should delete a vehicule by id', async () => {
      repository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteVehicule('1');

      expect(repository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw error if vehicule not found', async () => {
      repository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteVehicule('999')).rejects.toThrow(
        'Vehicule with id 999 not found',
      );
    });
  });
});
