export class Aprendizaje {
  idAprendizaje: number;
  nombre: string;
  totalNiveles?: number;

  constructor(
    idAprendizaje: number,
    nombre: string,
    totalNiveles?: number,
  ) {
    this.idAprendizaje = idAprendizaje;
    this.nombre = nombre;
    this.totalNiveles = totalNiveles;
  }
}
