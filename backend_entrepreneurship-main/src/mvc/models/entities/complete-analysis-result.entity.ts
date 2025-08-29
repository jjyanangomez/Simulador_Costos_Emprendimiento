export class CompleteAnalysisResult {
  resultadoId: number;
  negocioId: number;
  moduloId: number;
  analisisId: number;
  fechaAnalisis: Date;
  costosAnalizados: any[];
  riesgosDetectados: any[];
  planAccion: any[];
  resumenAnalisis: any;
  estadoGuardado: string;

  constructor(
    resultadoId: number,
    negocioId: number,
    moduloId: number,
    analisisId: number,
    fechaAnalisis: Date,
    costosAnalizados: any[],
    riesgosDetectados: any[],
    planAccion: any[],
    resumenAnalisis: any,
    estadoGuardado: string = 'guardado'
  ) {
    this.resultadoId = resultadoId;
    this.negocioId = negocioId;
    this.moduloId = moduloId;
    this.analisisId = analisisId;
    this.fechaAnalisis = fechaAnalisis;
    this.costosAnalizados = costosAnalizados;
    this.riesgosDetectados = riesgosDetectados;
    this.planAccion = planAccion;
    this.resumenAnalisis = resumenAnalisis;
    this.estadoGuardado = estadoGuardado;
  }
}
