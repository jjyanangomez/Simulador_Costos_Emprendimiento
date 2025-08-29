export interface DetailedCostAnalysis {
  valor_recibido: string;
  rango_estimado_zona_especifica: string;
  evaluacion: string;
  comentario_evaluacion: string;
}

// El plan de acción recomendado
export interface ActionPlan {
  titulo: string;
  descripcion: string;
  prioridad: "Crítica" | "Alta" | "Media" | "Baja"; // restringimos a valores comunes
}

// Resultado completo del análisis final
export interface FinalAnalysisResult {
  // 👇 Este objeto puede contener claves dinámicas (ej: alquiler, sueldos_personal, etc.)
  analisis_costos_recibidos: Record<string, DetailedCostAnalysis>;

  plan_de_accion_recomendado: ActionPlan[];
}