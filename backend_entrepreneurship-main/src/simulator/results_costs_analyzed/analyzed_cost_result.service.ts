import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { ResultadosCostosAnalizados } from './entities/results_costs_analyzed';
import { CreateAnalyzedCostResultDto } from './dto/create-results_costs_analyzed.dto';
import { UpdateAnalyzedCostResultDto } from './dto/update-results_costs_analyzed.dto';
import { AnalyzedCostResultMapper } from './mappers/analyzed_cost_result.mapper';

@Injectable()
export class AnalyzedCostResultService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: AnalyzedCostResultMapper,
  ) {}

  async create(createDto: CreateAnalyzedCostResultDto): Promise<ResultadosCostosAnalizados> {
    const prismaResult = await this.prisma.resultados_Costos_Analizados.create({
      data: {
        analisis_id: createDto.analysisId,
        nombre_costo: createDto.costName,
        valor_recibido: createDto.receivedValue,
        rango_estimado: createDto.estimatedRange,
        evaluacion: createDto.evaluation,
        comentario: createDto.comment,
      },
    });
    return this.mapper.toDomain(prismaResult);
  }

  async createMultiple(createDtos: CreateAnalyzedCostResultDto[]): Promise<ResultadosCostosAnalizados[]> {
    // Validar que el array no esté vacío
    if (!createDtos || createDtos.length === 0) {
      throw new Error('No se proporcionaron datos para crear los resultados de análisis');
    }

    // Verificar que todos los DTOs tengan el mismo analysisId
    const analysisId = createDtos[0].analysisId;
    if (!analysisId) {
      throw new Error('El ID de análisis es requerido');
    }

    // Verificar que todos los DTOs tengan el mismo analysisId
    const allSameAnalysisId = createDtos.every(dto => dto.analysisId === analysisId);
    if (!allSameAnalysisId) {
      throw new Error('Todos los resultados deben pertenecer al mismo análisis');
    }

    // Verificar si ya existe un análisis para este negocio
    const existingAnalysis = await this.prisma.analisis_IA.findFirst({
      where: { negocio_id: analysisId }
    });
    
    let analisisId: number;
    
    if (existingAnalysis) {
      // Usar el análisis existente
      analisisId = existingAnalysis.analisis_id;
    } else {
      // Crear un nuevo análisis para el negocio
      const newAnalysis = await this.prisma.analisis_IA.create({
        data: {
          negocio_id: analysisId,
          fecha_analisis: new Date()
        }
      });
      analisisId = newAnalysis.analisis_id;
    }
    
    const dataToInsert = createDtos.map(dto => {
      // Validar que los campos requeridos estén presentes
      if (!dto.costName) {
        throw new Error('El nombre del costo es requerido');
      }
      
      return {
        analisis_id: analisisId, // Usar el ID del análisis (nuevo o existente)
        nombre_costo: dto.costName,
        valor_recibido: dto.receivedValue || null,
        rango_estimado: dto.estimatedRange || null,
        evaluacion: dto.evaluation || null,
        comentario: dto.comment || null,
      };
    });
    
    await this.prisma.resultados_Costos_Analizados.createMany({
      data: dataToInsert,
    });
    
    // Retornar los resultados creados
    const createdResults = await this.prisma.resultados_Costos_Analizados.findMany({
      where: {
        analisis_id: analisisId,
      },
      orderBy: { resultado_costo_id: 'desc' },
      take: createDtos.length,
    });
    
    return createdResults.map(this.mapper.toDomain);
  }

  async findAll(): Promise<ResultadosCostosAnalizados[]> {
    const prismaResults = await this.prisma.resultados_Costos_Analizados.findMany();
    return prismaResults.map(this.mapper.toDomain);
  }

  async findById(id: number): Promise<ResultadosCostosAnalizados> {
    const prismaResult = await this.prisma.resultados_Costos_Analizados.findUnique({
      where: { resultado_costo_id: id },
    });
    if (!prismaResult) {
      throw new NotFoundException(`Analyzed cost result with ID ${id} not found.`);
    }
    return this.mapper.toDomain(prismaResult);
  }

  async findByAnalysisId(analysisId: number): Promise<ResultadosCostosAnalizados[]> {
    const prismaResults = await this.prisma.resultados_Costos_Analizados.findMany({
      where: { analisis_id: analysisId },
    });
    return prismaResults.map(this.mapper.toDomain);
  }

  async update(id: number, updateDto: UpdateAnalyzedCostResultDto): Promise<ResultadosCostosAnalizados> {
    await this.findById(id); // Verifica si el registro existe
    const updatedResult = await this.prisma.resultados_Costos_Analizados.update({
      where: { resultado_costo_id: id },
      data: {
        nombre_costo: updateDto.costName,
        valor_recibido: updateDto.receivedValue,
        rango_estimado: updateDto.estimatedRange,
        evaluacion: updateDto.evaluation,
        comentario: updateDto.comment,
      },
    });
    return this.mapper.toDomain(updatedResult);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // Verifica si el registro existe
    await this.prisma.resultados_Costos_Analizados.delete({
      where: { resultado_costo_id: id },
    });
  }
}