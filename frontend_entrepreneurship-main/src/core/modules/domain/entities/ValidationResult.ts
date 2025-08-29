// Archivo: src/features/cost-analysis/domain/entities/ValidationResult.ts (NUEVO ARCHIVO)

export interface ValidatedCost {
  costo_recibido: string;
  valor_recibido: string;
  es_valido: boolean;
  justificacion: string;
}

export interface MissingCost {
  nombre: string;
  descripcion: string;
  motivo_critico?: string; // Solo para obligatorios
  beneficio?: string;      // Solo para recomendados
}

export interface ValidationSummary {
  mensaje_general: string;
  puede_proseguir_analisis: boolean;
}

export interface ValidationResult {
  validacion_de_costos: ValidatedCost[];
  costos_obligatorios_faltantes: MissingCost[];
  costos_recomendados_faltantes: MissingCost[];
  resumen_validacion: ValidationSummary;
}