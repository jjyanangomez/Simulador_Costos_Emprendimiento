import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateProductoDto } from '../models/dto/create-producto.dto';
import { UpdateProductoDto } from '../models/dto/update-producto.dto';
import { CreateRecetaDto } from '../models/dto/create-receta.dto';
import { UpdateRecetaDto } from '../models/dto/update-receta.dto';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductoDto: CreateProductoDto) {
    try {
      // Verificar que el negocio existe
      const negocio = await this.prisma.negocios.findUnique({
        where: { negocio_id: createProductoDto.negocioId },
      });

      if (!negocio) {
        throw new NotFoundException('El negocio no existe');
      }

      // Verificar que la categoría existe
      const categoria = await this.prisma.categoriasProducto.findUnique({
        where: { categoria_id: createProductoDto.categoriaId },
      });

      if (!categoria) {
        throw new NotFoundException('La categoría del producto no existe');
      }

      // Verificar que la unidad de medida existe
      const unidadMedida = await this.prisma.unidadMedida.findUnique({
        where: { unidad_id: createProductoDto.unidadMedidaId },
      });

      if (!unidadMedida) {
        throw new NotFoundException('La unidad de medida no existe');
      }

      // Crear el producto
      const producto = await this.prisma.productos.create({
        data: {
          negocio_id: createProductoDto.negocioId,
          categoria_id: createProductoDto.categoriaId,
          unidad_medida_id: createProductoDto.unidadMedidaId,
          nombre_producto: createProductoDto.nombreProducto,
          precio_por_unidad: createProductoDto.precioPorUnidad,
          porcion_requerida: createProductoDto.porcionRequerida,
          porcion_unidad: createProductoDto.porcionUnidad,
          costo_por_unidad: createProductoDto.costoPorUnidad,
        },
        include: {
          Negocios: {
            select: {
              nombre_negocio: true,
            },
          },
          CategoriasProducto: {
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
        message: 'Producto creado exitosamente',
        data: producto,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al crear el producto: ${error.message}`);
    }
  }

  async findByNegocioId(negocioId: number) {
    try {
      const productos = await this.prisma.productos.findMany({
        where: {
          negocio_id: negocioId,
        },
        include: {
          CategoriasProducto: {
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
          Recetas: {
            select: {
              receta_id: true,
              nombre_receta: true,
              tiempo_preparacion: true,
              personal_requerido: true,
              costos_adicionales: true,
              precio_venta: true,
            },
          },
        },
        orderBy: {
          nombre_producto: 'asc',
        },
      });

      return {
        message: 'Productos obtenidos exitosamente',
        data: productos,
        total: productos.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener los productos: ${error.message}`);
    }
  }

  async findById(id: number) {
    try {
      const producto = await this.prisma.productos.findUnique({
        where: { producto_id: id },
        include: {
          Negocios: {
            select: {
              nombre_negocio: true,
            },
          },
          CategoriasProducto: {
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
          Recetas: {
            select: {
              receta_id: true,
              nombre_receta: true,
              tiempo_preparacion: true,
              personal_requerido: true,
              costos_adicionales: true,
              precio_venta: true,
            },
          },
        },
      });

      if (!producto) {
        throw new NotFoundException('Producto no encontrado');
      }

      return {
        message: 'Producto encontrado exitosamente',
        data: producto,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener el producto: ${error.message}`);
    }
  }

  async update(id: number, updateProductoDto: UpdateProductoDto) {
    try {
      // Verificar que el producto existe
      const productoExistente = await this.prisma.productos.findUnique({
        where: { producto_id: id },
      });

      if (!productoExistente) {
        throw new NotFoundException('Producto no encontrado');
      }

      // Preparar datos para actualización
      const updateData: any = {};
      
      if (updateProductoDto.nombreProducto !== undefined) updateData.nombre_producto = updateProductoDto.nombreProducto;
      if (updateProductoDto.precioPorUnidad !== undefined) updateData.precio_por_unidad = updateProductoDto.precioPorUnidad;
      if (updateProductoDto.porcionRequerida !== undefined) updateData.porcion_requerida = updateProductoDto.porcionRequerida;
      if (updateProductoDto.porcionUnidad !== undefined) updateData.porcion_unidad = updateProductoDto.porcionUnidad;
      if (updateProductoDto.costoPorUnidad !== undefined) updateData.costo_por_unidad = updateProductoDto.costoPorUnidad;

      // Actualizar el producto
      const productoActualizado = await this.prisma.productos.update({
        where: { producto_id: id },
        data: updateData,
        include: {
          Negocios: {
            select: {
              nombre_negocio: true,
            },
          },
          CategoriasProducto: {
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
        message: 'Producto actualizado exitosamente',
        data: productoActualizado,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al actualizar el producto: ${error.message}`);
    }
  }

  async remove(id: number) {
    try {
      // Verificar que el producto existe
      const productoExistente = await this.prisma.productos.findUnique({
        where: { producto_id: id },
      });

      if (!productoExistente) {
        throw new NotFoundException('Producto no encontrado');
      }

      // Eliminar el producto (esto también eliminará las recetas relacionadas por CASCADE)
      await this.prisma.productos.delete({
        where: { producto_id: id },
      });

      return {
        message: 'Producto eliminado exitosamente',
        data: { id },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al eliminar el producto: ${error.message}`);
    }
  }

  async getCategorias() {
    try {
      const categorias = await this.prisma.categoriasProducto.findMany({
        select: {
          categoria_id: true,
          nombre: true,
          descripcion: true,
        },
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

  async getUnidadesMedida() {
    try {
      const unidadesMedida = await this.prisma.unidadMedida.findMany({
        select: {
          unidad_id: true,
          nombre: true,
          abreviatura: true,
        },
        orderBy: {
          nombre: 'asc',
        },
      });

      return {
        message: 'Unidades de medida obtenidas exitosamente',
        data: unidadesMedida,
        total: unidadesMedida.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener las unidades de medida: ${error.message}`);
    }
  }

  // Métodos para recetas
  async createReceta(createRecetaDto: CreateRecetaDto) {
    try {
      // Verificar que el producto existe
      const producto = await this.prisma.productos.findUnique({
        where: { producto_id: createRecetaDto.productoId },
      });

      if (!producto) {
        throw new NotFoundException('El producto no existe');
      }

      // Crear la receta
      const receta = await this.prisma.recetas.create({
        data: {
          producto_id: createRecetaDto.productoId,
          nombre_receta: createRecetaDto.nombreReceta,
          tiempo_preparacion: createRecetaDto.tiempoPreparacion,
          personal_requerido: createRecetaDto.personalRequerido,
          costos_adicionales: createRecetaDto.costosAdicionales,
          precio_venta: createRecetaDto.precioVenta,
        },
        include: {
          Productos: {
            select: {
              nombre_producto: true,
            },
          },
        },
      });

      return {
        message: 'Receta creada exitosamente',
        data: receta,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al crear la receta: ${error.message}`);
    }
  }

  async findRecetasByProductoId(productoId: number) {
    try {
      const recetas = await this.prisma.recetas.findMany({
        where: {
          producto_id: productoId,
        },
        include: {
          Productos: {
            select: {
              nombre_producto: true,
            },
          },
        },
        orderBy: {
          nombre_receta: 'asc',
        },
      });

      return {
        message: 'Recetas obtenidas exitosamente',
        data: recetas,
        total: recetas.length,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener las recetas: ${error.message}`);
    }
  }

  async findRecetaById(id: number) {
    try {
      const receta = await this.prisma.recetas.findUnique({
        where: { receta_id: id },
        include: {
          Productos: {
            select: {
              nombre_producto: true,
            },
          },
        },
      });

      if (!receta) {
        throw new NotFoundException('Receta no encontrada');
      }

      return {
        message: 'Receta encontrada exitosamente',
        data: receta,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al obtener la receta: ${error.message}`);
    }
  }

  async updateReceta(id: number, updateRecetaDto: UpdateRecetaDto) {
    try {
      // Verificar que la receta existe
      const recetaExistente = await this.prisma.recetas.findUnique({
        where: { receta_id: id },
      });

      if (!recetaExistente) {
        throw new NotFoundException('Receta no encontrada');
      }

      // Preparar datos para actualización
      const updateData: any = {};
      
      if (updateRecetaDto.nombreReceta !== undefined) updateData.nombre_receta = updateRecetaDto.nombreReceta;
      if (updateRecetaDto.tiempoPreparacion !== undefined) updateData.tiempo_preparacion = updateRecetaDto.tiempoPreparacion;
      if (updateRecetaDto.personalRequerido !== undefined) updateData.personal_requerido = updateRecetaDto.personalRequerido;
      if (updateRecetaDto.costosAdicionales !== undefined) updateData.costos_adicionales = updateRecetaDto.costosAdicionales;
      if (updateRecetaDto.precioVenta !== undefined) updateData.precio_venta = updateRecetaDto.precioVenta;

      // Actualizar la receta
      const recetaActualizada = await this.prisma.recetas.update({
        where: { receta_id: id },
        data: updateData,
        include: {
          Productos: {
            select: {
              nombre_producto: true,
            },
          },
        },
      });

      return {
        message: 'Receta actualizada exitosamente',
        data: recetaActualizada,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al actualizar la receta: ${error.message}`);
    }
  }

  async removeReceta(id: number) {
    try {
      // Verificar que la receta existe
      const recetaExistente = await this.prisma.recetas.findUnique({
        where: { receta_id: id },
      });

      if (!recetaExistente) {
        throw new NotFoundException('Receta no encontrada');
      }

      // Eliminar la receta
      await this.prisma.recetas.delete({
        where: { receta_id: id },
      });

      return {
        message: 'Receta eliminada exitosamente',
        data: { id },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(`Error al eliminar la receta: ${error.message}`);
    }
  }
}
