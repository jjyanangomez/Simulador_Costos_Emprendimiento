import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { ActionPlanResult } from './entities/action-plan-result.entity';
import { CreateActionPlanResultDto } from './dto/create-action-plan-result.dto';
import { UpdateActionPlanResultDto } from './dto/update-action-plan-result.dto';
import { ActionPlanResultMapper } from './mappers/action-plan-result.mapper';

@Injectable()
export class ActionPlanResultService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ActionPlanResultMapper,
  ) {}

  async create(createDto: CreateActionPlanResultDto): Promise<ActionPlanResult> {
    const prismaResult = await this.prisma.resultados_Plan_Accion.create({
      data: {
        analisis_id: createDto.analisisId,
        titulo: createDto.titulo,
        descripcion: createDto.descripcion,
        prioridad: createDto.prioridad,
      },
    });
    return this.mapper.toDomain(prismaResult);
  }

  async createMultiple(createDtos: CreateActionPlanResultDto[]): Promise<ActionPlanResult[]> {
    try {
      console.log('🔍 [ACTION-SERVICE] ===== INICIANDO CREACIÓN MÚLTIPLE =====');
      console.log('🔍 [ACTION-SERVICE] createDtos recibidos:', createDtos.length, 'elementos');
      console.log('🔍 [ACTION-SERVICE] Primer elemento:', createDtos[0]);
      
      if (!createDtos || createDtos.length === 0) {
        throw new Error('Se requiere un array de resultados para crear múltiples planes de acción');
      }

      console.log('🔍 [ACTION-SERVICE] Mapeando datos para Prisma...');
      const prismaData = createDtos.map(dto => ({
        analisis_id: dto.analisisId,
        titulo: dto.titulo,
        descripcion: dto.descripcion,
        prioridad: dto.prioridad,
      }));
      console.log('🔍 [ACTION-SERVICE] Datos mapeados:', prismaData);

      console.log('🔍 [ACTION-SERVICE] Verificando si existe el análisis...');
      let analisisExists = await this.prisma.analisis_IA.findUnique({
        where: { analisis_id: createDtos[0].analisisId }
      });
      
      if (!analisisExists) {
        console.log('⚠️ [ACTION-SERVICE] El análisis con ID', createDtos[0].analisisId, 'no existe, creándolo...');
        
        // Crear el análisis si no existe
        analisisExists = await this.prisma.analisis_IA.create({
          data: {
            analisis_id: createDtos[0].analisisId,
            negocio_id: createDtos[0].analisisId, // Usar el mismo ID como negocio_id temporalmente
            fecha_analisis: new Date()
          }
        });
        
        console.log('✅ [ACTION-SERVICE] Análisis creado:', analisisExists);
      } else {
        console.log('✅ [ACTION-SERVICE] Análisis encontrado:', analisisExists);
      }
      
      console.log('🔍 [ACTION-SERVICE] Llamando a Prisma createMany...');
      const prismaResults = await this.prisma.resultados_Plan_Accion.createMany({
        data: prismaData,
      });
      console.log('🔍 [ACTION-SERVICE] Prisma createMany completado:', prismaResults);

      console.log('🔍 [ACTION-SERVICE] Buscando registros creados...');
      // Obtener los registros creados para devolverlos
      const createdResults = await this.prisma.resultados_Plan_Accion.findMany({
        where: {
          analisis_id: createDtos[0].analisisId,
        },
        orderBy: {
          plan_id: 'desc',
        },
        take: createDtos.length,
      });
      console.log('🔍 [ACTION-SERVICE] Registros encontrados:', createdResults.length);

      console.log('🔍 [ACTION-SERVICE] Mapeando a dominio...');
      const result = createdResults.map(this.mapper.toDomain);
      console.log('🔍 [ACTION-SERVICE] Resultado final:', result);
      
      return result;
    } catch (error) {
      console.error('❌ [ACTION-SERVICE] Error en createMultiple:', error);
      throw error;
    }
  }

  async findAll(): Promise<ActionPlanResult[]> {
    const prismaResults = await this.prisma.resultados_Plan_Accion.findMany();
    return prismaResults.map(this.mapper.toDomain);
  }

  async findById(id: number): Promise<ActionPlanResult> {
    const prismaResult = await this.prisma.resultados_Plan_Accion.findUnique({
      where: { plan_id: id },
    });
    if (!prismaResult) {
      throw new NotFoundException(`Action plan result with ID ${id} not found.`);
    }
    return this.mapper.toDomain(prismaResult);
  }

  async findByAnalysisId(analysisId: number): Promise<ActionPlanResult[]> {
    const prismaResults = await this.prisma.resultados_Plan_Accion.findMany({
      where: { analisis_id: analysisId },
    });
    return prismaResults.map(this.mapper.toDomain);
  }

  async update(id: number, updateDto: UpdateActionPlanResultDto): Promise<ActionPlanResult> {
    await this.findById(id); // Verifica si el registro existe
    const updatedResult = await this.prisma.resultados_Plan_Accion.update({
      where: { plan_id: id },
      data: {
        titulo: updateDto.title,
        descripcion: updateDto.description,
        prioridad: updateDto.priority,
      },
    });
    return this.mapper.toDomain(updatedResult);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // Verifica si el registro existe
    await this.prisma.resultados_Plan_Accion.delete({
      where: { plan_id: id },
    });
  }
}