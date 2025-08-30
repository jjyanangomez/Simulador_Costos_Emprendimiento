import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProductoPrecioVentaService } from '../services/producto-precio-venta.service';
import { ActualizarPrecioVentaDto, ProductoPrecioVentaResponseDto, ResumenPreciosVentaDto } from '../dto/producto-precio-venta.dto';

@Controller('api/productos-precio-venta')
export class ProductoPrecioVentaController {
  constructor(private readonly productoPrecioVentaService: ProductoPrecioVentaService) {}

  /**
   * Obtiene todos los productos con sus precios de venta para un negocio
   */
  @Get('negocio/:negocioId')
  async obtenerProductosPreciosVenta(
    @Param('negocioId') negocioId: string,
  ): Promise<ResumenPreciosVentaDto> {
    return this.productoPrecioVentaService.obtenerProductosPreciosVenta(Number(negocioId));
  }

  /**
   * Actualiza el precio de venta del cliente para un producto específico
   */
  @Put('actualizar-precio')
  async actualizarPrecioVentaCliente(
    @Body() dto: ActualizarPrecioVentaDto,
    @Body('negocioId') negocioId: number,
  ): Promise<ProductoPrecioVentaResponseDto> {
    return this.productoPrecioVentaService.actualizarPrecioVentaCliente(dto, negocioId);
  }

  /**
   * Genera el resumen completo de costos y ganancias para un negocio
   */
  @Post('generar-resumen/:negocioId')
  async generarResumenCostosGanancias(
    @Param('negocioId') negocioId: string,
  ): Promise<{ message: string; success: boolean }> {
    await this.productoPrecioVentaService.obtenerResumenCostosGanancias(Number(negocioId));
    return {
      message: 'Resumen de costos y ganancias generado exitosamente',
      success: true,
    };
  }

  /**
   * Obtiene el resumen de costos y ganancias para un negocio
   */
  @Get('resumen/:negocioId')
  async obtenerResumenCostosGanancias(
    @Param('negocioId') negocioId: string,
  ): Promise<any> {
    const resumen = await this.productoPrecioVentaService.obtenerProductosPreciosVenta(Number(negocioId));
    
    // Generar resumen en la base de datos
    await this.productoPrecioVentaService.obtenerResumenCostosGanancias(Number(negocioId));
    
    return resumen;
  }

  /**
   * Calcula el costo total de un producto específico
   */
  @Get('producto/:productoId/costo-total/:negocioId')
  async calcularCostoTotalProducto(
    @Param('productoId') productoId: string,
    @Param('negocioId') negocioId: string,
  ): Promise<{ costo_total: number }> {
    const costoTotal = await this.productoPrecioVentaService.calcularCostoTotalProducto(
      Number(productoId),
      Number(negocioId),
    );
    return { costo_total: costoTotal };
  }

  /**
   * Genera precio sugerido por IA para un producto
   */
  @Get('producto/:productoId/precio-sugerido/:negocioId')
  async generarPrecioSugeridoIA(
    @Param('productoId') productoId: string,
    @Param('negocioId') negocioId: string,
    @Param('margen') margen?: string,
  ): Promise<{ precio_sugerido: number; margen_ganancia: number }> {
    const costoTotal = await this.productoPrecioVentaService.calcularCostoTotalProducto(
      Number(productoId),
      Number(negocioId),
    );
    
    const margenGanancia = margen ? Number(margen) : 20;
    const precioSugerido = this.productoPrecioVentaService.generarPrecioSugeridoIA(costoTotal, margenGanancia);
    
    return {
      precio_sugerido: precioSugerido,
      margen_ganancia: margenGanancia,
    };
  }
}
