import { localStorageService } from './localStorage.service';

// Interfaces para Costos Variables
export interface Product {
  id: string;
  name: string;
  type: 'recipe' | 'resale';
  ingredients?: Ingredient[];
  resaleCost?: number;
  preparationTime?: number;
  staffRequired?: number;
}

export interface Ingredient {
  name: string;
  unitPrice: number;
  portion: number;
  unitOfMeasure: string;
  portionsObtained?: number;
}

export interface AdditionalCost {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'quarterly' | 'yearly';
}

export interface VariableCostsData {
  products: Product[];
  additionalCosts: AdditionalCost[];
  businessType: string;
  lastUpdated: string;
}

// Interfaces para Costos Fijos
export interface FixedCost {
  id: string;
  name: string;
  description?: string;
  amount: number;
  frequency: 'mensual' | 'semestral' | 'anual';
  category: string;
}

export interface FixedCostsData {
  costs: FixedCost[];
  lastUpdated: string;
}

// Interfaces para Precio de Venta
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

export class BusinessDataLocalStorageService {
  // Costos Variables
  private static readonly VARIABLE_COSTS_KEY = 'variable_costs_data';
  private static readonly FIXED_COSTS_KEY = 'fixed_costs_data';
  private static readonly PRECIO_VENTA_KEY = 'precio_venta_data';

  // Métodos para Costos Variables
  static saveVariableCostsData(data: Omit<VariableCostsData, 'lastUpdated'>): void {
    const dataWithTimestamp: VariableCostsData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorageService.set(this.VARIABLE_COSTS_KEY, dataWithTimestamp);
  }

  static loadVariableCostsData(): VariableCostsData | null {
    return localStorageService.get<VariableCostsData>(this.VARIABLE_COSTS_KEY);
  }

  static saveVariableCostsProducts(products: Product[]): void {
    const currentData = this.loadVariableCostsData() || {
      products: [],
      additionalCosts: [],
      businessType: 'restaurante',
      lastUpdated: new Date().toISOString()
    };
    
    this.saveVariableCostsData({
      ...currentData,
      products
    });
  }

  static saveVariableCostsAdditionalCosts(additionalCosts: AdditionalCost[]): void {
    const currentData = this.loadVariableCostsData() || {
      products: [],
      additionalCosts: [],
      businessType: 'restaurante',
      lastUpdated: new Date().toISOString()
    };
    
    this.saveVariableCostsData({
      ...currentData,
      additionalCosts
    });
  }

  static getVariableCostsProducts(): Product[] {
    const data = this.loadVariableCostsData();
    return data?.products || [];
  }

  static getVariableCostsAdditionalCosts(): AdditionalCost[] {
    const data = this.loadVariableCostsData();
    return data?.additionalCosts || [];
  }

  static getVariableCostsBusinessType(): string {
    const data = this.loadVariableCostsData();
    return data?.businessType || 'restaurante';
  }

  static clearVariableCostsData(): void {
    localStorageService.remove(this.VARIABLE_COSTS_KEY);
  }

  static hasVariableCostsData(): boolean {
    const data = this.loadVariableCostsData();
    return data !== null && (data.products.length > 0 || data.additionalCosts.length > 0);
  }

  static getVariableCostsLastUpdated(): string | null {
    const data = this.loadVariableCostsData();
    return data?.lastUpdated || null;
  }

  // Métodos para Costos Fijos
  static saveFixedCostsData(data: Omit<FixedCostsData, 'lastUpdated'>): void {
    const dataWithTimestamp: FixedCostsData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorageService.set(this.FIXED_COSTS_KEY, dataWithTimestamp);
  }

  static loadFixedCostsData(): FixedCostsData | null {
    return localStorageService.get<FixedCostsData>(this.FIXED_COSTS_KEY);
  }

  static getFixedCosts(): FixedCost[] {
    const data = this.loadFixedCostsData();
    return data?.costs || [];
  }

  static getTotalFixedCosts(): number {
    const costs = this.getFixedCosts();
    return costs.reduce((total, cost) => {
      const monthlyAmount = cost.frequency === 'mensual' ? cost.amount : 
                           cost.frequency === 'semestral' ? cost.amount / 6 : 
                           cost.amount / 12;
      return total + monthlyAmount;
    }, 0);
  }

  static clearFixedCostsData(): void {
    localStorageService.remove(this.FIXED_COSTS_KEY);
  }

  static hasFixedCostsData(): boolean {
    const data = this.loadFixedCostsData();
    return data !== null && data.costs.length > 0;
  }

  static getFixedCostsLastUpdated(): string | null {
    const data = this.loadFixedCostsData();
    return data?.lastUpdated || null;
  }

  // Métodos para Precio de Venta
  static savePrecioVentaData(data: Omit<PrecioVentaData, 'lastUpdated'>): void {
    const dataWithTimestamp: PrecioVentaData = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorageService.set(this.PRECIO_VENTA_KEY, dataWithTimestamp);
  }

  static loadPrecioVentaData(): PrecioVentaData | null {
    return localStorageService.get<PrecioVentaData>(this.PRECIO_VENTA_KEY);
  }

  static savePrecioVentaProductos(productos: ProductoPrecioVenta[]): void {
    const currentData = this.loadPrecioVentaData() || {
      productos: [],
      resumen: null,
      lastUpdated: new Date().toISOString()
    };
    
    this.savePrecioVentaData({
      ...currentData,
      productos
    });
  }

  static savePrecioVentaResumen(resumen: ResumenCostosGanancias): void {
    const currentData = this.loadPrecioVentaData() || {
      productos: [],
      resumen: null,
      lastUpdated: new Date().toISOString()
    };
    
    this.savePrecioVentaData({
      ...currentData,
      resumen
    });
  }

  static getPrecioVentaProductos(): ProductoPrecioVenta[] {
    const data = this.loadPrecioVentaData();
    return data?.productos || [];
  }

  static getPrecioVentaResumen(): ResumenCostosGanancias | null {
    const data = this.loadPrecioVentaData();
    return data?.resumen || null;
  }

  static clearPrecioVentaData(): void {
    localStorageService.remove(this.PRECIO_VENTA_KEY);
  }

  static hasPrecioVentaData(): boolean {
    const data = this.loadPrecioVentaData();
    return data !== null && data.productos.length > 0;
  }

  static getPrecioVentaLastUpdated(): string | null {
    const data = this.loadPrecioVentaData();
    return data?.lastUpdated || null;
  }

  // Método para generar datos de precio de venta desde costos variables
  static generatePrecioVentaFromVariableCosts(): ProductoPrecioVenta[] {
    const variableCostsProducts = this.getVariableCostsProducts();
    
    if (variableCostsProducts.length === 0) return [];

    return variableCostsProducts.map((product, index) => {
      const costoTotal = product.type === 'recipe' && product.ingredients 
        ? product.ingredients.reduce((total, ingredient) => {
            const costPerPortion = ingredient.unitPrice / (ingredient.portionsObtained || 1);
            return total + (costPerPortion * ingredient.portion);
          }, 0)
        : product.resaleCost || 0;

      const precioSugerido = costoTotal * 1.3; // 30% de margen sugerido
      const precioCliente = precioSugerido;
      const gananciaPorUnidad = precioCliente - costoTotal;
      const margenGanancia = costoTotal > 0 ? (gananciaPorUnidad / precioCliente) * 100 : 0;

      return {
        producto_id: index + 1,
        nombre_producto: product.name,
        costo_total_producto: costoTotal,
        precio_venta_sugerido_ia: precioSugerido,
        precio_venta_cliente: precioCliente,
        margen_ganancia_ia: margenGanancia,
        margen_ganancia_real: margenGanancia,
        ganancia_por_unidad: gananciaPorUnidad,
        rentabilidad_producto: margenGanancia
      };
    });
  }

  // Método para calcular resumen desde productos de precio de venta
  static calculateResumenFromPrecioVenta(): ResumenCostosGanancias | null {
    const productos = this.getPrecioVentaProductos();
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
      costo_total_adicionales: 0,
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

  // Método para limpiar todos los datos
  static clearAllData(): void {
    this.clearVariableCostsData();
    this.clearFixedCostsData();
    this.clearPrecioVentaData();
  }
}
