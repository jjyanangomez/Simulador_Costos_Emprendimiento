import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { AnalisisIA } from '../models/entities/analysis_ai';
import { CreateAnalisisIADto} from '../models/dto/create-analysis_ai.dto';
import { UpdateAnalisisIADto } from '../models/dto/update-analysis_ai.dto';
import { AnalisisIAMapper } from '../models/mappers/analysis_ai.mapper';

@Injectable()
export class AnalisisIAService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: AnalisisIAMapper,
  ) {}

  async create(createAnalisisIADto: CreateAnalisisIADto): Promise<AnalisisIA> {
    const nuevoAnalisis = await this.prisma.analisis_IA.create({
      data:{
        negocio_id: createAnalisisIADto.negocioId,
        fecha_analisis: createAnalisisIADto.fechaAnalisis,
      }
    })
    return this.mapper.toDomain(nuevoAnalisis);
  }

  async findById(id: number): Promise<AnalisisIA> {
    const progressPrisma = await this.prisma.analisis_IA.findUnique({
      where: { analisis_id: id },
    });

    if (!progressPrisma) {
      throw new NotFoundException(`Progress step with ID ${id} not found.`);
    }
    return this.mapper.toDomain(progressPrisma);
  }

  async update(id: number, updateAnalisisIADto: UpdateAnalisisIADto): Promise<AnalisisIA> {
    await this.findById(id); // Verifica que el registro exista
     const updatedProgressPrisma = await this.prisma.analisis_IA.update({
      where: { analisis_id: id },
      data: {
        negocio_id: updateAnalisisIADto.negocioId,
        fecha_analisis: updateAnalisisIADto.fechaAnalisis,
      },
    });
    return this.mapper.toDomain(updatedProgressPrisma);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // Verifica que el registro exista
    
    await this.prisma.analisis_IA.delete({
      where: { analisis_id: id },
    });
  }

  async findAll(): Promise<AnalisisIA[]> {
    const progressPrisma = await this.prisma.analisis_IA.findMany();
    return progressPrisma.map(this.mapper.toDomain);
  }

  async verifyOrCreate(negocioId: number): Promise<AnalisisIA> {
    console.log('🔍 [ANALISIS-SERVICE] Verificando análisis para negocio:', negocioId);
    
    // Buscar si ya existe un análisis para este negocio
    const existingAnalisis = await this.prisma.analisis_IA.findFirst({
      where: { negocio_id: negocioId }
    });
    
    if (existingAnalisis) {
      console.log('✅ [ANALISIS-SERVICE] Análisis encontrado:', existingAnalisis.analisis_id);
      return this.mapper.toDomain(existingAnalisis);
    }
    
    // Si no existe, crear uno nuevo
    console.log('🔍 [ANALISIS-SERVICE] Creando nuevo análisis para negocio:', negocioId);
    const newAnalisis = await this.prisma.analisis_IA.create({
      data: {
        negocio_id: negocioId,
        fecha_analisis: new Date(),
      }
    });
    
    console.log('✅ [ANALISIS-SERVICE] Nuevo análisis creado:', newAnalisis.analisis_id);
    return this.mapper.toDomain(newAnalisis);
  }
}

