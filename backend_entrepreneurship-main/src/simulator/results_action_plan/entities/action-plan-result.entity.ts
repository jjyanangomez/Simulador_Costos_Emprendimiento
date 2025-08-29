export class ActionPlanResult {
  id?: number;
  analisisId: number;
  titulo: string;
  descripcion: string;
  prioridad: string;

  constructor(
    analisisId: number,
    titulo: string,
    descripcion: string,
    prioridad: string,
    id?: number,
  ) {
    this.id = id;
    this.analisisId = analisisId;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.prioridad = prioridad;
  }
}