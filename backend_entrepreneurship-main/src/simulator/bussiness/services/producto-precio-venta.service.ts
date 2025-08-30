import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { 
  ActualizarPrecioVentaDto, 
  ProductoPrecioVentaResponseDto, 
  ResumenPreciosVentaDto 
} from '../dto/producto-precio-venta.dto';

@Injectable()
export class ProductoPrecioVentaService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calcula el costo total de un producto sumando costos variables y adicionales
   */
  async calcularCostoTotalProducto(productoId: number, negocioId: number): Promise<number> {
    try {
      // Obtener costos variables del producto
      const costosVariables = await this.prisma.costosVariables.findMany({
        where: {
          producto_id: productoId,
          negocio_id: negocioId,
          activo: true
        }
      });

      // Obtener costos adicionales (no asociados a productos específicos)
      const costosAdicionales = await this.prisma.costosVariables.findMany({
        where: {
          negocio_id: negocioId,
          producto_id: null,
          activo: true
        }
      });

      // Calcular costo total
      let costoTotal = 0;

      // Sumar costos variables del producto
      costosVariables.forEach(costo => {
        costoTotal += Number(costo.monto_por_unidad || 0);
      });

      // Sumar costos adicionales (distribuidos entre productos)
      const productosDelNegocio = await this.prisma.productos.count({
        where: { negocio_id: negocioId }
      });

      if (productosDelNegocio > 0) {
        costosAdicionales.forEach(costo => {
          costoTotal += Number(costo.monto_por_unidad || 0) / productosDelNegocio;
        });
      }

      return costoTotal;
    } catch (error) {
      throw new Error(`Error al calcular costo total del producto: ${error.message}`);
    }
  }

  /**
   * Calcula el margen de ganancia real basado en precio de venta y costo
   */
  calcularMargenGananciaReal(precioVenta: number, costoTotal: number): number {
    if (costoTotal <= 0) return 0;
    return ((precioVenta - costoTotal) / costoTotal) * 100;
  }

  /**
   * Genera precio de venta sugerido por IA con margen del 20%
   */
  generarPrecioSugeridoIA(costoTotal: number, margenGanancia: number = 20): number {
    return costoTotal * (1 + margenGanancia / 100);
  }

  /**
   * Obtiene todos los productos con sus precios de venta y análisis
   */
  async obtenerProductosPreciosVenta(negocioId: number): Promise<ResumenPreciosVentaDto> {
    try {
      const productos = await this.prisma.productos.findMany({
        where: { negocio_id: negocioId },
        include: {
          CostosVariables: {
            where: { activo: true },
          },
        },
      });

      const productosConPrecios: ProductoPrecioVentaResponseDto[] = [];
      let costoTotalProductos = 0;
      let precioVentaTotalSugerido = 0;
      let precioVentaTotalCliente = 0;
      let gananciaTotalSugerida = 0;
      let gananciaTotalReal = 0;

      for (const producto of productos) {
        // Calcular costo total del producto
        const costoTotal = await this.calcularCostoTotalProducto(producto.producto_id, negocioId);
        
        // Generar precio sugerido por IA
        const precioSugeridoIA = this.generarPrecioSugeridoIA(costoTotal);
        
        // Usar precio del cliente si existe, sino el sugerido por IA
        const precioCliente = Number(producto.precio_por_unidad || precioSugeridoIA);
        
        // Calcular márgenes y ganancias
        const margenGananciaIA = 20; // Margen estándar del 20%
        const margenGananciaReal = this.calcularMargenGananciaReal(precioCliente, costoTotal);
        const gananciaPorUnidad = precioCliente - costoTotal;

        productosConPrecios.push({
          producto_id: producto.producto_id,
          nombre_producto: producto.nombre_producto,
          costo_total_producto: costoTotal,
          precio_venta_sugerido_ia: precioSugeridoIA,
          precio_venta_cliente: precioCliente,
          margen_ganancia_ia: margenGananciaIA,
          margen_ganancia_real: margenGananciaReal,
          ganancia_por_unidad: gananciaPorUnidad,
        });

        // Acumular totales
        costoTotalProductos += costoTotal;
        precioVentaTotalSugerido += precioSugeridoIA;
        precioVentaTotalCliente += precioCliente;
        gananciaTotalSugerida += (precioSugeridoIA - costoTotal);
        gananciaTotalReal += gananciaPorUnidad;
      }

      // Calcular costo total de adicionales
      const costosAdicionales = await this.prisma.costosVariables.findMany({
        where: {
          negocio_id: negocioId,
          producto_id: null,
          activo: true,
        },
      });
      const costoTotalAdicionales = costosAdicionales.reduce((sum, costo) => sum + Number(costo.monto_por_unidad || 0), 0);

      // Calcular margen promedio
      const margenGananciaPromedio = productosConPrecios.length > 0 
        ? productosConPrecios.reduce((sum, p) => sum + p.margen_ganancia_real, 0) / productosConPrecios.length 
        : 0;

      return {
        costo_total_productos: costoTotalProductos,
        costo_total_adicionales: costoTotalAdicionales,
        costo_total_general: costoTotalProductos + costoTotalAdicionales,
        precio_venta_total_sugerido: precioVentaTotalSugerido,
        precio_venta_total_cliente: precioVentaTotalCliente,
        ganancia_total_sugerida: gananciaTotalSugerida,
        ganancia_total_real: gananciaTotalReal,
        margen_ganancia_promedio: margenGananciaPromedio,
        productos: productosConPrecios,
      };
    } catch (error) {
      throw new Error(`Error al obtener productos con precios de venta: ${error.message}`);
    }
  }

  /**
   * Actualiza el precio de venta del cliente para un producto específico
   */
  async actualizarPrecioVentaCliente(dto: ActualizarPrecioVentaDto, negocioId: number): Promise<ProductoPrecioVentaResponseDto> {
    try {
      // Verificar que el producto pertenece al negocio
      const producto = await this.prisma.productos.findFirst({
        where: {
          producto_id: dto.producto_id,
          negocio_id: negocioId,
        },
      });

      if (!producto) {
        throw new Error('Producto no encontrado o no pertenece al negocio');
      }

      // Calcular costo total del producto
      const costoTotal = await this.calcularCostoTotalProducto(dto.producto_id, negocioId);
      
      // Calcular nuevo margen de ganancia real
      const margenGananciaReal = this.calcularMargenGananciaReal(dto.precio_venta_cliente, costoTotal);
      
      // Calcular nueva ganancia por unidad
      const gananciaPorUnidad = dto.precio_venta_cliente - costoTotal;

      // Actualizar producto en la base de datos
      const productoActualizado = await this.prisma.productos.update({
        where: { producto_id: dto.producto_id },
        data: {
          precio_por_unidad: dto.precio_venta_cliente,
        },
      });

      return {
        producto_id: productoActualizado.producto_id,
        nombre_producto: productoActualizado.nombre_producto,
        costo_total_producto: costoTotal,
        precio_venta_sugerido_ia: this.generarPrecioSugeridoIA(costoTotal),
        precio_venta_cliente: dto.precio_venta_cliente,
        margen_ganancia_ia: 20,
        margen_ganancia_real: margenGananciaReal,
        ganancia_por_unidad: gananciaPorUnidad,
      };
    } catch (error) {
      throw new Error(`Error al actualizar precio de venta: ${error.message}`);
    }
  }

  /**
   * Obtiene el resumen de costos y ganancias para un negocio
   */
  async obtenerResumenCostosGanancias(negocioId: number) {
    try {
      return await this.obtenerProductosPreciosVenta(negocioId);
    } catch (error) {
      throw new Error(`Error al obtener resumen de costos y ganancias: ${error.message}`);
    }
  }
}
