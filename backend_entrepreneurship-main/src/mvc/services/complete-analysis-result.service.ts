import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CompleteAnalysisResult } from '../models/entities/complete-analysis-result.entity';
import { CompleteAnalysisResultMapper } from '../models/mappers/complete-analysis-result.mapper';
import { CreateCompleteAnalysisResultDto } from '../models/dto/create-complete-analysis-result.dto';
import { UpdateCompleteAnalysisResultDto } from '../models/dto/update-complete-analysis-result.dto';

@Injectable()
export class CompleteAnalysisResultService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateCompleteAnalysisResultDto): Promise<CompleteAnalysisResult> {
    console.log('🔍 [COMPLETE-ANALYSIS-SERVICE] Creando resultado completo:', createDto);
    
    const prismaData = CompleteAnalysisResultMapper.toPrismaCreate(createDto);
    
    const result = await this.prisma.resultados_Analisis_Completo.create({
      data: prismaData,
    });

    console.log('✅ [COMPLETE-ANALYSIS-SERVICE] Resultado creado:', result);
    return CompleteAnalysisResultMapper.toEntity(result);
  }

  async findAll(): Promise<CompleteAnalysisResult[]> {
    const results = await this.prisma.resultados_Analisis_Completo.findMany({
      orderBy: { fecha_analisis: 'desc' },
    });
    
    return CompleteAnalysisResultMapper.toEntityList(results);
  }

  async findById(id: number): Promise<CompleteAnalysisResult> {
    const result = await this.prisma.resultados_Analisis_Completo.findUnique({
      where: { resultado_id: id },
    });

    if (!result) {
      throw new NotFoundException(`Resultado de análisis completo con ID ${id} no encontrado`);
    }

    return CompleteAnalysisResultMapper.toEntity(result);
  }

  async findByNegocioAndModulo(negocioId: number, moduloId: number): Promise<CompleteAnalysisResult | null> {
    console.log(`🔍 [COMPLETE-ANALYSIS-SERVICE] Buscando resultado para negocio ${negocioId} y módulo ${moduloId}`);
    
    const result = await this.prisma.resultados_Analisis_Completo.findFirst({
      where: {
        negocio_id: negocioId,
        modulo_id: moduloId,
      },
      orderBy: { fecha_analisis: 'desc' },
    });

    if (!result) {
      console.log('❌ [COMPLETE-ANALYSIS-SERVICE] No se encontró resultado');
      return null;
    }

    console.log('✅ [COMPLETE-ANALYSIS-SERVICE] Resultado encontrado');
    return CompleteAnalysisResultMapper.toEntity(result);
  }

  async findByAnalisisId(analisisId: number): Promise<CompleteAnalysisResult[]> {
    const results = await this.prisma.resultados_Analisis_Completo.findMany({
      where: { analisis_id: analisisId },
      orderBy: { fecha_analisis: 'desc' },
    });
    
    return CompleteAnalysisResultMapper.toEntityList(results);
  }

  async update(id: number, updateDto: UpdateCompleteAnalysisResultDto): Promise<CompleteAnalysisResult> {
    const prismaData = CompleteAnalysisResultMapper.toPrismaUpdate(updateDto);
    
    const result = await this.prisma.resultados_Analisis_Completo.update({
      where: { resultado_id: id },
      data: prismaData,
    });

    return CompleteAnalysisResultMapper.toEntity(result);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.resultados_Analisis_Completo.delete({
      where: { resultado_id: id },
    });
  }

  async saveCompleteAnalysis(
    negocioId: number,
    moduloId: number,
    analisisId: number,
    costosAnalizados: any[],
    riesgosDetectados: any[],
    planAccion: any[],
    resumenAnalisis?: any
  ): Promise<CompleteAnalysisResult> {
    console.log('💾 [COMPLETE-ANALYSIS-SERVICE] Guardando análisis completo');
    console.log('📊 [COMPLETE-ANALYSIS-SERVICE] Costos analizados:', costosAnalizados.length);
    console.log('⚠️ [COMPLETE-ANALYSIS-SERVICE] Riesgos detectados:', riesgosDetectados.length);
    console.log('📋 [COMPLETE-ANALYSIS-SERVICE] Plan de acción:', planAccion.length);

    // Verificar si ya existe un resultado para este negocio y módulo
    const existingResult = await this.findByNegocioAndModulo(negocioId, moduloId);
    
    if (existingResult) {
      console.log('🔄 [COMPLETE-ANALYSIS-SERVICE] Actualizando resultado existente');
      return this.update(existingResult.resultadoId, {
        analisisId,
        costosAnalizados,
        riesgosDetectados,
        planAccion,
        resumenAnalisis,
        estadoGuardado: 'guardado'
      });
    } else {
      console.log('🆕 [COMPLETE-ANALYSIS-SERVICE] Creando nuevo resultado');
      return this.create({
        negocioId,
        moduloId,
        analisisId,
        costosAnalizados,
        riesgosDetectados,
        planAccion,
        resumenAnalisis,
        estadoGuardado: 'guardado'
      });
    }
  }
}
