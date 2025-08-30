import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateCostoFijoDto } from '../models/dto/create-costo-fijo.dto';
import { UpdateCostoFijoDto } from '../models/dto/update-costo-fijo.dto';

@Injectable()
export class CostosFijosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCostoFijoDto: CreateCostoFijoDto) {
    try {
      // Verificar que el negocio existe
      const negocio = await this.prisma.negocios.findUnique({
        where: { negocio_id: createCostoFijoDto.negocioId },
      });

      if (!negocio) {
        throw new NotFoundException('El negocio no existe');
      }

      // Verificar que el tipo de costo existe
      const tipoCosto = await this.prisma.tiposCosto.findUnique({
        where: { tipo_costo_id: createCostoFijoDto.tipoCostoId },
      });

      if (!tipoCosto) {
        throw new NotFoundException('El tipo de costo no existe');
      }

      // Crear el costo fijo
      const costoFijo = await this.prisma.costosFijos.create({
        data: {
          negocio_id: createCostoFijoDto.negocioId,
          tipo_costo_id: createCostoFijoDto.tipoCostoId,
          nombre: createCostoFijoDto.nombre,
          descripcion: createCostoFijoDto.descripcion,
          monto: createCostoFijoDto.monto,
          frecuencia: createCostoFijoDto.frecuencia,
          fecha_inicio: createCostoFijoDto.fechaInicio ? new Date(createCostoFijoDto.fechaInicio) : new Date(),
          fecha_fin: createCostoFijoDto.fechaFin ? new Date(createCostoFijoDto.fechaFin) : null,
          activo: createCostoFijoDto.activo ?? true,
        },
        include: {
          Negocios: {
            select: {
              nombre_negocio: true,
            },
          },
          TiposCosto: {
            select: {
              nombre: true,
            },
          },
        },
      });

      return {
        message: 'Costo fijo creado exitosamente',
        data: costoFijo,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al crear el costo fijo: ${error.message}`);
    }
  }

  async findByNegocioId(negocioId: number) {
    try {
      const costosFijos = await this.prisma.costosFijos.findMany({
        where: {
          negocio_id: negocioId,
          activo: true,
        },
        include: {
          TiposCosto: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
        },
        orderBy: {
          fecha_inicio: 'desc',
        },
      });

      return {
        message: 'Costos fijos obtenidos exitosamente',
        data: costosFijos,
        total: costosFijos.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener los costos fijos: ${error.message}`);
    }
  }

  async findById(id: number) {
    try {
      const costoFijo = await this.prisma.costosFijos.findUnique({
        where: { costo_fijo_id: id },
        include: {
          Negocios: {
            select: {
              nombre_negocio: true,
            },
          },
          TiposCosto: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
        },
      });

      if (!costoFijo) {
        throw new NotFoundException('Costo fijo no encontrado');
      }

      return {
        message: 'Costo fijo encontrado exitosamente',
        data: costoFijo,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener el costo fijo: ${error.message}`);
    }
  }

  async update(id: number, updateCostoFijoDto: UpdateCostoFijoDto) {
    try {
      // Verificar que el costo fijo existe
      const costoFijoExistente = await this.prisma.costosFijos.findUnique({
        where: { costo_fijo_id: id },
      });

      if (!costoFijoExistente) {
        throw new NotFoundException('Costo fijo no encontrado');
      }

      // Preparar datos para actualización
      const updateData: any = {};
      
      if (updateCostoFijoDto.nombre !== undefined) updateData.nombre = updateCostoFijoDto.nombre;
      if (updateCostoFijoDto.descripcion !== undefined) updateData.descripcion = updateCostoFijoDto.descripcion;
      if (updateCostoFijoDto.monto !== undefined) updateData.monto = updateCostoFijoDto.monto;
      if (updateCostoFijoDto.frecuencia !== undefined) updateData.frecuencia = updateCostoFijoDto.frecuencia;
      if (updateCostoFijoDto.fechaInicio !== undefined) updateData.fecha_inicio = new Date(updateCostoFijoDto.fechaInicio);
      if (updateCostoFijoDto.fechaFin !== undefined) updateData.fecha_fin = updateCostoFijoDto.fechaFin ? new Date(updateCostoFijoDto.fechaFin) : null;
      if (updateCostoFijoDto.activo !== undefined) updateData.activo = updateCostoFijoDto.activo;

      // Actualizar el costo fijo
      const costoFijoActualizado = await this.prisma.costosFijos.update({
        where: { costo_fijo_id: id },
        data: updateData,
        include: {
          Negocios: {
            select: {
              nombre_negocio: true,
            },
          },
          TiposCosto: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
        },
      });

      return {
        message: 'Costo fijo actualizado exitosamente',
        data: costoFijoActualizado,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al actualizar el costo fijo: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      // Verificar que el costo fijo existe
      const costoFijoExistente = await this.prisma.costosFijos.findUnique({
        where: { costo_fijo_id: id },
      });

      if (!costoFijoExistente) {
        throw new NotFoundException('Costo fijo no encontrado');
      }

      // Eliminar lógicamente (marcar como inactivo)
      await this.prisma.costosFijos.update({
        where: { costo_fijo_id: id },
        data: { activo: false },
      });

      return {
        message: 'Costo fijo eliminado exitosamente',
        data: { id },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al eliminar el costo fijo: ${error.message}`);
    }
  }

  async getTiposCosto() {
    try {
      const tiposCosto = await this.prisma.tiposCosto.findMany({
        where: { es_fijo: true },
        select: {
          tipo_costo_id: true,
          nombre: true,
          descripcion: true,
        },
        orderBy: {
          nombre: 'asc',
        },
      });

      return {
        message: 'Tipos de costo obtenidos exitosamente',
        data: tiposCosto,
        total: tiposCosto.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener los tipos de costo: ${error.message}`);
    }
  }

  async calcularCostosMensuales(negocioId: number) {
    try {
      const costosFijos = await this.prisma.costosFijos.findMany({
        where: {
          negocio_id: negocioId,
          activo: true,
        },
        select: {
          monto: true,
          frecuencia: true,
        },
      });

      let totalMensual = 0;

      for (const costo of costosFijos) {
        let montoMensual = 0;
        
        switch (costo.frecuencia) {
          case 'mensual':
            montoMensual = Number(costo.monto);
            break;
          case 'semestral':
            montoMensual = Number(costo.monto) / 6;
            break;
          case 'anual':
            montoMensual = Number(costo.monto) / 12;
            break;
          default:
            montoMensual = Number(costo.monto);
        }
        
        totalMensual += montoMensual;
      }

      return {
        message: 'Costos mensuales calculados exitosamente',
        data: {
          totalMensual: Math.round(totalMensual * 100) / 100,
          totalAnual: Math.round(totalMensual * 12 * 100) / 100,
          costosDetallados: costosFijos,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Error al calcular los costos mensuales: ${error.message}`);
    }
  }
}
