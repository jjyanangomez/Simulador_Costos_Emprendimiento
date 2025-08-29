export class DetectedRiskResult {
  id?: number;
  analisisId: number;
  riesgo: string;
  causaDirecta: string;
  impactoPotencial: string;

  constructor(
    analisisId: number,
    riesgo: string,
    causaDirecta: string,
    impactoPotencial: string,
    id?: number,
  ) {
    this.id = id;
    this.analisisId = analisisId;
    this.riesgo = riesgo;
    this.causaDirecta = causaDirecta;
    this.impactoPotencial = impactoPotencial;
  }
}