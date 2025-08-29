import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { AnalisisIA } from './entities/analysis_ai';
import { CreateAnalisisIADto} from './dto/create-analysis_ai.dto';
import { UpdateAnalisisIADto } from './dto/update-analysis_ai.dto';
import { AnalisisIAMapper } from './mappers/analysis_ai.mapper';

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
}
