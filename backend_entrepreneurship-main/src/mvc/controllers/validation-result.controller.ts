import { Controller, Post, Get, Body, Param, ParseIntPipe, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ValidationResultService } from '../services/validation-result.service';
import { SaveValidationResultDto } from '../models/dto/save-validation-result.dto';

@ApiTags('Validation Results')
@Controller('validation-results')
export class ValidationResultController {
  private readonly logger = new Logger(ValidationResultController.name);

  constructor(private readonly validationResultService: ValidationResultService) {}

  @Post()
  @ApiOperation({ summary: 'Guardar resultado de validación de costos' })
  @ApiResponse({ status: 201, description: 'Resultado de validación guardado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async saveValidationResult(@Body() saveDto: SaveValidationResultDto) {
    try {
      this.logger.log(`Recibida petición para guardar validación: negocio ${saveDto.negocioId}, módulo ${saveDto.moduloId}`);

      const result = await this.validationResultService.saveValidationResult(saveDto);
      
      this.logger.log(`Validación guardada exitosamente con ID: ${result.validacionId}`);

      return {
        success: true,
        message: 'Resultado de validación guardado exitosamente',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error guardando validación: ${error.message}`, error.stack);
      
      throw new HttpException(
        {
          success: false,
          message: 'Error al guardar resultado de validación',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('business/:negocioId/module/:moduloId')
  @ApiOperation({ summary: 'Obtener resultado de validación por negocio y módulo' })
  @ApiParam({ name: 'negocioId', description: 'ID del negocio' })
  @ApiParam({ name: 'moduloId', description: 'ID del módulo' })
  @ApiResponse({ status: 200, description: 'Resultado de validación encontrado.' })
  @ApiResponse({ status: 404, description: 'No se encontró validación.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getValidationResultByBusinessAndModule(
    @Param('negocioId', ParseIntPipe) negocioId: number,
    @Param('moduloId', ParseIntPipe) moduloId: number,
  ) {
    try {
      this.logger.log(`Buscando validación para negocio ${negocioId}, módulo ${moduloId}`);

      const result = await this.validationResultService.getValidationResultByBusinessAndModule(negocioId, moduloId);
      
      if (!result) {
        this.logger.log(`No se encontró validación para negocio ${negocioId}, módulo ${moduloId}`);
        
        return {
          success: false,
          message: 'No se encontró validación para el negocio y módulo especificados',
          data: null,
          timestamp: new Date().toISOString(),
        };
      }

      this.logger.log(`Validación encontrada con ID: ${result.validacionId}`);

      return {
        success: true,
        message: 'Validación encontrada exitosamente',
        data: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error obteniendo validación: ${error.message}`, error.stack);
      
      throw new HttpException(
        {
          success: false,
          message: 'Error al obtener validación',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('business/:negocioId')
  @ApiOperation({ summary: 'Obtener todos los resultados de validación de un negocio' })
  @ApiParam({ name: 'negocioId', description: 'ID del negocio' })
  @ApiResponse({ status: 200, description: 'Resultados de validación encontrados.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getValidationResultsByBusiness(@Param('negocioId', ParseIntPipe) negocioId: number) {
    try {
      this.logger.log(`Buscando todas las validaciones para negocio ${negocioId}`);

      const results = await this.validationResultService.getValidationResultsByBusiness(negocioId);
      
      this.logger.log(`Se encontraron ${results.length} validaciones para negocio ${negocioId}`);
      
      return {
        success: true,
        message: `Se encontraron ${results.length} validaciones`,
        data: results,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error obteniendo validaciones: ${error.message}`, error.stack);
      
      throw new HttpException(
        {
          success: false,
          message: 'Error al obtener validaciones',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
