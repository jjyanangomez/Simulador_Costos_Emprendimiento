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
          sector_id: createDto.sectorId || 1, // Campo requerido
          nombre_negocio: createDto.nombreNegocio,
          ubicacion_exacta: createDto.ubicacionExacta,
          id_tamano: createDto.idTamano || 1, // Valor por defecto si no se proporciona
          aforo_personas: createDto.aforoPersonas || 50,
          inversion_inicial: createDto.inversionInicial || 0,
          capital_propio: createDto.capitalPropio || 0,
          capital_prestamo: createDto.capitalPrestamo || 0,
          tasa_interes: createDto.tasaInteres || 0,
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
        TamanosNegocio: true, // Incluir la información del tamaño
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
      // Mapear los campos del DTO a los nombres de Prisma
      const prismaData: any = {};
      
      if (updateDto.sectorId !== undefined) prismaData.sector_id = updateDto.sectorId;
      if (updateDto.nombreNegocio !== undefined) prismaData.nombre_negocio = updateDto.nombreNegocio;
      if (updateDto.ubicacionExacta !== undefined) prismaData.ubicacion_exacta = updateDto.ubicacionExacta;
      if (updateDto.idTamano !== undefined) prismaData.id_tamano = updateDto.idTamano;
      if (updateDto.aforoPersonas !== undefined) prismaData.aforo_personas = updateDto.aforoPersonas;
      if (updateDto.inversionInicial !== undefined) prismaData.inversion_inicial = updateDto.inversionInicial;
      if (updateDto.capitalPropio !== undefined) prismaData.capital_propio = updateDto.capitalPropio;
      if (updateDto.capitalPrestamo !== undefined) prismaData.capital_prestamo = updateDto.capitalPrestamo;
      if (updateDto.tasaInteres !== undefined) prismaData.tasa_interes = updateDto.tasaInteres;

      const updatedBusinessPrisma = await this.prisma.negocios.update({
        where: { negocio_id: id },
        data: prismaData,
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

