import { config } from '../../../../config/environment';

export interface ProductoPrecioVenta {
  producto_id: number;
  nombre_producto: string;
  costo_total_producto: number;
  precio_venta_sugerido_ia: number;
  precio_venta_cliente: number;
  margen_ganancia_ia: number;
  margen_ganancia_real: number;
  ganancia_por_unidad: number;
}

export interface ResumenPreciosVenta {
  costo_total_productos: number;
  costo_total_adicionales: number;
  costo_total_general: number;
  precio_venta_total_sugerido: number;
  precio_venta_total_cliente: number;
  ganancia_total_sugerida: number;
  ganancia_total_real: number;
  margen_ganancia_promedio: number;
  productos: ProductoPrecioVenta[];
}

export interface ActualizarPrecioVentaRequest {
  producto_id: number;
  precio_venta_cliente: number;
  negocioId: number;
  comentario?: string;
}

export class ProductoPrecioVentaService {
  private baseUrl = config.api.apiV1;

  /**
   * Obtiene todos los productos con sus precios de venta para un negocio
   */
  async obtenerProductosPreciosVenta(negocioId: number): Promise<ResumenPreciosVenta> {
    try {
      const response = await fetch(`${this.baseUrl}/productos-precio-venta/negocio/${negocioId}`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener productos: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener productos con precios de venta:', error);
      throw error;
    }
  }

  /**
   * Actualiza el precio de venta del cliente para un producto específico
   */
  async actualizarPrecioVentaCliente(request: ActualizarPrecioVentaRequest): Promise<ProductoPrecioVenta> {
    try {
      const response = await fetch(`${this.baseUrl}/productos-precio-venta/actualizar-precio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar precio: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar precio de venta:', error);
      throw error;
    }
  }

  /**
   * Genera el resumen completo de costos y ganancias para un negocio
   */
  async generarResumenCostosGanancias(negocioId: number): Promise<{ message: string; success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/productos-precio-venta/generar-resumen/${negocioId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Error al generar resumen: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al generar resumen de costos y ganancias:', error);
      throw error;
    }
  }

  /**
   * Obtiene el resumen de costos y ganancias para un negocio
   */
  async obtenerResumenCostosGanancias(negocioId: number): Promise<ResumenPreciosVenta> {
    try {
      const response = await fetch(`${this.baseUrl}/productos-precio-venta/resumen/${negocioId}`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener resumen: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener resumen de costos y ganancias:', error);
      throw error;
    }
  }

  /**
   * Calcula el costo total de un producto específico
   */
  async calcularCostoTotalProducto(productoId: number, negocioId: number): Promise<{ costo_total: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/productos-precio-venta/producto/${productoId}/costo-total/${negocioId}`);
      
      if (!response.ok) {
        throw new Error(`Error al calcular costo total: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al calcular costo total del producto:', error);
      throw error;
    }
  }

  /**
   * Genera precio sugerido por IA para un producto
   */
  async generarPrecioSugeridoIA(
    productoId: number, 
    negocioId: number, 
    margen?: number
  ): Promise<{ precio_sugerido: number; margen_ganancia: number }> {
    try {
      const margenParam = margen ? `?margen=${margen}` : '';
      const response = await fetch(
        `${this.baseUrl}/productos-precio-venta/producto/${productoId}/precio-sugerido/${negocioId}${margenParam}`
      );
      
      if (!response.ok) {
        throw new Error(`Error al generar precio sugerido: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al generar precio sugerido por IA:', error);
      throw error;
    }
  }
}
