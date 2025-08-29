export class Modulo {
  idModulo: number;
  idAprendizaje: number;
  ordenModulo?: number;
  nombreModulo: string;
  tituloContenido?: string;
  concepto: string;
  recursoInteractivo?: string;

  constructor(
    idModulo: number,
    idAprendizaje: number,
    nombreModulo: string,
    concepto: string,
    ordenModulo?: number,
    tituloContenido?: string,
    recursoInteractivo?: string,
  ) {
    this.idModulo = idModulo;
    this.idAprendizaje = idAprendizaje;
    this.nombreModulo = nombreModulo;
    this.concepto = concepto;
    this.ordenModulo = ordenModulo;
    this.tituloContenido = tituloContenido;
    this.recursoInteractivo = recursoInteractivo;
  }
}
