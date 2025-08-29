// src/simulator/bussiness/business.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service'; // <-- Importa PrismaService
import { BusinessMapper } from './mappers/business.mapper';
import { Business } from './entities/bussines.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';


@Injectable()
export class BusinessService {
  constructor(
    private readonly prisma: PrismaService, // <-- Inyecta PrismaService
    private readonly mapper: BusinessMapper, // <-- Inyecta el Mapper
  ) {}

  async createBuisness(createDto: CreateBusinessDto): Promise<Business> {
    // 1. Lógica de acceso a datos (antes en el repositorio)
    const newBusinessPrisma = await this.prisma.negocios.create({
      data: {
        // Mapeamos directamente desde el DTO
        usuario_id: createDto.usuarioId,
        tipo_negocio: createDto.tipoNegocio,
        nombre_negocio: createDto.nombreNegocio,
        ubicacion: createDto.ubicacion,
        id_tamano: createDto.idTamano,
      },
    });

    // 2. Lógica de mapeo (para la respuesta)
    return this.mapper.toDomain(newBusinessPrisma);
  }

  async findById(id: number): Promise<Business> {
    // 1. Lógica de acceso a datos
    const businessPrisma = await this.prisma.negocios.findUnique({
      where: { negocio_id: id },
    });

    // 2. Lógica de negocio
    if (!businessPrisma) {
      throw new NotFoundException(`Business with ID ${id} not found.`);
    }

    // 3. Lógica de mapeo
    return this.mapper.toDomain(businessPrisma);
  }
 async findBuisnessByIdUser(id: number): Promise<Business[]> {
    // 1. Lógica de acceso a datos
    const buisnessFound = await this.prisma.negocios.findMany({
      where: { usuario_id: id },
    });

    // 2. Lógica de negocio
    if (!buisnessFound) {
      throw new NotFoundException(`Business with ID ${id} not found.`);
    }

    // 3. Lógica de mapeo
    return buisnessFound.map((n) => this.mapper.toDomain(n));
  }
  async findAllBuisness(): Promise<Business[]> {
    const businessesPrisma = await this.prisma.negocios.findMany();
    return businessesPrisma.map(this.mapper.toDomain);
  }

  async updateBuisness(id: number, updateDto: UpdateBusinessDto): Promise<Business> {
    try {
      const updatedBusinessPrisma = await this.prisma.negocios.update({
        where: { negocio_id: id },
        data: updateDto, // El DTO de actualización parcial encaja bien aquí
      });
      return this.mapper.toDomain(updatedBusinessPrisma);
    } catch (error) {
      // Manejar el error de Prisma si el registro no se encuentra
      if (error.code === 'P2025') {
        throw new NotFoundException(`Business with ID ${id} not found.`);
      }
      throw error;
    }
  }

  async deleteBuisness(id: number): Promise<void> {
    try {
      await this.prisma.negocios.delete({
        where: { negocio_id: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Business with ID ${id} not found.`);
      }
      throw error;
    }
  }
}