export interface Recipe {
  receta_id: number;
  producto_id: number;
  nombre_receta: string;
  tiempo_preparacion?: number;
  personal_requerido?: number;
  costo_receta: number;
  precio_venta: number;
  producto?: {
    nombre_producto: string;
    precio_por_unidad: number;
    costo_por_unidad: number;
  };
}

export interface RecipeEquilibrium {
  receta: Recipe;
  cantidad_ventas: number;
  ingresos_totales: number;
  costos_totales: number;
  ganancia: number;
  porcentaje_contribucion: number;
}

export interface EquilibriumCalculation {
  costos_fijos_totales: number;
  costos_variables_totales: number;
  recetas_equilibrio: RecipeEquilibrium[];
  punto_equilibrio_total: number;
  ganancia_objetivo: number;
  recomendaciones: string[];
}
