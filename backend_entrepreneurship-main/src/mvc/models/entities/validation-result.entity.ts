export class ValidationResult {
  validacionId?: number;
  negocioId: number;
  moduloId: number;
  fechaValidacion?: Date;
  costosValidados?: any[];
  costosFaltantes?: any[];
  resumenValidacion?: any;
  puntuacionGlobal?: number;
  puedeProseguirAnalisis: boolean;

  constructor(
    negocioId: number,
    moduloId: number,
    puedeProseguirAnalisis: boolean,
    validacionId?: number,
    fechaValidacion?: Date,
    costosValidados?: any[],
    costosFaltantes?: any[],
    resumenValidacion?: any,
    puntuacionGlobal?: number,
  ) {
    this.validacionId = validacionId;
    this.negocioId = negocioId;
    this.moduloId = moduloId;
    this.fechaValidacion = fechaValidacion;
    this.costosValidados = costosValidados;
    this.costosFaltantes = costosFaltantes;
    this.resumenValidacion = resumenValidacion;
    this.puntuacionGlobal = puntuacionGlobal;
    this.puedeProseguirAnalisis = puedeProseguirAnalisis;
  }
}
