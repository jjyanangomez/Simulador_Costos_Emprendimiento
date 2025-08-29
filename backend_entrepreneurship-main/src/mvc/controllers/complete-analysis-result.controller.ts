import { Controller, Get, Post, Body, Param, ParseIntPipe, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CompleteAnalysisResultService } from '../services/complete-analysis-result.service';
import { CreateCompleteAnalysisResultDto } from '../models/dto/create-complete-analysis-result.dto';
import { UpdateCompleteAnalysisResultDto } from '../models/dto/update-complete-analysis-result.dto';

@ApiTags('Complete Analysis Results')
@Controller('complete-analysis-results')
export class CompleteAnalysisResultController {
  constructor(private readonly service: CompleteAnalysisResultService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo resultado de análisis completo' })
  @ApiResponse({ status: 201, description: 'El resultado de análisis completo fue creado exitosamente.' })
  create(@Body() createDto: CreateCompleteAnalysisResultDto) {
    return this.service.create(createDto);
  }

  @Post('save-complete')
  @ApiOperation({ summary: 'Guardar análisis completo con todos los resultados' })
  @ApiResponse({ status: 201, description: 'Análisis completo guardado exitosamente.' })
  async saveCompleteAnalysis(@Body() saveDto: {
    negocioId: number;
    moduloId: number;
    analisisId: number;
    costosAnalizados: any[];
    riesgosDetectados: any[];
    planAccion: any[];
    resumenAnalisis?: any;
  }) {
    console.log('🔍 [COMPLETE-ANALYSIS-CONTROLLER] Guardando análisis completo');
    console.log('📊 [COMPLETE-ANALYSIS-CONTROLLER] Datos recibidos:', {
      negocioId: saveDto.negocioId,
      moduloId: saveDto.moduloId,
      analisisId: saveDto.analisisId,
      costosCount: saveDto.costosAnalizados?.length || 0,
      riesgosCount: saveDto.riesgosDetectados?.length || 0,
      planCount: saveDto.planAccion?.length || 0
    });

    try {
      const result = await this.service.saveCompleteAnalysis(
        saveDto.negocioId,
        saveDto.moduloId,
        saveDto.analisisId,
        saveDto.costosAnalizados,
        saveDto.riesgosDetectados,
        saveDto.planAccion,
        saveDto.resumenAnalisis
      );

      console.log('✅ [COMPLETE-ANALYSIS-CONTROLLER] Análisis guardado exitosamente');
      return {
        success: true,
        message: 'Análisis completo guardado exitosamente',
        data: result
      };
    } catch (error) {
      console.error('❌ [COMPLETE-ANALYSIS-CONTROLLER] Error al guardar:', error);
      throw error;
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  health() {
    return { 
      status: 'OK', 
      message: 'Complete analysis results service is running', 
      timestamp: new Date().toISOString() 
    };
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los resultados de análisis completos' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un resultado de análisis completo por su ID' })
  @ApiParam({ name: 'id', description: 'El ID único del resultado de análisis completo' })
  @ApiResponse({ status: 404, description: 'Resultado de análisis completo no encontrado.' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Get('negocio/:negocioId/modulo/:moduloId')
  @ApiOperation({ summary: 'Obtener resultado de análisis completo por negocio y módulo' })
  @ApiParam({ name: 'negocioId', description: 'ID del negocio' })
  @ApiParam({ name: 'moduloId', description: 'ID del módulo' })
  async findByNegocioAndModulo(
    @Param('negocioId', ParseIntPipe) negocioId: number,
    @Param('moduloId', ParseIntPipe) moduloId: number
  ) {
    console.log(`🔍 [COMPLETE-ANALYSIS-CONTROLLER] Buscando resultado para negocio ${negocioId} y módulo ${moduloId}`);
    
    const result = await this.service.findByNegocioAndModulo(negocioId, moduloId);
    
    if (!result) {
      return {
        success: false,
        message: 'No se encontró resultado de análisis para este negocio y módulo',
        data: null
      };
    }

    return {
      success: true,
      message: 'Resultado de análisis encontrado',
      data: result
    };
  }

  @Get('analisis/:analisisId')
  @ApiOperation({ summary: 'Obtener todos los resultados de análisis completos para un análisis de IA específico' })
  @ApiParam({ name: 'analisisId', description: 'El ID del análisis de IA' })
  findByAnalisisId(@Param('analisisId', ParseIntPipe) analisisId: number) {
    return this.service.findByAnalisisId(analisisId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un resultado de análisis completo por su ID' })
  @ApiParam({ name: 'id', description: 'El ID del resultado de análisis completo a actualizar' })
  @ApiResponse({ status: 404, description: 'Resultado de análisis completo no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: UpdateCompleteAnalysisResultDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un resultado de análisis completo por su ID' })
  @ApiParam({ name: 'id', description: 'El ID del resultado de análisis completo a eliminar' })
  @ApiResponse({ status: 204, description: 'El resultado de análisis completo fue eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Resultado de análisis completo no encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }
}
