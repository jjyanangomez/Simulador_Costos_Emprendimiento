import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { BusinessMapper } from '../models/mappers/business.mapper';
import { Business } from '../models/entities/business.entity';
import { CreateBusinessDto } from '../models/dto/create-business.dto';
import { UpdateBusinessDto } from '../models/dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: BusinessMapper,
  ) {}

  async createBuisness(createDto: CreateBusinessDto): Promise<Business> {
    try {
      const newBusinessPrisma = await this.prisma.negocios.create({
        data: {
          usuario_id: createDto.usuarioId,
          tipo_negocio: createDto.tipoNegocio,
          nombre_negocio: createDto.nombreNegocio,
          ubicacion: createDto.ubicacion,
          id_tamano: createDto.idTamano,
        },
      });

      const mappedBusiness = this.mapper.toDomain(newBusinessPrisma);
      return mappedBusiness;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<Business> {
    const businessPrisma = await this.prisma.negocios.findUnique({
      where: { negocio_id: id },
      include: {
        tamano_negocio: true, // Incluir la información del tamaño
      },
    });

    if (!businessPrisma) {
      throw new NotFoundException(`Business with ID ${id} not found.`);
    }

    const mappedBusiness = this.mapper.toDomain(businessPrisma);
    return mappedBusiness;
  }

  async findBuisnessByIdUser(id: number): Promise<Business[]> {
    const businessFound = await this.prisma.negocios.findMany({
      where: { usuario_id: id },
    });

    if (!businessFound) {
      throw new NotFoundException(`Business with ID ${id} not found.`);
    }

    const mappedBusinesses = businessFound.map((n) => this.mapper.toDomain(n));
    return mappedBusinesses;
  }

  async findAllBuisness(): Promise<Business[]> {
    const businessesPrisma = await this.prisma.negocios.findMany();
    const mappedBusinesses = businessesPrisma.map(this.mapper.toDomain);
    return mappedBusinesses;
  }

  async updateBuisness(id: number, updateDto: UpdateBusinessDto): Promise<Business> {
    try {
      const updatedBusinessPrisma = await this.prisma.negocios.update({
        where: { negocio_id: id },
        data: updateDto,
      });
      return this.mapper.toDomain(updatedBusinessPrisma);
    } catch (error) {
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

  async getUsuarios() {
    const usuarios = await this.prisma.usuarios.findMany({
      select: {
        usuario_id: true,
        nombre_completo: true,
        email: true,
        fecha_registro: true
      }
    });
    
    return usuarios;
  }


}

