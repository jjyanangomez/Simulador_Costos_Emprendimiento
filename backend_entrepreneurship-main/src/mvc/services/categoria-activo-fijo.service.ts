import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateCategoriaActivoFijoDto } from '../models/dto/create-categoria-activo-fijo.dto';
import { UpdateCategoriaActivoFijoDto } from '../models/dto/update-categoria-activo-fijo.dto';
import { CategoriaActivoFijoWithCount, CategoriaActivoFijoWithCountAndCostos } from '../models/entities/categoria-activo-fijo.entity';

@Injectable()
export class CategoriaActivoFijoService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crear una nueva categoría de activo fijo
   */
  async create(createCategoriaDto: CreateCategoriaActivoFijoDto): Promise<{ message: string; data: any }> {
    try {
      // Verificar que el nombre no exista
      const categoriaExistente = await this.prisma.categoriaActivoFijo.findUnique({
        where: { nombre: createCategoriaDto.nombre },
      });

      if (categoriaExistente) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }

      // Crear la categoría
      const categoria = await this.prisma.categoriaActivoFijo.create({
        data: {
          nombre: createCategoriaDto.nombre,
          descripcion: createCategoriaDto.descripcion,
          icono: createCategoriaDto.icono,
          color: createCategoriaDto.color,
          activo: createCategoriaDto.activo ?? true,
          fecha_creacion: new Date(),
        },
      });

      return {
        message: 'Categoría de activo fijo creada exitosamente',
        data: categoria,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Error al crear la categoría: ${error.message}`);
    }
  }

  /**
   * Obtener todas las categorías de activo fijo
   */
  async findAll(): Promise<CategoriaActivoFijoWithCount> {
    try {
      const categorias = await this.prisma.categoriaActivoFijo.findMany({
        orderBy: {
          nombre: 'asc',
        },
      });

      return {
        message: 'Categorías obtenidas exitosamente',
        data: categorias,
        total: categorias.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener las categorías: ${error.message}`);
    }
  }

  /**
   * Obtener solo las categorías activas
   */
  async findActive(): Promise<CategoriaActivoFijoWithCount> {
    try {
      const categorias = await this.prisma.categoriaActivoFijo.findMany({
        where: {
          activo: true,
        },
        orderBy: {
          nombre: 'asc',
        },
      });

      return {
        message: 'Categorías activas obtenidas exitosamente',
        data: categorias,
        total: categorias.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener las categorías activas: ${error.message}`);
    }
  }

  /**
   * Obtener una categoría por ID
   */
  async findById(id: number): Promise<{ message: string; data: any }> {
    try {
      const categoria = await this.prisma.categoriaActivoFijo.findUnique({
        where: { categoria_id: id },
        include: {
          CostosFijos: {
            select: {
              costo_fijo_id: true,
              nombre: true,
              monto: true,
              activo: true,
            },
            where: {
              activo: true,
            },
          },
        },
      });

      if (!categoria) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
      }

      return {
        message: 'Categoría obtenida exitosamente',
        data: categoria,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener la categoría: ${error.message}`);
    }
  }

  /**
   * Obtener una categoría por nombre
   */
  async findByName(nombre: string): Promise<{ message: string; data: any }> {
    try {
      const categoria = await this.prisma.categoriaActivoFijo.findUnique({
        where: { nombre },
      });

      if (!categoria) {
        throw new NotFoundException(`Categoría con nombre "${nombre}" no encontrada`);
      }

      return {
        message: 'Categoría obtenida exitosamente',
        data: categoria,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener la categoría: ${error.message}`);
    }
  }

  /**
   * Buscar categorías por término de búsqueda
   */
  async search(searchTerm: string): Promise<CategoriaActivoFijoWithCount> {
    try {
      const categorias = await this.prisma.categoriaActivoFijo.findMany({
        where: {
          OR: [
            {
              nombre: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              descripcion: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        },
        orderBy: {
          nombre: 'asc',
        },
      });

      return {
        message: `Búsqueda completada para "${searchTerm}"`,
        data: categorias,
        total: categorias.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error en la búsqueda: ${error.message}`);
    }
  }

  /**
   * Actualizar una categoría
   */
  async update(id: number, updateCategoriaDto: UpdateCategoriaActivoFijoDto): Promise<{ message: string; data: any }> {
    try {
      // Verificar que la categoría existe
      const categoriaExistente = await this.prisma.categoriaActivoFijo.findUnique({
        where: { categoria_id: id },
      });

      if (!categoriaExistente) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
      }

      // Si se está cambiando el nombre, verificar que no exista otro con ese nombre
      if (updateCategoriaDto.nombre && updateCategoriaDto.nombre !== categoriaExistente.nombre) {
        const categoriaConMismoNombre = await this.prisma.categoriaActivoFijo.findUnique({
          where: { nombre: updateCategoriaDto.nombre },
        });

        if (categoriaConMismoNombre) {
          throw new ConflictException('Ya existe una categoría con ese nombre');
        }
      }

      // Actualizar la categoría
      const categoriaActualizada = await this.prisma.categoriaActivoFijo.update({
        where: { categoria_id: id },
        data: updateCategoriaDto,
      });

      return {
        message: 'Categoría actualizada exitosamente',
        data: categoriaActualizada,
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(`Error al actualizar la categoría: ${error.message}`);
    }
  }

  /**
   * Cambiar el estado activo/inactivo de una categoría
   */
  async toggleStatus(id: number): Promise<{ message: string; data: any }> {
    try {
      const categoria = await this.prisma.categoriaActivoFijo.findUnique({
        where: { categoria_id: id },
      });

      if (!categoria) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
      }

      const nuevaCategoria = await this.prisma.categoriaActivoFijo.update({
        where: { categoria_id: id },
        data: {
          activo: !categoria.activo,
        },
      });

      return {
        message: `Categoría ${nuevaCategoria.activo ? 'activada' : 'desactivada'} exitosamente`,
        data: nuevaCategoria,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al cambiar el estado de la categoría: ${error.message}`);
    }
  }

  /**
   * Eliminar una categoría (solo si no tiene costos fijos asociados)
   */
  async remove(id: number): Promise<{ message: string }> {
    try {
      // Verificar que la categoría existe
      const categoria = await this.prisma.categoriaActivoFijo.findUnique({
        where: { categoria_id: id },
        include: {
          CostosFijos: {
            select: {
              costo_fijo_id: true,
            },
          },
        },
      });

      if (!categoria) {
        throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
      }

      // Verificar que no tenga costos fijos asociados
      if (categoria.CostosFijos.length > 0) {
        throw new BadRequestException(
          `No se puede eliminar la categoría porque tiene ${categoria.CostosFijos.length} costos fijos asociados`
        );
      }

      // Eliminar la categoría
      await this.prisma.categoriaActivoFijo.delete({
        where: { categoria_id: id },
      });

      return {
        message: 'Categoría eliminada exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Error al eliminar la categoría: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas de las categorías
   */
  async getStats(): Promise<{ message: string; data: any }> {
    try {
      const [totalCategorias, categoriasActivas, categoriasInactivas] = await Promise.all([
        this.prisma.categoriaActivoFijo.count(),
        this.prisma.categoriaActivoFijo.count({ where: { activo: true } }),
        this.prisma.categoriaActivoFijo.count({ where: { activo: false } }),
      ]);

      // Obtener categorías con más costos fijos
      const categoriasConMasCostos = await this.prisma.categoriaActivoFijo.findMany({
        select: {
          categoria_id: true,
          nombre: true,
          icono: true,
          color: true,
          _count: {
            select: {
              CostosFijos: true,
            },
          },
        },
        orderBy: {
          CostosFijos: {
            _count: 'desc',
          },
        },
        take: 5,
      });

      return {
        message: 'Estadísticas obtenidas exitosamente',
        data: {
          total: totalCategorias,
          activas: categoriasActivas,
          inactivas: categoriasInactivas,
          topCategorias: categoriasConMasCostos,
        },
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Obtener categorías con sus costos fijos asociados
   */
  async findWithCostosFijos(): Promise<CategoriaActivoFijoWithCountAndCostos> {
    try {
      const categorias = await this.prisma.categoriaActivoFijo.findMany({
        include: {
          CostosFijos: {
            where: {
              activo: true,
            },
            select: {
              costo_fijo_id: true,
              nombre: true,
              monto: true,
              negocio_id: true,
            },
          },
        },
        orderBy: {
          nombre: 'asc',
        },
      });

      return {
        message: 'Categorías con costos fijos obtenidas exitosamente',
        data: categorias,
        total: categorias.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener categorías con costos fijos: ${error.message}`);
    }
  }

  /**
   * Obtener categorías por negocio específico
   */
  async findByNegocioId(negocioId: number): Promise<CategoriaActivoFijoWithCountAndCostos> {
    try {
      // Verificar que el negocio existe
      const negocio = await this.prisma.negocios.findUnique({
        where: { negocio_id: negocioId },
      });

      if (!negocio) {
        throw new NotFoundException(`Negocio con ID ${negocioId} no encontrado`);
      }

      // Obtener categorías que tienen costos fijos en este negocio
      const categorias = await this.prisma.categoriaActivoFijo.findMany({
        where: {
          CostosFijos: {
            some: {
              negocio_id: negocioId,
              activo: true,
            },
          },
          activo: true,
        },
        include: {
          CostosFijos: {
            where: {
              negocio_id: negocioId,
              activo: true,
            },
            select: {
              costo_fijo_id: true,
              nombre: true,
              monto: true,
              frecuencia: true,
              fecha_inicio: true,
            },
          },
        },
        orderBy: {
          nombre: 'asc',
        },
      });

      // Calcular totales por categoría
      const categoriasConTotales = categorias.map(categoria => ({
        ...categoria,
        total_costos: categoria.CostosFijos.length,
        monto_total: categoria.CostosFijos.reduce((sum, costo) => sum + Number(costo.monto), 0),
      }));

      return {
        message: `Categorías del negocio ${negocio.nombre_negocio} obtenidas exitosamente`,
        data: categoriasConTotales,
        total: categoriasConTotales.length,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener categorías del negocio: ${error.message}`);
    }
  }

  /**
   * Obtener resumen de categorías por negocio
   */
  async getResumenByNegocio(negocioId: number): Promise<{ message: string; data: any }> {
    try {
      // Verificar que el negocio existe
      const negocio = await this.prisma.negocios.findUnique({
        where: { negocio_id: negocioId },
      });

      if (!negocio) {
        throw new NotFoundException(`Negocio con ID ${negocioId} no encontrado`);
      }

      // Obtener resumen de costos por categoría
      const resumen = await this.prisma.categoriaActivoFijo.findMany({
        where: {
          CostosFijos: {
            some: {
              negocio_id: negocioId,
              activo: true,
            },
          },
          activo: true,
        },
        select: {
          categoria_id: true,
          nombre: true,
          icono: true,
          color: true,
          _count: {
            select: {
              CostosFijos: {
                where: {
                  negocio_id: negocioId,
                  activo: true,
                },
              },
            },
          },
          CostosFijos: {
            where: {
              negocio_id: negocioId,
              activo: true,
            },
            select: {
              monto: true,
            },
          },
        },
        orderBy: {
          nombre: 'asc',
        },
      });

      // Calcular totales y porcentajes
      const totalGeneral = resumen.reduce((sum, cat) => {
        const totalCategoria = cat.CostosFijos.reduce((catSum, costo) => catSum + Number(costo.monto), 0);
        return sum + totalCategoria;
      }, 0);

      const resumenConPorcentajes = resumen.map(categoria => {
        const totalCategoria = categoria.CostosFijos.reduce((sum, costo) => sum + Number(costo.monto), 0);
        const porcentaje = totalGeneral > 0 ? (totalCategoria / totalGeneral) * 100 : 0;
        
        return {
          categoria_id: categoria.categoria_id,
          nombre: categoria.nombre,
          icono: categoria.icono,
          color: categoria.color,
          total_costos: categoria._count.CostosFijos,
          monto_total: totalCategoria,
          porcentaje: Math.round(porcentaje * 100) / 100, // Redondear a 2 decimales
        };
      });

      return {
        message: `Resumen de categorías del negocio ${negocio.nombre_negocio} obtenido exitosamente`,
        data: {
          negocio: {
            negocio_id: negocio.negocio_id,
            nombre: negocio.nombre_negocio,
          },
          categorias: resumenConPorcentajes,
          total_general: totalGeneral,
          total_categorias: resumenConPorcentajes.length,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener resumen del negocio: ${error.message}`);
    }
  }
}
