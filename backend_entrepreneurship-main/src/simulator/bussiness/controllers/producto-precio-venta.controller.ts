import { Controller, Get, Put, Param, Body, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductoPrecioVentaService } from '../services/producto-precio-venta.service';

export interface ActualizarPrecioVentaDto {
  precio_venta_cliente: number;
}

@Controller('productos-precio-venta')
export class ProductoPrecioVentaController {
  constructor(
    private readonly productoPrecioVentaService: ProductoPrecioVentaService
  ) {}

  /**
   * Obtiene todos los productos con sus precios y análisis de rentabilidad
   */
  @Get(':negocioId')
  @HttpCode(HttpStatus.OK)
  async obtenerProductosPreciosVenta(
    @Param('negocioId', ParseIntPipe) negocioId: number
  ) {
    try {
      const productos = await this.productoPrecioVentaService.obtenerProductosPreciosVenta(negocioId);
      return {
        success: true,
        data: productos,
        message: 'Productos con precios obtenidos exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al obtener productos con precios'
      };
    }
  }

  /**
   * Actualiza el precio de venta del cliente para un producto específico
   */
  @Put(':negocioId/producto/:productoId')
  @HttpCode(HttpStatus.OK)
  async actualizarPrecioVentaCliente(
    @Param('negocioId', ParseIntPipe) negocioId: number,
    @Param('productoId', ParseIntPipe) productoId: number,
    @Body() dto: ActualizarPrecioVentaDto
  ) {
    try {
      const productoActualizado = await this.productoPrecioVentaService.actualizarPrecioVentaCliente(
        productoId,
        negocioId,
        dto.precio_venta_cliente
      );

      return {
        success: true,
        data: productoActualizado,
        message: 'Precio de venta actualizado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al actualizar precio de venta'
      };
    }
  }

  /**
   * Genera el resumen general de costos y ganancias del negocio
   */
  @Get(':negocioId/resumen')
  @HttpCode(HttpStatus.OK)
  async generarResumenCostosGanancias(
    @Param('negocioId', ParseIntPipe) negocioId: number
  ) {
    try {
      const resumen = await this.productoPrecioVentaService.generarResumenCostosGanancias(negocioId);
      
      return {
        success: true,
        data: resumen,
        message: 'Resumen de costos y ganancias generado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al generar resumen de costos y ganancias'
      };
    }
  }

  /**
   * Obtiene el análisis completo de precios para un negocio
   */
  @Get(':negocioId/analisis-completo')
  @HttpCode(HttpStatus.OK)
  async obtenerAnalisisCompletoPrecios(
    @Param('negocioId', ParseIntPipe) negocioId: number
  ) {
    try {
      const analisis = await this.productoPrecioVentaService.obtenerAnalisisCompletoPrecios(negocioId);
      
      return {
        success: true,
        data: analisis,
        message: 'Análisis completo de precios obtenido exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al obtener análisis completo de precios'
      };
    }
  }

  /**
   * Calcula el costo total de un producto específico
   */
  @Get(':negocioId/producto/:productoId/costo-total')
  @HttpCode(HttpStatus.OK)
  async calcularCostoTotalProducto(
    @Param('negocioId', ParseIntPipe) negocioId: number,
    @Param('productoId', ParseIntPipe) productoId: number
  ) {
    try {
      const costoTotal = await this.productoPrecioVentaService.calcularCostoTotalProducto(productoId, negocioId);
      
      return {
        success: true,
        data: { costo_total: costoTotal },
        message: 'Costo total del producto calculado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al calcular costo total del producto'
      };
    }
  }

  /**
   * Genera el precio de venta sugerido por IA para un producto
   */
  @Get(':negocioId/producto/:productoId/precio-sugerido')
  @HttpCode(HttpStatus.OK)
  async generarPrecioSugeridoIA(
    @Param('negocioId', ParseIntPipe) negocioId: number,
    @Param('productoId', ParseIntPipe) productoId: number
  ) {
    try {
      const costoTotal = await this.productoPrecioVentaService.calcularCostoTotalProducto(productoId, negocioId);
      const precioSugerido = await this.productoPrecioVentaService.generarPrecioSugeridoIA(costoTotal);
      
      return {
        success: true,
        data: { 
          costo_total: costoTotal,
          precio_sugerido_ia: precioSugerido,
          margen_ganancia: 20
        },
        message: 'Precio sugerido por IA generado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: 'Error al generar precio sugerido por IA'
      };
    }
  }
}
