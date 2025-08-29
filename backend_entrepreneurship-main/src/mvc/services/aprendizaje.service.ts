import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { AprendizajeMapper } from '../models/mappers/aprendizaje.mapper';
import { ModuloMapper } from '../models/mappers/modulo.mapper';
import { Aprendizaje } from '../models/entities/aprendizaje.entity';
import { Modulo } from '../models/entities/modulo.entity';

@Injectable()
export class AprendizajeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aprendizajeMapper: AprendizajeMapper,
    private readonly moduloMapper: ModuloMapper,
  ) {}

  async findAllAprendizajes(): Promise<Aprendizaje[]> {
    const aprendizajesPrisma = await this.prisma.aprendizaje.findMany();
    const mappedAprendizajes = aprendizajesPrisma.map((a) => this.aprendizajeMapper.toDomain(a));
    return mappedAprendizajes;
  }

  async findAprendizajeById(id: number): Promise<Aprendizaje> {
    const aprendizajePrisma = await this.prisma.aprendizaje.findUnique({
      where: { id_aprendizaje: id },
    });

    if (!aprendizajePrisma) {
      throw new NotFoundException(`Aprendizaje with ID ${id} not found.`);
    }

    const mappedAprendizaje = this.aprendizajeMapper.toDomain(aprendizajePrisma);
    return mappedAprendizaje;
  }

  async findModulosByAprendizajeId(aprendizajeId: number): Promise<Modulo[]> {
    const modulosPrisma = await this.prisma.modulos.findMany({
      where: { id_aprendizaje: aprendizajeId },
      orderBy: { orden_modulo: 'asc' }
    });
    
    const mappedModulos = modulosPrisma.map((m) => this.moduloMapper.toDomain(m));
    return mappedModulos;
  }

  async findModuloById(id: number): Promise<Modulo> {
    const moduloPrisma = await this.prisma.modulos.findUnique({
      where: { id_modulo: id },
    });

    if (!moduloPrisma) {
      throw new NotFoundException(`Modulo with ID ${id} not found.`);
    }

    const mappedModulo = this.moduloMapper.toDomain(moduloPrisma);
    return mappedModulo;
  }

  async getModulosWithProgress(aprendizajeId: number, negocioId: number): Promise<any[]> {

    
    const modulosWithProgress = await this.prisma.modulos.findMany({
      where: { id_aprendizaje: aprendizajeId },
      include: {
        NegocioProgresoPaso: {
          where: { negocio_id: negocioId },
          include: {
            Estados: true
          }
        }
      },
      orderBy: { orden_modulo: 'asc' }
    });
    

    
    // Mapear y determinar el estado de cada módulo
    const mappedModulos = modulosWithProgress.map((modulo, index) => {
      const mappedModulo = this.moduloMapper.toDomain(modulo);
      const progreso = modulo.NegocioProgresoPaso[0];
      
      let status = 'LOCKED';
      
      // Validar que orden_modulo no sea null
      const ordenModulo = modulo.orden_modulo ?? 0;
      
      if (progreso) {
        // Si hay progreso para este módulo específico
        switch (progreso.Estados.nombre_estado) {
          case 'Completado':
            status = 'COMPLETED';
            break;
          case 'En Progreso':
            status = 'IN_PROGRESS';
            break;
          default:
            status = 'LOCKED';
        }
      } else {
        // Si no hay progreso para este módulo, verificar si debe estar desbloqueado
        if (ordenModulo === 1) {
          // El primer módulo siempre está disponible
          status = 'IN_PROGRESS';
        } else if (ordenModulo > 1) {
          // Para módulos posteriores, verificar si el módulo anterior está completado
          const moduloAnterior = modulosWithProgress.find(m => (m.orden_modulo ?? 0) === ordenModulo - 1);
          if (moduloAnterior) {
            const progresoAnterior = moduloAnterior.NegocioProgresoPaso[0];
            if (progresoAnterior && progresoAnterior.Estados.nombre_estado === 'Completado') {
              status = 'IN_PROGRESS';
            }
          }
        }
      }
      
      return {
        ...mappedModulo,
        status
      };
    });
    
    return mappedModulos;
  }
}
