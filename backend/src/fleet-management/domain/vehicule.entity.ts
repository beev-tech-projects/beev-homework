import { IsString, IsNumber, IsEnum, Min, IsDate } from 'class-validator';
import { Status } from '@fleet-management/domain/types/status.enum';
import { VehiculeType } from '@fleet-management/domain/types/vehicule-type.enum';

export class Vehicule {
  @IsString()
  id: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(0)
  batteryCapacity: number;

  @IsNumber()
  @Min(0)
  currentChargeLevel: number;

  @IsEnum(Status)
  status: Status;

  @IsDate()
  lastUpdated: Date;

  @IsNumber()
  @Min(0)
  averageEnergyConsumption: number;

  @IsEnum(VehiculeType)
  type: VehiculeType;

  @IsNumber()
  @Min(0)
  emissionGco2Km: number;
}
