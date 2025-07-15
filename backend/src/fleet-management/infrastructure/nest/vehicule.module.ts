import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculeApplicationService } from '@fleet-management/application/vehicule.service';
import { VehiculeController } from '@fleet-management/infrastructure/nest/vehicule.controller';
import { VehiculeModel } from '@fleet-management/infrastructure/type-orm/vehicule.model';

@Module({
  imports: [TypeOrmModule.forFeature([VehiculeModel])],
  exports: [],
  providers: [VehiculeApplicationService],
  controllers: [VehiculeController],
})
export class VehiculeModule {}
