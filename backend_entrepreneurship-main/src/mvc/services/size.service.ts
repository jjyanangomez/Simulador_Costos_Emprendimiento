import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { SizeMapper } from '../models/mappers/size.mapper';
import { CreateSizeDto } from '../models/dto/create-size.dto';
import { Size } from '../models/entities/size.entity';
import { UpdateSizeDto } from '../models/dto/update-size.dto';


@Injectable()
export class SizeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: SizeMapper,
  ) {}

  async create(createDto: CreateSizeDto): Promise<Size> {
    const sizePrisma = await this.prisma.tamano_negocio.create({
      data: {
        tamano_nombre: createDto.sizeName,
      },
    });
    return this.mapper.toDomain(sizePrisma);
  }

  async findAll(): Promise<Size[]> {
    const sizesPrisma = await this.prisma.tamano_negocio.findMany();
    return sizesPrisma.map(this.mapper.toDomain);
  }

  async findById(id: number): Promise<Size> {
    const sizePrisma = await this.prisma.tamano_negocio.findUnique({
      where: { id_tamano: id },
    });

    if (!sizePrisma) {
      throw new NotFoundException(`Size with ID ${id} not found.`);
    }
    return this.mapper.toDomain(sizePrisma);
  }

  async update(id: number, updateDto: UpdateSizeDto): Promise<Size> {
    // Verificamos que el registro exista antes de intentar actualizar
    await this.findById(id);

    const updatedSizePrisma = await this.prisma.tamano_negocio.update({
      where: { id_tamano: id },
      data: {
        tamano_nombre: updateDto.sizeName,
      },
    });
    return this.mapper.toDomain(updatedSizePrisma);
  }

  async delete(id: number): Promise<void> {
    // Verificamos que el registro exista para lanzar un 404 si no es así
    await this.findById(id);

    await this.prisma.tamano_negocio.delete({
      where: { id_tamano: id },
    });
  }
}
