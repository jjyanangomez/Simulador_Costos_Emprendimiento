export class ResultadosCostosAnalizados {
  resultadoCostoId?: number;
  analisisId: number;
  nombreCosto?: string;
  valorRecibido?: string;
  rangoEstimado?: string;
  evaluacion?: string;
  comentario?: string;

  constructor(
    analisisId: number,
    nombreCosto?: string,
    valorRecibido?: string,
    rangoEstimado?: string,
    evaluacion?: string,
    comentario?: string,
  ) {
    this.analisisId = analisisId;
    this.nombreCosto = nombreCosto;
    this.valorRecibido = valorRecibido;
    this.rangoEstimado = rangoEstimado;
    this.evaluacion = evaluacion;
    this.comentario = comentario;
  }
}