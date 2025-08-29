// src/infrastructure/controllers/negocio.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Delete,
  HttpCode,
  Put,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('negocios') // Agrupa los endpoints bajo la etiqueta "negocios"
@Controller('negocios')
export class BusinessController {
  constructor(private readonly negocioService: BusinessService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo negocio' })
  @ApiBody({ type: CreateBusinessDto, description: 'Datos para la creación de un nuevo negocio' })
  @ApiResponse({ status: 201, description: 'El negocio ha sido creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async create(@Body() createNegocioDto: CreateBusinessDto) {
    try {
      return await this.negocioService.createBuisness(createNegocioDto);
    } catch (error) {
      console.log(error.stack);
      throw new HttpException(
        'Error al crear el negocio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener una lista de todos los negocios' })
  @ApiResponse({ status: 200, description: 'Lista de negocios obtenida con éxito.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findAll() {
    try {
      return await this.negocioService.findAllBuisness();
    } catch (error) {
      throw new HttpException(
        'Error al obtener la lista de negocios',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un negocio por su ID' })
  @ApiParam({ name: 'id', description: 'El ID del negocio a buscar', type: Number })
  @ApiResponse({ status: 200, description: 'Negocio encontrado.' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const negocio = await this.negocioService.findById(id);
      if (!negocio) {
        throw new HttpException('Negocio no encontrado', HttpStatus.NOT_FOUND);
      }
      return negocio;
    } catch (error) {
      console.log(`Fallo al buscar el negocio con id ${id}`, error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el negocio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
 @Get('usuario/:usuarioId')
  @ApiOperation({ summary: 'Obtener todos los negocios de un usuario específico' })
  @ApiParam({ name: 'usuarioId', description: 'ID del usuario propietario de los negocios', example: 5 })
  @ApiResponse({ status: 200, description: 'Lista de negocios del usuario.' })
  async findByUsuario(@Param('usuarioId', ParseIntPipe) usuarioId: number) {
    return this.negocioService.findBuisnessByIdUser(usuarioId);
  }
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un negocio existente' })
  @ApiParam({ name: 'id', description: 'El ID del negocio a actualizar', type: Number })
  @ApiBody({ type: UpdateBusinessDto, description: 'Datos para actualizar el negocio' })
  @ApiResponse({ status: 200, description: 'El negocio ha sido actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNegocioDto: UpdateBusinessDto,
  ) {
    try {
      return await this.negocioService.updateBuisness(id, updateNegocioDto);
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al actualizar el negocio', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un negocio por su ID' })
  @ApiParam({ name: 'id', description: 'El ID del negocio a eliminar', type: Number })
  @ApiResponse({ status: 204, description: 'El negocio ha sido eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.negocioService.deleteBuisness(id);
    } catch (error) {
      if (error) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Error al eliminar el negocio', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}