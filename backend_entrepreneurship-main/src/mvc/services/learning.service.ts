import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';

import { Learning } from '../models/entities/learning.entity';
import { LearningMapper } from '../models/mappers/learining.mapper';
import { CreateLearningDto } from '../models/dto/create-learnig.dto';
import { UpdateLearningDto } from '../models/dto/update-learning.dto';

@Injectable()
export class LearningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: LearningMapper,
  ) {}

  async create(createDto: CreateLearningDto): Promise<Learning> {
    const learningPrisma = await this.prisma.aprendizaje.create({
      data: {
        nombre: createDto.name,
        total_niveles: createDto.totalLevels,
      },
    });
    return this.mapper.toDomain(learningPrisma);
  }

  async findAll(): Promise<Learning[]> {
    const learningsPrisma = await this.prisma.aprendizaje.findMany();
    return learningsPrisma.map(this.mapper.toDomain);
  }

  async findById(id: number): Promise<Learning> {
    const learningPrisma = await this.prisma.aprendizaje.findUnique({
      where: { id_aprendizaje: id },
    });

    if (!learningPrisma) {
      throw new NotFoundException(`Learning with ID ${id} not found.`);
    }
    return this.mapper.toDomain(learningPrisma);
  }

  async update(id: number, updateDto: UpdateLearningDto): Promise<Learning> {
    // Primero, verificamos que exista para lanzar un error 404 claro
    await this.findById(id); 
    
    const updatedLearningPrisma = await this.prisma.aprendizaje.update({
      where: { id_aprendizaje: id },
      data: {
        nombre: updateDto.name,
        total_niveles: updateDto.totalLevels,
      },
    });
    return this.mapper.toDomain(updatedLearningPrisma);
  }

  async delete(id: number): Promise<void> {
    // Verificamos que exista para manejar el error 404
    await this.findById(id);

    await this.prisma.aprendizaje.delete({
      where: { id_aprendizaje: id },
    });
  }
}
