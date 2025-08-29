import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { DetectedRiskResult } from './entities/detected-risk-result.entity';
import { CreateDetectedRiskResultDto } from './dto/create-detected-risk-result.dto';
import { UpdateDetectedRiskResultDto } from './dto/update-detected-risk-result.dto';
import { DetectedRiskResultMapper } from './mappers/detected-risk-result.mapper';

@Injectable()
export class DetectedRiskResultService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: DetectedRiskResultMapper,
  ) {}

  async create(createDto: CreateDetectedRiskResultDto): Promise<DetectedRiskResult> {
    const prismaResult = await this.prisma.resultados_Riesgos_Detectados.create({
      data: {
        analisis_id: createDto.analisisId,
        riesgo: createDto.riesgo,
        causa_directa: createDto.causaDirecta,
        impacto_potencial: createDto.impactoPotencial,
      },
    });
    return this.mapper.toDomain(prismaResult);
  }

  async createMultiple(createDtos: CreateDetectedRiskResultDto[]): Promise<DetectedRiskResult[]> {
    try {
      console.log('🔍 [RISK-SERVICE] ===== INICIANDO CREACIÓN MÚLTIPLE =====');
      console.log('🔍 [RISK-SERVICE] createDtos recibidos:', createDtos.length, 'elementos');
      console.log('🔍 [RISK-SERVICE] Primer elemento:', createDtos[0]);
      
      if (!createDtos || createDtos.length === 0) {
        throw new Error('Se requiere un array de resultados para crear múltiples riesgos detectados');
      }

      console.log('🔍 [RISK-SERVICE] Mapeando datos para Prisma...');
      const prismaData = createDtos.map(dto => ({
        analisis_id: dto.analisisId,
        riesgo: dto.riesgo,
        causa_directa: dto.causaDirecta,
        impacto_potencial: dto.impactoPotencial,
      }));
      console.log('🔍 [RISK-SERVICE] Datos mapeados:', prismaData);

      console.log('🔍 [RISK-SERVICE] Verificando si existe el análisis...');
      let analisisExists = await this.prisma.analisis_IA.findUnique({
        where: { analisis_id: createDtos[0].analisisId }
      });
      
      if (!analisisExists) {
        console.log('⚠️ [RISK-SERVICE] El análisis con ID', createDtos[0].analisisId, 'no existe, creándolo...');
        
        // Crear el análisis si no existe
        analisisExists = await this.prisma.analisis_IA.create({
          data: {
            analisis_id: createDtos[0].analisisId,
            negocio_id: createDtos[0].analisisId, // Usar el mismo ID como negocio_id temporalmente
            fecha_analisis: new Date()
          }
        });
        
        console.log('✅ [RISK-SERVICE] Análisis creado:', analisisExists);
      } else {
        console.log('✅ [RISK-SERVICE] Análisis encontrado:', analisisExists);
      }
      
      console.log('🔍 [RISK-SERVICE] Llamando a Prisma createMany...');
      const prismaResults = await this.prisma.resultados_Riesgos_Detectados.createMany({
        data: prismaData,
      });
      console.log('🔍 [RISK-SERVICE] Prisma createMany completado:', prismaResults);

      console.log('🔍 [RISK-SERVICE] Buscando registros creados...');
      // Obtener los registros creados para devolverlos
      const createdResults = await this.prisma.resultados_Riesgos_Detectados.findMany({
        where: {
          analisis_id: createDtos[0].analisisId,
        },
        orderBy: {
          riesgo_id: 'desc',
        },
        take: createDtos.length,
      });
      console.log('🔍 [RISK-SERVICE] Registros encontrados:', createdResults.length);

      console.log('🔍 [RISK-SERVICE] Mapeando a dominio...');
      const result = createdResults.map(this.mapper.toDomain);
      console.log('🔍 [RISK-SERVICE] Resultado final:', result);
      
      return result;
    } catch (error) {
      console.error('❌ [RISK-SERVICE] Error en createMultiple:', error);
      throw error;
    }
  }

  async findAll(): Promise<DetectedRiskResult[]> {
    const prismaResults = await this.prisma.resultados_Riesgos_Detectados.findMany();
    return prismaResults.map(this.mapper.toDomain);
  }

  async findById(id: number): Promise<DetectedRiskResult> {
    const prismaResult = await this.prisma.resultados_Riesgos_Detectados.findUnique({
      where: { riesgo_id: id },
    });
    if (!prismaResult) {
      throw new NotFoundException(`Detected risk result with ID ${id} not found.`);
    }
    return this.mapper.toDomain(prismaResult);
  }

  async findByAnalysisId(analysisId: number): Promise<DetectedRiskResult[]> {
    const prismaResults = await this.prisma.resultados_Riesgos_Detectados.findMany({
      where: { analisis_id: analysisId },
    });
    return prismaResults.map(this.mapper.toDomain);
  }

  async update(id: number, updateDto: UpdateDetectedRiskResultDto): Promise<DetectedRiskResult> {
    await this.findById(id); // Verifica si el registro existe
    const updatedResult = await this.prisma.resultados_Riesgos_Detectados.update({
      where: { riesgo_id: id },
      data: {
        riesgo: updateDto.risk,
        causa_directa: updateDto.directCause,
        impacto_potencial: updateDto.potentialImpact,
      },
    });
    return this.mapper.toDomain(updatedResult);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // Verifica si el registro existe
    await this.prisma.resultados_Riesgos_Detectados.delete({
      where: { riesgo_id: id },
    });
  }
}