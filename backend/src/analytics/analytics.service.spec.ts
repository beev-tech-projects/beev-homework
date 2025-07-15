/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { VehiculeModel } from '../fleet-management/infrastructure/type-orm/vehicule.model';
import { VehiculeFilter } from '../fleet-management/domain/value-objects/vehicule-filter.value-object';
import { Vehicule } from '../fleet-management/domain/vehicule.entity';
import { Status } from '../fleet-management/domain/types/status.enum';
import { VehiculeType } from '../fleet-management/domain/types/vehicule-type.enum';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockBevVehicule: Vehicule = {
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

  const mockIceVehicule: Vehicule = {
    id: '2',
    brand: 'BMW',
    model: 'X5',
    batteryCapacity: 0,
    currentChargeLevel: 0,
    status: Status.in_use,
    lastUpdated: new Date(),
    averageEnergyConsumption: 25,
    type: VehiculeType.ICE,
    emissionGco2Km: 180,
  };

  const mockQueryBuilder = {
    getMany: jest.fn(),
    andWhere: jest.fn().mockReturnThis(),
  };

  const mockRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(VehiculeModel),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAverageEnergyConsumption', () => {
    it('should calculate average energy consumption correctly', async () => {
      const filter = new VehiculeFilter();
      const mockVehicules = [mockBevVehicule, mockIceVehicule];

      mockQueryBuilder.getMany.mockResolvedValue(mockVehicules);
      jest
        .spyOn(VehiculeFilter, 'applyFilterAndSort')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getAverageEnergyConsumption(filter);

      expect(result).toBe(20); // (15 + 25) / 2
    });

    it('should return 0 when no vehicules found', async () => {
      const filter = new VehiculeFilter();

      mockQueryBuilder.getMany.mockResolvedValue([]);
      jest
        .spyOn(VehiculeFilter, 'applyFilterAndSort')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getAverageEnergyConsumption(filter);

      expect(result).toBe(0);
    });

    it('should return 0 when vehicules array is null', async () => {
      const filter = new VehiculeFilter();

      mockQueryBuilder.getMany.mockResolvedValue(null);
      jest
        .spyOn(VehiculeFilter, 'applyFilterAndSort')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getAverageEnergyConsumption(filter);

      expect(result).toBe(0);
    });
  });

  describe('getEmissionComparison', () => {
    it('should calculate emission comparison correctly', async () => {
      const filter = new VehiculeFilter();
      const mockVehicules = [
        mockBevVehicule,
        { ...mockBevVehicule, id: '3', emissionGco2Km: 5 },
        mockIceVehicule,
        { ...mockIceVehicule, id: '4', emissionGco2Km: 200 },
      ];

      mockQueryBuilder.getMany.mockResolvedValue(mockVehicules);
      jest
        .spyOn(VehiculeFilter, 'applyFilterAndSort')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getEmissionComparison(filter);

      expect(result).toEqual({
        [VehiculeType.BEV]: 5, // 0 + 5
        [VehiculeType.ICE]: 380, // 180 + 200
      });
    });
  });

  describe('getFleetDistribution', () => {
    it('should calculate fleet distribution correctly', async () => {
      const filter = new VehiculeFilter();
      const mockVehicules = [
        mockBevVehicule,
        { ...mockBevVehicule, id: '3' },
        mockIceVehicule,
      ];

      mockQueryBuilder.getMany.mockResolvedValue(mockVehicules);
      jest
        .spyOn(VehiculeFilter, 'applyFilterAndSort')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getFleetDistribution(filter);

      expect(result).toEqual({
        [VehiculeType.BEV]: 2,
        [VehiculeType.ICE]: 1,
      });
    });
  });

  describe('getFleetAvailabilityRate', () => {
    it('should calculate availability rate correctly', async () => {
      const filter = new VehiculeFilter();
      const availableVehicules = [mockBevVehicule];
      const allVehicules = [mockBevVehicule, mockIceVehicule];

      mockQueryBuilder.getMany
        .mockResolvedValueOnce(availableVehicules)
        .mockResolvedValueOnce(allVehicules);

      jest
        .spyOn(VehiculeFilter, 'applyFilterAndSort')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getFleetAvailabilityRate(filter);

      expect(result).toBe(50); // 1/2 * 100
    });

    it('should return 0 when no available vehicules', async () => {
      const filter = new VehiculeFilter();

      mockQueryBuilder.getMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([mockIceVehicule]);

      jest
        .spyOn(VehiculeFilter, 'applyFilterAndSort')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getFleetAvailabilityRate(filter);

      expect(result).toBe(0);
    });
  });

  describe('getChargingVehicules', () => {
    it('should return vehicules with charging status', async () => {
      const filter = new VehiculeFilter();
      const chargingVehicule = { ...mockBevVehicule, status: Status.charging };

      mockQueryBuilder.getMany.mockResolvedValue([chargingVehicule]);
      jest
        .spyOn(VehiculeFilter, 'applyFilterAndSort')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getChargingVehicules(filter);

      expect(result).toEqual([chargingVehicule]);
      expect(filter.status).toBe(Status.charging);
    });
  });

  describe('getInUseVehicules', () => {
    it('should return vehicules with in_use status', async () => {
      const filter = new VehiculeFilter();
      const inUseVehicule = { ...mockBevVehicule, status: Status.in_use };

      mockQueryBuilder.getMany.mockResolvedValue([inUseVehicule]);
      jest
        .spyOn(VehiculeFilter, 'applyFilterAndSort')
        .mockReturnValue(mockQueryBuilder as any);

      const result = await service.getInUseVehicules(filter);

      expect(result).toEqual([inUseVehicule]);
      expect(filter.status).toBe(Status.in_use);
    });
  });
});
