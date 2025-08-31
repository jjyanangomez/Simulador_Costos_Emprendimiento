import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CostosVariablesService } from '../services/costos-variables.service';
import { CreateCostoVariableDto } from '../models/dto/create-costo-variable.dto';
import { UpdateCostoVariableDto } from '../models/dto/update-costo-variable.dto';

@ApiTags('costos-variables')
@Controller('costos-variables')
export class CostosVariablesController {
  constructor(private readonly costosVariablesService: CostosVariablesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo costo variable' })
  @ApiBody({ type: CreateCostoVariableDto, description: 'Datos para crear un costo variable' })
  @ApiResponse({ status: 201, description: 'Costo variable creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() createCostoVariableDto: CreateCostoVariableDto) {
    try {
      const result = await this.costosVariablesService.create(createCostoVariableDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al crear costo variable:', error);
      throw new HttpException(
        `Error al crear el costo variable: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los costos variables de un negocio' })
  @ApiQuery({ name: 'negocioId', description: 'ID del negocio', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de costos variables obtenida' })
  async findAll(@Query('negocioId', ParseIntPipe) negocioId: number) {
    try {
      const result = await this.costosVariablesService.findByNegocioId(negocioId);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener costos variables:', error);
      throw new HttpException(
        'Error al obtener los costos variables',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('total')
  @ApiOperation({ summary: 'Obtener el total de costos variables de un negocio' })
  @ApiQuery({ name: 'negocioId', description: 'ID del negocio', type: Number })
  @ApiResponse({ status: 200, description: 'Total de costos variables obtenido' })
  async getTotal(@Query('negocioId', ParseIntPipe) negocioId: number) {
    try {
      const result = await this.costosVariablesService.getTotalByNegocioId(negocioId);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener total de costos variables:', error);
      throw new HttpException(
        'Error al obtener el total de costos variables',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un costo variable por ID' })
  @ApiParam({ name: 'id', description: 'ID del costo variable', type: Number })
  @ApiResponse({ status: 200, description: 'Costo variable encontrado' })
  @ApiResponse({ status: 404, description: 'Costo variable no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const costoVariable = await this.costosVariablesService.findById(id);
      if (!costoVariable) {
        throw new HttpException('Costo variable no encontrado', HttpStatus.NOT_FOUND);
      }
      return costoVariable;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al buscar costo variable con ID ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el costo variable',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un costo variable' })
  @ApiParam({ name: 'id', description: 'ID del costo variable', type: Number })
  @ApiBody({ type: UpdateCostoVariableDto, description: 'Datos para actualizar el costo variable' })
  @ApiResponse({ status: 200, description: 'Costo variable actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Costo variable no encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCostoVariableDto: UpdateCostoVariableDto,
  ) {
    try {
      const result = await this.costosVariablesService.update(id, updateCostoVariableDto);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al actualizar costo variable con ID ${id}:`, error);
      if (error.message === 'Costo variable no encontrado') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Error al actualizar el costo variable: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un costo variable' })
  @ApiParam({ name: 'id', description: 'ID del costo variable', type: Number })
  @ApiResponse({ status: 200, description: 'Costo variable eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Costo variable no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.costosVariablesService.remove(id);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al eliminar costo variable con ID ${id}:`, error);
      if (error.message === 'Costo variable no encontrado') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Error al eliminar el costo variable: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
