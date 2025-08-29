import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateBusinessProgressStepDto } from './dto/create-business-progress-step.dto';
import { BusinessProgressStepMapper } from './mappers/business-progress-step.mapper';
import { BusinessProgressStep } from './entities/business-progress-step.entity';
import { UpdateBusinessProgressStepDto } from './dto/update-business-progress-step.dto';


@Injectable()
export class BusinessProgressStepService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: BusinessProgressStepMapper,
  ) {}

  async create(createDto: CreateBusinessProgressStepDto): Promise<BusinessProgressStep> {
    const progressPrisma = await this.prisma.negocioProgresoPaso.create({
      data: {
        negocio_id: createDto.businessId,
        modulo_id: createDto.moduleId,
        id_estado: createDto.statusId,
      },
    });
    return this.mapper.toDomain(progressPrisma);
  }

  async findAll(): Promise<BusinessProgressStep[]> {
    const progressPrisma = await this.prisma.negocioProgresoPaso.findMany();
    return progressPrisma.map(this.mapper.toDomain);
  }

  async findById(id: number): Promise<BusinessProgressStep> {
    const progressPrisma = await this.prisma.negocioProgresoPaso.findUnique({
      where: { id: id },
    });

    if (!progressPrisma) {
      throw new NotFoundException(`Progress step with ID ${id} not found.`);
    }
    return this.mapper.toDomain(progressPrisma);
  }

  async findByBusinessId(businessId: number): Promise<BusinessProgressStep[]> {
    const progressPrisma = await this.prisma.negocioProgresoPaso.findMany({
      where: { negocio_id: businessId },
    });
    return progressPrisma.map(this.mapper.toDomain);
  }

  async update(id: number, updateDto: UpdateBusinessProgressStepDto): Promise<BusinessProgressStep> {
    await this.findById(id); // Verifica que el registro exista

    const updatedProgressPrisma = await this.prisma.negocioProgresoPaso.update({
      where: { id: id },
      data: {
        id_estado: updateDto.statusId,
        fecha_inicio: updateDto.startDate ? new Date(updateDto.startDate) : undefined,
        fecha_completado: updateDto.completionDate ? new Date(updateDto.completionDate) : undefined,
      },
    });
    return this.mapper.toDomain(updatedProgressPrisma);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // Verifica que el registro exista
    
    await this.prisma.negocioProgresoPaso.delete({
      where: { id: id },
    });
  }
}