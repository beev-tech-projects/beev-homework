import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculeModel } from '@fleet-management/infrastructure/type-orm/vehicule.model';
import { AnalyticsService } from '@analytics/analytics.service';
import { AnalyticsController } from '@analytics/analytics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([VehiculeModel])],
  providers: [AnalyticsService],
  exports: [],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
