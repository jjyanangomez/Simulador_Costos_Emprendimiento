export class Learning{
    aprendizajeId?: number;
    nombre?: string;
    totalNiveles?: number;

    constructor(nombre: string, totalNiveles: number){
        this.nombre = nombre;
        this.totalNiveles = totalNiveles;
    }
}