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
import { CostosFijosService } from '../services/costos-fijos.service';
import { CreateCostoFijoDto } from '../models/dto/create-costo-fijo.dto';
import { UpdateCostoFijoDto } from '../models/dto/update-costo-fijo.dto';

@ApiTags('costos-fijos')
@Controller('costos-fijos')
export class CostosFijosController {
  constructor(private readonly costosFijosService: CostosFijosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo costo fijo' })
  @ApiBody({ type: CreateCostoFijoDto, description: 'Datos para crear un costo fijo' })
  @ApiResponse({ status: 201, description: 'Costo fijo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() createCostoFijoDto: CreateCostoFijoDto) {
    try {
      const result = await this.costosFijosService.create(createCostoFijoDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al crear costo fijo:', error);
      throw new HttpException(
        `Error al crear el costo fijo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los costos fijos de un negocio' })
  @ApiQuery({ name: 'negocioId', description: 'ID del negocio', type: Number })
  @ApiResponse({ status: 200, description: 'Lista de costos fijos obtenida' })
  async findAll(@Query('negocioId', ParseIntPipe) negocioId: number) {
    try {
      const result = await this.costosFijosService.findByNegocioId(negocioId);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener costos fijos:', error);
      throw new HttpException(
        'Error al obtener los costos fijos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('total')
  @ApiOperation({ summary: 'Obtener el total de costos fijos de un negocio' })
  @ApiQuery({ name: 'negocioId', description: 'ID del negocio', type: Number })
  @ApiResponse({ status: 200, description: 'Total de costos fijos obtenido' })
  async getTotal(@Query('negocioId', ParseIntPipe) negocioId: number) {
    try {
      const result = await this.costosFijosService.getTotalByNegocioId(negocioId);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener total de costos fijos:', error);
      throw new HttpException(
        'Error al obtener el total de costos fijos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un costo fijo por ID' })
  @ApiParam({ name: 'id', description: 'ID del costo fijo', type: Number })
  @ApiResponse({ status: 200, description: 'Costo fijo encontrado' })
  @ApiResponse({ status: 404, description: 'Costo fijo no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const costoFijo = await this.costosFijosService.findById(id);
      if (!costoFijo) {
        throw new HttpException('Costo fijo no encontrado', HttpStatus.NOT_FOUND);
      }
      return costoFijo;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al buscar costo fijo con ID ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error al obtener el costo fijo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un costo fijo' })
  @ApiParam({ name: 'id', description: 'ID del costo fijo', type: Number })
  @ApiBody({ type: UpdateCostoFijoDto, description: 'Datos para actualizar el costo fijo' })
  @ApiResponse({ status: 200, description: 'Costo fijo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Costo fijo no encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCostoFijoDto: UpdateCostoFijoDto,
  ) {
    try {
      const result = await this.costosFijosService.update(id, updateCostoFijoDto);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al actualizar costo fijo con ID ${id}:`, error);
      if (error.message === 'Costo fijo no encontrado') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Error al actualizar el costo fijo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un costo fijo' })
  @ApiParam({ name: 'id', description: 'ID del costo fijo', type: Number })
  @ApiResponse({ status: 200, description: 'Costo fijo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Costo fijo no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.costosFijosService.remove(id);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al eliminar costo fijo con ID ${id}:`, error);
      if (error.message === 'Costo fijo no encontrado') {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        `Error al eliminar el costo fijo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('tipos/lista')
  @ApiOperation({ summary: 'Obtener lista de tipos de costo' })
  @ApiResponse({ status: 200, description: 'Lista de tipos de costo obtenida' })
  async getTiposCosto() {
    try {
      const result = await this.costosFijosService.getTiposCosto();
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener tipos de costo:', error);
      throw new HttpException(
        'Error al obtener los tipos de costo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
