import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
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
    @Query('filter') filter: string,
    @Query('sort') sort: VehiculeSorter,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ): Promise<{ vehicules: Vehicule[]; total: number }> {
    const parsedFilter = filter
      ? (JSON.parse(filter) as Partial<VehiculeFilter>)
      : undefined;
    return this.vehiculeService.getFilteredVehicules(
      new VehiculeFilter(parsedFilter),
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
  async getVehiculeById(@Param('id') id: string): Promise<Vehicule | null> {
    return this.vehiculeService.getVehiculeById(id);
  }

  @Put(':id')
  async updateVehicule(
    @Param('id') id: string,
    @Body() vehiculeData: Vehicule,
  ): Promise<Vehicule> {
    const vehicule = { ...vehiculeData, id };
    return this.vehiculeService.updateVehicule(vehicule);
  }

  @Delete(':id')
  async deleteVehicule(@Param('id') id: string): Promise<void> {
    return this.vehiculeService.deleteVehicule(id);
  }
}
