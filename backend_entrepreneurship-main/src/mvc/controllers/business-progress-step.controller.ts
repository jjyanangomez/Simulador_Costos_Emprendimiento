import { Controller, Put, Get, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BusinessProgressStepService } from '../services/business-progress-step.service';

@ApiTags('business-progress')
@Controller('business-progress')
export class BusinessProgressStepController {
  constructor(
    private readonly businessProgressStepService: BusinessProgressStepService,
  ) {}

  @Put(':negocioId/module/:moduloId/complete')
  @ApiOperation({ summary: 'Marcar módulo como completado' })
  @ApiParam({ name: 'negocioId', description: 'ID del negocio' })
  @ApiParam({ name: 'moduloId', description: 'ID del módulo' })
  @ApiResponse({ status: 200, description: 'Módulo marcado como completado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Progreso no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async completeModule(
    @Param('negocioId') negocioId: string,
    @Param('moduloId') moduloId: string,
  ) {
    try {
      const result = await this.businessProgressStepService.completeModule(
        parseInt(negocioId),
        parseInt(moduloId),
      );
      
      return {
        success: true,
        message: 'Módulo marcado como completado exitosamente',
        data: result,
      };
    } catch (error) {
      console.error('💥 [BACKEND] Error al marcar módulo como completado:', error);
      throw new HttpException(
        error.message || 'Error al marcar módulo como completado',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':negocioId/module/:moduloId')
  @ApiOperation({ summary: 'Obtener progreso de un módulo específico' })
  @ApiParam({ name: 'negocioId', description: 'ID del negocio' })
  @ApiParam({ name: 'moduloId', description: 'ID del módulo' })
  @ApiResponse({ status: 200, description: 'Progreso del módulo obtenido exitosamente.' })
  @ApiResponse({ status: 404, description: 'Progreso no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getProgress(
    @Param('negocioId') negocioId: string,
    @Param('moduloId') moduloId: string,
  ) {
    try {
      console.log('🔍 [BACKEND] Obteniendo progreso del módulo:', { negocioId, moduloId });
      
      const result = await this.businessProgressStepService.getProgress(
        parseInt(negocioId),
        parseInt(moduloId),
      );
      
      if (!result) {
        throw new HttpException(
          'Progreso del módulo no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }
      
      console.log('✅ [BACKEND] Progreso del módulo obtenido:', result);
      
      return result;
    } catch (error) {
      console.error('💥 [BACKEND] Error al obtener progreso del módulo:', error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        error.message || 'Error al obtener progreso del módulo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
