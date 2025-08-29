export class AnalisisIA {
    analisisId?: number;
    negocioId: number;
    fechaAnalisis?: Date;

  constructor(
    negocioId: number,
    fechaAnalisis?: Date,
  ) {
    this.negocioId = negocioId;
    this.fechaAnalisis = fechaAnalisis;
  }
}