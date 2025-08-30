import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateCostoVariableDto } from '../models/dto/create-costo-variable.dto';
import { UpdateCostoVariableDto } from '../models/dto/update-costo-variable.dto';

@Injectable()
export class CostosVariablesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCostoVariableDto: CreateCostoVariableDto) {
    try {
      const costoVariable = await this.prisma.costosVariables.create({
        data: {
          negocio_id: createCostoVariableDto.negocioId,
          producto_id: createCostoVariableDto.productoId,
          receta_id: createCostoVariableDto.recetaId,
          tipo_costo_id: createCostoVariableDto.tipoCostoId,
          nombre: createCostoVariableDto.nombre,
          descripcion: createCostoVariableDto.descripcion,
          monto_por_unidad: createCostoVariableDto.montoPorUnidad,
          unidad_medida_id: createCostoVariableDto.unidadMedidaId,
        },
        include: {
          TiposCosto: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
          UnidadMedida: {
            select: {
              nombre: true,
              abreviatura: true,
            },
          },
        },
      });

      return {
        message: 'Costo variable creado exitosamente',
        data: costoVariable,
      };
    } catch (error) {
      throw new BadRequestException(`Error al crear el costo variable: ${error.message}`);
    }
  }

  async findByNegocioId(negocioId: number) {
    try {
      const costosVariables = await this.prisma.costosVariables.findMany({
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
          UnidadMedida: {
            select: {
              nombre: true,
              abreviatura: true,
            },
          },
        },
        orderBy: {
          nombre: 'asc',
        },
      });

      return {
        message: 'Costos variables obtenidos exitosamente',
        data: costosVariables,
        total: costosVariables.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener los costos variables: ${error.message}`);
    }
  }

  async getTotalByNegocioId(negocioId: number) {
    try {
      const costosVariables = await this.prisma.costosVariables.findMany({
        where: {
          negocio_id: negocioId,
          activo: true,
        },
        select: {
          monto_por_unidad: true,
        },
      });

      // Calcular total sumando todos los montos por unidad
      const total = costosVariables.reduce((sum, costo) => {
        return sum + Number(costo.monto_por_unidad);
      }, 0);

      return {
        message: 'Total de costos variables calculado exitosamente',
        total: total,
        count: costosVariables.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error al calcular el total de costos variables: ${error.message}`);
    }
  }

  async findById(id: number) {
    try {
      const costoVariable = await this.prisma.costosVariables.findUnique({
        where: { costo_variable_id: id },
        include: {
          TiposCosto: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
          UnidadMedida: {
            select: {
              nombre: true,
              abreviatura: true,
            },
          },
        },
      });

      if (!costoVariable) {
        throw new NotFoundException('Costo variable no encontrado');
      }

      return {
        message: 'Costo variable encontrado exitosamente',
        data: costoVariable,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener el costo variable: ${error.message}`);
    }
  }

  async update(id: number, updateCostoVariableDto: UpdateCostoVariableDto) {
    try {
      // Verificar que el costo variable existe
      const costoVariableExistente = await this.prisma.costosVariables.findUnique({
        where: { costo_variable_id: id },
      });

      if (!costoVariableExistente) {
        throw new NotFoundException('Costo variable no encontrado');
      }

      // Preparar datos para actualización
      const updateData: any = {};
      
      if (updateCostoVariableDto.nombre !== undefined) updateData.nombre = updateCostoVariableDto.nombre;
      if (updateCostoVariableDto.descripcion !== undefined) updateData.descripcion = updateCostoVariableDto.descripcion;
      if (updateCostoVariableDto.montoPorUnidad !== undefined) updateData.monto_por_unidad = updateCostoVariableDto.montoPorUnidad;
      if (updateCostoVariableDto.unidadMedidaId !== undefined) updateData.unidad_medida_id = updateCostoVariableDto.unidadMedidaId;

      // Actualizar el costo variable
      const costoVariableActualizado = await this.prisma.costosVariables.update({
        where: { costo_variable_id: id },
        data: updateData,
        include: {
          TiposCosto: {
            select: {
              nombre: true,
              descripcion: true,
            },
          },
          UnidadMedida: {
            select: {
              nombre: true,
              abreviatura: true,
            },
          },
        },
      });

      return {
        message: 'Costo variable actualizado exitosamente',
        data: costoVariableActualizado,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al actualizar el costo variable: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      // Verificar que el costo variable existe
      const costoVariableExistente = await this.prisma.costosVariables.findUnique({
        where: { costo_variable_id: id },
      });

      if (!costoVariableExistente) {
        throw new NotFoundException('Costo variable no encontrado');
      }

      // Eliminar el costo variable
      await this.prisma.costosVariables.delete({
        where: { costo_variable_id: id },
      });

      return {
        message: 'Costo variable eliminado exitosamente',
        data: { id },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al eliminar el costo variable: ${error.message}`);
    }
  }
}
