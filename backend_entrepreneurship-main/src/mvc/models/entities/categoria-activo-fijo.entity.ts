export class CategoriaActivoFijo {
  categoria_id: number;
  nombre: string;
  descripcion?: string | null;
  icono?: string | null;
  color?: string | null;
  activo: boolean;
  fecha_creacion: Date | null;
}

export class CategoriaActivoFijoWithCount {
  data: CategoriaActivoFijo[];
  total: number;
  message: string;
}

export interface CategoriaActivoFijoWithCostosFijos extends CategoriaActivoFijo {
  CostosFijos?: Array<{
    costo_fijo_id: number;
    nombre: string;
    monto: any; // Decimal de Prisma
    negocio_id?: number;
    frecuencia?: string;
    fecha_inicio?: Date | null;
  }>;
  total_costos?: number;
  monto_total?: number;
}

export interface CategoriaActivoFijoWithCountAndCostos {
  data: CategoriaActivoFijoWithCostosFijos[];
  total: number;
  message: string;
}
