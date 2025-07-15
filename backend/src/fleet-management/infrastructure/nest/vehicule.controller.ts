import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { VehiculeApplicationService } from '@fleet-management/application/vehicule.service';
import { Vehicule } from '@fleet-management/domain/vehicule.entity';
import { VehiculeFilter } from '@fleet-management/domain/value-objects/vehicule-filter.value-object';
import { VehiculeSorter } from '@fleet-management/domain/value-objects/vehicule-sorter.value-object';

@Controller('vehicules')
export class VehiculeController {
  constructor(
    @Inject()
    private readonly vehiculeService: VehiculeApplicationService,
  ) {}

  @Get()
  async getVehicules(
    @Query('filter') filter: VehiculeFilter,
    @Query('sort') sort: VehiculeSorter,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<{ vehicules: Vehicule[]; total: number }> {
    return this.vehiculeService.getFilteredVehicules(
      filter,
      sort,
      page,
      pageSize,
    );
  }

  @Post()
  async createVehicule(
    @Body() vehiculeData: Omit<Vehicule, 'id'>,
  ): Promise<Vehicule> {
    return this.vehiculeService.createVehicule(vehiculeData);
  }

  @Get(':id')
  async getVehiculeById(@Query('id') id: string): Promise<Vehicule | null> {
    return this.vehiculeService.getVehiculeById(id);
  }

  @Put(':id')
  async updateVehicule(
    @Query('id') id: string,
    @Body() vehiculeData: Vehicule,
  ): Promise<Vehicule> {
    const vehicule = { ...vehiculeData, id };
    return this.vehiculeService.updateVehicule(vehicule);
  }

  @Delete(':id')
  async deleteVehicule(@Query('id') id: string): Promise<void> {
    return this.vehiculeService.deleteVehicule(id);
  }
}
