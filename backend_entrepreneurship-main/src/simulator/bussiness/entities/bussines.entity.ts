
export class Business {
  negocioId?: number;
  usuarioId: number;
  sectorId?: number;
  nombreNegocio: string;
  ubicacionExacta: string;
  idTamano?: number;
  aforoPersonas?: number;
  inversionInicial?: number;
  capitalPropio?: number;
  capitalPrestamo?: number;
  tasaInteres?: number;
  fechaCreacion?: Date;

  constructor(
    usuarioId: number,
    nombreNegocio: string,
    ubicacionExacta: string,
    negocioId?: number,
    fechaCreacion?: Date,
    sectorId?: number,
    idTamano?: number,
    aforoPersonas?: number,
    inversionInicial?: number,
    capitalPropio?: number,
    capitalPrestamo?: number,
    tasaInteres?: number,
  ) {
    this.usuarioId = usuarioId;
    this.nombreNegocio = nombreNegocio;
    this.ubicacionExacta = ubicacionExacta;
    this.negocioId = negocioId;
    this.fechaCreacion = fechaCreacion;
    this.sectorId = sectorId;
    this.idTamano = idTamano;
    this.aforoPersonas = aforoPersonas;
    this.inversionInicial = inversionInicial;
    this.capitalPropio = capitalPropio;
    this.capitalPrestamo = capitalPrestamo;
    this.tasaInteres = tasaInteres;
  }
}