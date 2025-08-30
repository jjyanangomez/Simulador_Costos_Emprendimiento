import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AnalisisService } from '../services/analisis.service';
import { AnalisisRentabilidadDto } from '../models/dto/analisis-rentabilidad.dto';
import { AnalisisPrecioVentaDto } from '../models/dto/analisis-precio-venta.dto';

@ApiTags('analisis')
@Controller('analisis')
export class AnalisisController {
  constructor(private readonly analisisService: AnalisisService) {}

  @Post('rentabilidad')
  @ApiOperation({ summary: 'Realizar análisis de rentabilidad completo' })
  @ApiBody({ type: AnalisisRentabilidadDto, description: 'Datos para el análisis de rentabilidad' })
  @ApiResponse({ status: 201, description: 'Análisis de rentabilidad completado' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async analisisRentabilidad(@Body() analisisDto: AnalisisRentabilidadDto) {
    try {
      const result = await this.analisisService.analizarRentabilidad(analisisDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al realizar análisis de rentabilidad:', error);
      throw new HttpException(
        `Error al realizar el análisis: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('precio-venta')
  @ApiOperation({ summary: 'Analizar y validar precios de venta' })
  @ApiBody({ type: AnalisisPrecioVentaDto, description: 'Datos para el análisis de precios' })
  @ApiResponse({ status: 201, description: 'Análisis de precios completado' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async analisisPrecioVenta(@Body() precioDto: AnalisisPrecioVentaDto) {
    try {
      const result = await this.analisisService.analizarPrecioVenta(precioDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al analizar precio de venta:', error);
      throw new HttpException(
        `Error al analizar el precio: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('punto-equilibrio')
  @ApiOperation({ summary: 'Calcular punto de equilibrio del negocio' })
  @ApiBody({ type: AnalisisRentabilidadDto, description: 'Datos para calcular punto de equilibrio' })
  @ApiResponse({ status: 201, description: 'Punto de equilibrio calculado' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async calcularPuntoEquilibrio(@Body() analisisDto: AnalisisRentabilidadDto) {
    try {
      const result = await this.analisisService.calcularPuntoEquilibrio(analisisDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al calcular punto de equilibrio:', error);
      throw new HttpException(
        `Error al calcular el punto de equilibrio: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('resultados/:negocioId')
  @ApiOperation({ summary: 'Obtener resultados de análisis de un negocio' })
  @ApiParam({ name: 'negocioId', description: 'ID del negocio', type: Number })
  @ApiQuery({ name: 'tipo', description: 'Tipo de análisis', required: false, enum: ['rentabilidad', 'precio-venta', 'punto-equilibrio'] })
  @ApiResponse({ status: 200, description: 'Resultados del análisis obtenidos' })
  async obtenerResultados(
    @Param('negocioId', ParseIntPipe) negocioId: number,
    @Query('tipo') tipo?: string,
  ) {
    try {
      const result = await this.analisisService.obtenerResultados(negocioId, tipo);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al obtener resultados para negocio ${negocioId}:`, error);
      throw new HttpException(
        'Error al obtener los resultados del análisis',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('validacion-costos/:negocioId')
  @ApiOperation({ summary: 'Validar costos con IA' })
  @ApiParam({ name: 'negocioId', description: 'ID del negocio', type: Number })
  @ApiResponse({ status: 200, description: 'Validación de costos completada' })
  async validarCostos(@Param('negocioId', ParseIntPipe) negocioId: number): Promise<any> {
    try {
      const result = await this.analisisService.validarCostosConIA(negocioId);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al validar costos para negocio ${negocioId}:`, error);
      throw new HttpException(
        'Error al validar los costos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('recomendaciones/:negocioId')
  @ApiOperation({ summary: 'Obtener recomendaciones de IA para el negocio' })
  @ApiParam({ name: 'negocioId', description: 'ID del negocio', type: Number })
  @ApiResponse({ status: 200, description: 'Recomendaciones obtenidas' })
  async obtenerRecomendaciones(@Param('negocioId', ParseIntPipe) negocioId: number): Promise<any> {
    try {
      const result = await this.analisisService.obtenerRecomendacionesIA(negocioId);
      return result;
    } catch (error) {
      console.error(`💥 [BACKEND] Error al obtener recomendaciones para negocio ${negocioId}:`, error);
      throw new HttpException(
        'Error al obtener las recomendaciones',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('simulacion-escenarios')
  @ApiOperation({ summary: 'Simular diferentes escenarios de negocio' })
  @ApiBody({ type: AnalisisRentabilidadDto, description: 'Datos base para la simulación' })
  @ApiResponse({ status: 201, description: 'Simulación de escenarios completada' })
  async simularEscenarios(@Body() analisisDto: AnalisisRentabilidadDto) {
    try {
      const result = await this.analisisService.simularEscenarios(analisisDto);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al simular escenarios:', error);
      throw new HttpException(
        `Error al simular escenarios: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
