import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Vehicule } from '@fleet-management/domain/vehicule.entity';
import { Status } from '@fleet-management/domain/types/status.enum';
import { VehiculeType } from '@fleet-management/domain/types/vehicule-type.enum';

@Entity({ name: 'vehicule' })
export class VehiculeModel extends Vehicule {
  @PrimaryGeneratedColumn('uuid')
  declare id: string;

  @Column()
  declare brand: string;

  @Column()
  declare model: string;

  @Column({ type: 'integer' })
  declare batteryCapacity: number;

  @Column({ type: 'float' })
  declare currentChargeLevel: number;

  @Column({ type: 'enum', enum: Status })
  declare status: Status;

  @Column({ type: 'timestamp' })
  declare lastUpdated: Date;

  @Column({ type: 'float' })
  declare averageEnergyConsumption: number;

  @Column({ type: 'enum', enum: VehiculeType })
  declare type: VehiculeType;

  @Column({ type: 'float' })
  declare emissionGco2Km: number;
}
