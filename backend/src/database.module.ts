import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiculeModel } from '@fleet-management/infrastructure/type-orm/vehicule.model';
import { VersionEntity } from './version.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'beev',
      synchronize: true,
      autoLoadEntities: true,
      entities: [VehiculeModel, VersionEntity],
    }),
    TypeOrmModule.forFeature([VersionEntity]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
