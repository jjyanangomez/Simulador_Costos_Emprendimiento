import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { StatusMapper } from './mappers/size.mapper';
import { CreateStatusDto } from './dto/create-status.dto';
import { Status } from './entities/status.entity';
import { UpdateStatusDto } from './dto/update-status.dto';


@Injectable()
export class StatusService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: StatusMapper,
  ) {}

  async create(createDto: CreateStatusDto): Promise<Status> {
    const statusPrisma = await this.prisma.estados.create({
      data: {
        nombre_estado: createDto.statusName,
      },
    });
    return this.mapper.toDomain(statusPrisma);
  }

  async findAll(): Promise<Status[]> {
    const statusesPrisma = await this.prisma.estados.findMany();
    return statusesPrisma.map(this.mapper.toDomain);
  }

  async findById(id: number): Promise<Status> {
    const statusPrisma = await this.prisma.estados.findUnique({
      where: { id_estado: id },
    });

    if (!statusPrisma) {
      throw new NotFoundException(`Status with ID ${id} not found.`);
    }
    return this.mapper.toDomain(statusPrisma);
  }

  async update(id: number, updateDto: UpdateStatusDto): Promise<Status> {
    // Verificamos que el registro exista antes de intentar actualizar
    await this.findById(id);

    const updatedStatusPrisma = await this.prisma.estados.update({
      where: { id_estado: id },
      data: {
        nombre_estado: updateDto.statusName,
      },
    });
    return this.mapper.toDomain(updatedStatusPrisma);
  }

  async delete(id: number): Promise<void> {
    // Verificamos que el registro exista para lanzar un 404 si no es así
    await this.findById(id);

    // Ojo: Si un estado está en uso, Prisma lanzará un error de clave foránea.
    // Esto es bueno, previene la eliminación de datos en uso.
    await this.prisma.estados.delete({
      where: { id_estado: id },
    });
  }
}