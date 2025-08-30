import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

export interface ProductoPrecioVenta {
  producto_id: number;
  nombre_producto: string;
  costo_total_producto: number;
  precio_venta_sugerido_ia: number;
  precio_venta_cliente: number;
  margen_ganancia_ia: number;
  margen_ganancia_real: number;
  ganancia_por_unidad: number;
  rentabilidad_producto: number;
}

export interface ResumenCostosGanancias {
  negocio_id: number;
  costo_total_productos: number;
  costo_total_adicionales: number;
  costo_total_general: number;
  precio_venta_total_sugerido: number;
  precio_venta_total_cliente: number;
  ganancia_total_sugerida: number;
  ganancia_total_real: number;
  margen_ganancia_promedio: number;
  rentabilidad_total_negocio: number;
  roi_estimado: number;
}

@Injectable()
export class ProductoPrecioVentaService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calcula el costo total de un producto incluyendo costos variables y adicionales
   */
  async calcularCostoTotalProducto(productoId: number, negocioId: number): Promise<number> {
    const producto = await this.prisma.productos.findFirst({
      where: { producto_id: productoId, negocio_id: negocioId },
      include: {
        CostosVariables: {
          where: { activo: true }
        }
      }
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
    }

    // Costo base del producto
    let costoTotal = Number(producto.costo_por_unidad);

    // Sumar costos variables asociados al producto
    const costosVariables = producto.CostosVariables.reduce((total, cv) => {
      return total + Number(cv.monto_por_unidad);
    }, 0);

    // Sumar costos adicionales (empaquetado, etc.)
    const costosAdicionales = await this.prisma.costosVariables.findMany({
      where: {
        negocio_id: negocioId,
        producto_id: null, // Costos generales del negocio
        activo: true
      }
    });

    const costosAdicionalesTotal = costosAdicionales.reduce((total, ca) => {
      return total + Number(ca.monto_por_unidad);
    }, 0);

    costoTotal += costosVariables + costosAdicionalesTotal;

    return costoTotal;
  }

  /**
   * Genera el precio de venta sugerido por IA basado en un margen estándar
   */
  async generarPrecioSugeridoIA(costoTotal: number, margenEstándar: number = 20): Promise<number> {
    const margenDecimal = margenEstándar / 100;
    const precioSugerido = costoTotal * (1 + margenDecimal);
    return Math.round(precioSugerido * 100) / 100; // Redondear a 2 decimales
  }

  /**
   * Calcula el margen de ganancia real basado en el precio del cliente
   */
  calcularMargenGananciaReal(costoTotal: number, precioCliente: number): number {
    if (precioCliente <= 0) return 0;
    const ganancia = precioCliente - costoTotal;
    const margen = (ganancia / precioCliente) * 100;
    return Math.round(margen * 100) / 100; // Redondear a 2 decimales
  }

  /**
   * Obtiene todos los productos con sus precios y análisis de rentabilidad
   */
  async obtenerProductosPreciosVenta(negocioId: number): Promise<ProductoPrecioVenta[]> {
    const productos = await this.prisma.productos.findMany({
      where: { negocio_id: negocioId },
      include: {
        CostosVariables: {
          where: { activo: true }
        }
      }
    });

    // Si no hay productos, retornar array vacío en lugar de fallar
    if (productos.length === 0) {
      return [];
    }

    const productosConPrecios = await Promise.all(
      productos.map(async (producto) => {
        const costoTotal = await this.calcularCostoTotalProducto(producto.producto_id, negocioId);
        const precioSugeridoIA = await this.generarPrecioSugeridoIA(costoTotal);
        
        // Usar precio_por_unidad como precio del cliente por ahora
        const precioCliente = Number(producto.precio_por_unidad) || precioSugeridoIA;
        const margenReal = this.calcularMargenGananciaReal(costoTotal, precioCliente);
        const ganancia = precioCliente - costoTotal;

        return {
          producto_id: producto.producto_id,
          nombre_producto: producto.nombre_producto,
          costo_total_producto: costoTotal,
          precio_venta_sugerido_ia: precioSugeridoIA,
          precio_venta_cliente: precioCliente,
          margen_ganancia_ia: 20, // Margen estándar del 20%
          margen_ganancia_real: margenReal,
          ganancia_por_unidad: ganancia,
          rentabilidad_producto: margenReal
        };
      })
    );

    return productosConPrecios;
  }

  /**
   * Actualiza el precio de venta del cliente para un producto específico
   */
  async actualizarPrecioVentaCliente(
    productoId: number, 
    negocioId: number, 
    nuevoPrecio: number
  ): Promise<ProductoPrecioVenta> {
    if (nuevoPrecio <= 0) {
      throw new BadRequestException('El precio debe ser mayor a 0');
    }

    // Verificar que el producto existe y pertenece al negocio
    const producto = await this.prisma.productos.findFirst({
      where: { producto_id: productoId, negocio_id: negocioId }
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${productoId} no encontrado`);
    }

    // Actualizar el precio en la base de datos (usando precio_por_unidad por ahora)
    await this.prisma.productos.update({
      where: { producto_id: productoId },
      data: {
        precio_por_unidad: new Decimal(nuevoPrecio)
      }
    });

    // Retornar el producto actualizado
    const costoTotal = await this.calcularCostoTotalProducto(productoId, negocioId);
    const precioSugeridoIA = await this.generarPrecioSugeridoIA(costoTotal);
    const margenReal = this.calcularMargenGananciaReal(costoTotal, nuevoPrecio);
    const ganancia = nuevoPrecio - costoTotal;

    return {
      producto_id: productoId,
      nombre_producto: producto.nombre_producto,
      costo_total_producto: costoTotal,
      precio_venta_sugerido_ia: precioSugeridoIA,
      precio_venta_cliente: nuevoPrecio,
      margen_ganancia_ia: 20,
      margen_ganancia_real: margenReal,
      ganancia_por_unidad: ganancia,
      rentabilidad_producto: margenReal
    };
  }

  /**
   * Genera el resumen general de costos y ganancias del negocio
   */
  async generarResumenCostosGanancias(negocioId: number): Promise<ResumenCostosGanancias> {
    const productos = await this.obtenerProductosPreciosVenta(negocioId);
    
    // Calcular costos adicionales del negocio (siempre se calculan)
    const costosAdicionales = await this.prisma.costosVariables.findMany({
      where: {
        negocio_id: negocioId,
        producto_id: null,
        activo: true
      }
    });

    const costoTotalAdicionales = costosAdicionales.reduce((sum, ca) => {
      return sum + Number(ca.monto_por_unidad);
    }, 0);

    // Si no hay productos, crear un resumen solo con costos adicionales
    if (productos.length === 0) {
      return {
        negocio_id: negocioId,
        costo_total_productos: 0,
        costo_total_adicionales: costoTotalAdicionales,
        costo_total_general: costoTotalAdicionales,
        precio_venta_total_sugerido: 0,
        precio_venta_total_cliente: 0,
        ganancia_total_sugerida: 0,
        ganancia_total_real: 0,
        margen_ganancia_promedio: 0,
        rentabilidad_total_negocio: 0,
        roi_estimado: 0
      };
    }

    // Calcular totales cuando hay productos
    const costoTotalProductos = productos.reduce((sum, p) => sum + p.costo_total_producto, 0);
    const precioTotalSugerido = productos.reduce((sum, p) => sum + p.precio_venta_sugerido_ia, 0);
    const precioTotalCliente = productos.reduce((sum, p) => sum + p.precio_venta_cliente, 0);
    const gananciaTotalSugerida = precioTotalSugerido - costoTotalProductos;
    const gananciaTotalReal = precioTotalCliente - costoTotalProductos;

    const costoTotalGeneral = costoTotalProductos + costoTotalAdicionales;

    // Calcular métricas de rentabilidad
    const margenGananciaPromedio = productos.reduce((sum, p) => sum + p.margen_ganancia_real, 0) / productos.length;
    const rentabilidadTotal = precioTotalCliente > 0 ? ((gananciaTotalReal / precioTotalCliente) * 100) : 0;
    const roiEstimado = costoTotalGeneral > 0 ? ((gananciaTotalReal / costoTotalGeneral) * 100) : 0;

    return {
      negocio_id: negocioId,
      costo_total_productos: costoTotalProductos,
      costo_total_adicionales: costoTotalAdicionales,
      costo_total_general: costoTotalGeneral,
      precio_venta_total_sugerido: precioTotalSugerido,
      precio_venta_total_cliente: precioTotalCliente,
      ganancia_total_sugerida: gananciaTotalSugerida,
      ganancia_total_real: gananciaTotalReal,
      margen_ganancia_promedio: margenGananciaPromedio,
      rentabilidad_total_negocio: rentabilidadTotal,
      roi_estimado: roiEstimado
    };
  }

  /**
   * Obtiene el análisis completo de precios para un negocio
   */
  async obtenerAnalisisCompletoPrecios(negocioId: number) {
    const productos = await this.obtenerProductosPreciosVenta(negocioId);
    const resumen = await this.generarResumenCostosGanancias(negocioId);

    return {
      productos,
      resumen,
      fecha_analisis: new Date(),
      total_productos: productos.length
    };
  }
}
