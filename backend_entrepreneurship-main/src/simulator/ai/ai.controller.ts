import { Controller, Post, Body, Get, Param, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { IsArray, IsObject, IsString, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { AiService } from './ai.service';
import { ValidationService } from './validation.service';
import { AnalysisService } from './analysis.service';

// DTOs para las peticiones
class CostDto {
  @IsString()
  name: string;

  @IsString()
  amount: string;
}

class BusinessInfoDto {
  @IsString()
  tipoNegocio: string;

  @IsString()
  tamano: string;

  @IsString()
  ubicacion: string;
}

export class ValidateCostsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CostDto)
  costs: CostDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => BusinessInfoDto)
  businessInfo: BusinessInfoDto;
}

export class AnalyzeCostsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CostDto)
  costs: CostDto[];

  @IsObject()
  @ValidateNested()
  @Type(() => BusinessInfoDto)
  businessInfo: BusinessInfoDto;

  @IsOptional()
  validationResult: any; // Resultado de la validación previa
}

@ApiTags('ai')
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly validationService: ValidationService,
    private readonly analysisService: AnalysisService,
  ) {}

  @Post('validate-costs')
  @ApiOperation({ summary: 'Validar costos básicos (rápido)' })
  @ApiBody({ type: ValidateCostsDto })
  @ApiResponse({ status: 200, description: 'Validación completada.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async validateCosts(@Body() validateCostsDto: ValidateCostsDto) {
    try {
      console.log('🔍 [BACKEND-AI] Iniciando validación rápida de costos...');
      console.log('📥 [BACKEND-AI] Datos recibidos:', JSON.stringify(validateCostsDto, null, 2));
      
      const result = await this.validationService.validateCosts(
        validateCostsDto.costs,
        validateCostsDto.businessInfo
      );
      
      console.log('✅ [BACKEND-AI] Validación completada:', result);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND-AI] Error en validación:', error);
      throw new HttpException(
        'Error al validar los costos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('analyze-costs')
  @ApiOperation({ summary: 'Análisis detallado de costos (solo si pasa validación)' })
  @ApiBody({ type: AnalyzeCostsDto })
  @ApiResponse({ status: 200, description: 'Análisis completado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async analyzeCosts(@Body() analyzeCostsDto: AnalyzeCostsDto) {
    try {
      console.log('📊 [BACKEND-AI] Iniciando análisis detallado de costos...');
      
      const result = await this.analysisService.analyzeCosts(
        analyzeCostsDto.costs,
        analyzeCostsDto.businessInfo,
        analyzeCostsDto.validationResult
      );
      
      console.log('✅ [BACKEND-AI] Análisis completado:', result);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND-AI] Error en análisis:', error);
      throw new HttpException(
        'Error al analizar los costos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('final-analysis')
  @ApiOperation({ summary: 'Análisis final con recomendaciones' })
  @ApiBody({ type: AnalyzeCostsDto })
  @ApiResponse({ status: 200, description: 'Análisis final completado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async finalAnalysis(@Body() analyzeCostsDto: AnalyzeCostsDto) {
    try {
      console.log('🎯 [BACKEND-AI] Iniciando análisis final...');
      
      const result = await this.analysisService.finalAnalysis(
        analyzeCostsDto.costs,
        analyzeCostsDto.businessInfo,
        analyzeCostsDto.validationResult
      );
      
      console.log('✅ [BACKEND-AI] Análisis final completado:', result);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND-AI] Error en análisis final:', error);
      throw new HttpException(
        'Error al realizar el análisis final',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('save-complete-results')
  @ApiOperation({ summary: 'Guardar todos los resultados de análisis en la base de datos' })
  @ApiResponse({ status: 201, description: 'Resultados guardados exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async saveCompleteResults(@Body() saveDto: {
    negocioId: number;
    moduloId: number;
    analisisId: number;
    costosAnalizados: any[];
    riesgosDetectados: any[];
    planAccion: any[];
    resumenAnalisis?: any;
  }) {
    try {
      console.log('💾 [BACKEND-AI] Guardando resultados completos...');
      
      const result = await this.analysisService.saveCompleteAnalysisResults(
        saveDto.negocioId,
        saveDto.moduloId,
        saveDto.analisisId,
        saveDto.costosAnalizados,
        saveDto.riesgosDetectados,
        saveDto.planAccion,
        saveDto.resumenAnalisis
      );
      
      console.log('✅ [BACKEND-AI] Resultados guardados exitosamente');
      return result;
    } catch (error) {
      console.error('💥 [BACKEND-AI] Error al guardar resultados:', error);
      throw new HttpException(
        'Error al guardar los resultados',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get-complete-results/:negocioId/:moduloId')
  @ApiOperation({ summary: 'Obtener resultados completos de análisis guardados' })
  @ApiParam({ name: 'negocioId', description: 'ID del negocio' })
  @ApiParam({ name: 'moduloId', description: 'ID del módulo' })
  @ApiResponse({ status: 200, description: 'Resultados obtenidos exitosamente.' })
  @ApiResponse({ status: 404, description: 'Resultados no encontrados.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getCompleteResults(
    @Param('negocioId', ParseIntPipe) negocioId: number,
    @Param('moduloId', ParseIntPipe) moduloId: number
  ) {
    try {
      console.log(`🔍 [BACKEND-AI] Obteniendo resultados para negocio ${negocioId} y módulo ${moduloId}`);
      
      const result = await this.analysisService.getCompleteAnalysisResults(negocioId, moduloId);
      
      console.log('✅ [BACKEND-AI] Resultados obtenidos exitosamente');
      return result;
    } catch (error) {
      console.error('💥 [BACKEND-AI] Error al obtener resultados:', error);
      throw new HttpException(
        'Error al obtener los resultados',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('analyze-business-setup')
  @ApiOperation({ summary: 'Análisis completo de configuración de negocio con IA' })
  @ApiResponse({ status: 200, description: 'Análisis de negocio completado.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async analyzeBusinessSetup(@Body() businessSetupDto: {
    businessName: string;
    businessCategory: string;
    sector: string;
    exactLocation?: string;
    businessSize: string;
    capacity: number;
    financingType: 'personal' | 'prestamo' | 'mixto';
    investmentItems: Array<{ description: string; amount: number; quantity?: number }>;
    ownCapital: number;
    loanCapital?: number;
    interestRate?: number;
  }) {
    try {
      console.log('🏢 [BACKEND-AI] Iniciando análisis de configuración de negocio...');
      console.log('📥 [BACKEND-AI] Datos recibidos:', JSON.stringify(businessSetupDto, null, 2));
      
      const result = await this.analysisService.analyzeBusinessSetup(businessSetupDto);
      
      console.log('✅ [BACKEND-AI] Análisis de negocio completado:', result);
      return result;
    } catch (error) {
      console.error('💥 [BACKEND-AI] Error en análisis de negocio:', error);
      throw new HttpException(
        'Error al analizar la configuración del negocio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}