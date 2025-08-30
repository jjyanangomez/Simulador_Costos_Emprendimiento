import { apiService } from '../../../../shared/infrastructure/services/api.service';

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

export class PrecioVentaService {
  static async obtenerAnalisisCompleto(negocioId: number) {
    const response = await apiService.get(`/api/v1/productos-precio-venta/${negocioId}/analisis-completo`);
    return response.data;
  }

  static async actualizarPrecioCliente(negocioId: number, productoId: number, nuevoPrecio: number) {
    const response = await apiService.put(
      `/api/v1/productos-precio-venta/${negocioId}/producto/${productoId}`,
      { precio_venta_cliente: nuevoPrecio }
    );
    return response.data;
  }
}
