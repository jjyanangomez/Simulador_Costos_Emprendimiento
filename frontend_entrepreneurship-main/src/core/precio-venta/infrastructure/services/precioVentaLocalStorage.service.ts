import { localStorageService } from '../../../../shared/infrastructure/services/localStorage.service';

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

export interface PrecioVentaData {
  productos: ProductoPrecioVenta[];
  resumen: ResumenCostosGanancias | null;
  lastUpdated: string;
}

export class PrecioVentaLocalStorageService {
  private static readonly STORAGE_KEY = 'precio_venta_data';

  static saveData(data: Omit<PrecioVentaData, 'lastUpdated'>): void {
    const dataWithTimestamp: PrecioVentaData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorageService.set(this.STORAGE_KEY, dataWithTimestamp);
  }

  static loadData(): PrecioVentaData | null {
    return localStorageService.get<PrecioVentaData>(this.STORAGE_KEY);
  }

  static saveProductos(productos: ProductoPrecioVenta[]): void {
    const currentData = this.loadData() || {
      productos: [],
      resumen: null,
      lastUpdated: new Date().toISOString()
    };
    
    this.saveData({
      ...currentData,
      productos
    });
  }

  static saveResumen(resumen: ResumenCostosGanancias): void {
    const currentData = this.loadData() || {
      productos: [],
      resumen: null,
      lastUpdated: new Date().toISOString()
    };
    
    this.saveData({
      ...currentData,
      resumen
    });
  }

  static getProductos(): ProductoPrecioVenta[] {
    const data = this.loadData();
    return data?.productos || [];
  }

  static getResumen(): ResumenCostosGanancias | null {
    const data = this.loadData();
    return data?.resumen || null;
  }

  static clearData(): void {
    localStorageService.remove(this.STORAGE_KEY);
  }

  static hasData(): boolean {
    const data = this.loadData();
    return data !== null && data.productos.length > 0;
  }

  static getLastUpdated(): string | null {
    const data = this.loadData();
    return data?.lastUpdated || null;
  }

  // Método para calcular resumen basado en productos de costos variables
  static calculateResumenFromVariableCosts(): ResumenCostosGanancias | null {
    const productos = this.getProductos();
    if (productos.length === 0) return null;

    const costo_total_productos = productos.reduce((sum, p) => sum + p.costo_total_producto, 0);
    const precio_venta_total_cliente = productos.reduce((sum, p) => sum + p.precio_venta_cliente, 0);
    const ganancia_total_real = productos.reduce((sum, p) => sum + p.ganancia_por_unidad, 0);
    const margen_ganancia_promedio = productos.length > 0 
      ? productos.reduce((sum, p) => sum + p.margen_ganancia_real, 0) / productos.length 
      : 0;

    return {
      negocio_id: 1,
      costo_total_productos,
      costo_total_adicionales: 0, // Se puede calcular desde costos variables
      costo_total_general: costo_total_productos,
      precio_venta_total_sugerido: productos.reduce((sum, p) => sum + p.precio_venta_sugerido_ia, 0),
      precio_venta_total_cliente,
      ganancia_total_sugerida: productos.reduce((sum, p) => sum + (p.precio_venta_sugerido_ia - p.costo_total_producto), 0),
      ganancia_total_real,
      margen_ganancia_promedio,
      rentabilidad_total_negocio: margen_ganancia_promedio,
      roi_estimado: ganancia_total_real / costo_total_productos * 100
    };
  }
}
