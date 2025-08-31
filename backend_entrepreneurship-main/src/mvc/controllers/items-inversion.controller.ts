import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ItemsInversionService } from '../services/items-inversion.service';
import { CreateItemInversionDto, UpdateItemInversionDto } from '../models/dto';

@Controller('items-inversion')
export class ItemsInversionController {
  constructor(private readonly itemsInversionService: ItemsInversionService) {}

  @Post()
  async create(@Body() createDto: CreateItemInversionDto) {
    return this.itemsInversionService.create(createDto);
  }

  @Get()
  async findAll(@Query('negocio_id') negocioId?: string) {
    if (negocioId) {
      return this.itemsInversionService.findByNegocioId(parseInt(negocioId));
    }
    return this.itemsInversionService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.itemsInversionService.findOne(parseInt(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateItemInversionDto) {
    return this.itemsInversionService.update(parseInt(id), updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.itemsInversionService.remove(parseInt(id));
  }

  @Get('negocio/:negocioId/total')
  async getTotalInversion(@Param('negocioId') negocioId: string) {
    return this.itemsInversionService.getTotalInversion(parseInt(negocioId));
  }
}
