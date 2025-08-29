export class Business {
  negocioId?: number;
  usuarioId: number;
  tipoNegocio: string;
  nombreNegocio: string;
  ubicacion: string;
  idTamano: number;
  tamano?: string; // Nombre del tamaño del negocio
  fechaCreacion?: Date;

  constructor(
    usuarioId: number,
    tipoNegocio: string,
    nombreNegocio: string,
    ubicacion: string,
    idTamano: number,
    negocioId?: number,
    fechaCreacion?: Date,
    tamano?: string,
  ) {
    this.usuarioId = usuarioId;
    this.tipoNegocio = tipoNegocio;
    this.nombreNegocio = nombreNegocio;
    this.ubicacion = ubicacion;
    this.idTamano = idTamano;
    this.negocioId = negocioId;
    this.fechaCreacion = fechaCreacion;
    this.tamano = tamano;
  }
}
