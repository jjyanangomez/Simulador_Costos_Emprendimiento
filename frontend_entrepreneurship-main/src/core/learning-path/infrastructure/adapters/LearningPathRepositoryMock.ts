import type { ModuleDTO } from "../../application/dto/ModuleDTO";
import type { Module } from "../../domain/entities/Module";
import type { ILearningPathRepository } from "../../domain/repositories/ILearningPathRepository";

export class LearningPathRepositoryMock implements ILearningPathRepository {
    private readonly mockData: ModuleDTO[] = [
        { id_modulo: 1, id_aprendizaje: 1, orden_modulo: 1, nombre_modulo: 'Costos fijos', titulo_conteido: '...', concepto: '...', recurso_interactivo: null, status: 'IN_PROGRESS' },
        { id_modulo: 2, id_aprendizaje: 1, orden_modulo: 2, nombre_modulo: 'Módulo 2', titulo_conteido: null, concepto: '...', recurso_interactivo: null, status: 'LOCKED' },
        { id_modulo: 3, id_aprendizaje: 1, orden_modulo: 3, nombre_modulo: 'Módulo 3', titulo_conteido: null, concepto: '...', recurso_interactivo: null, status: 'LOCKED' },
        { id_modulo: 4, id_aprendizaje: 1, orden_modulo: 4, nombre_modulo: 'Módulo 4', titulo_conteido: null, concepto: '...', recurso_interactivo: null, status: 'LOCKED' },
        { id_modulo: 5, id_aprendizaje: 1, orden_modulo: 5, nombre_modulo: 'Módulo 5', titulo_conteido: null, concepto: '...', recurso_interactivo: null, status: 'LOCKED' },
        { id_modulo: 6, id_aprendizaje: 1, orden_modulo: 6, nombre_modulo: 'Módulo 6', titulo_conteido: null, concepto: '...', recurso_interactivo: null, status: 'LOCKED' },
        { id_modulo: 7, id_aprendizaje: 1, orden_modulo: 7, nombre_modulo: 'Módulo 7', titulo_conteido: null, concepto: '...', recurso_interactivo: null, status: 'LOCKED' },
        { id_modulo: 8, id_aprendizaje: 1, orden_modulo: 8, nombre_modulo: 'Módulo 8', titulo_conteido: null, concepto: '...', recurso_interactivo: null, status: 'LOCKED' },
        { id_modulo: 9, id_aprendizaje: 1, orden_modulo: 9, nombre_modulo: 'Módulo 9', titulo_conteido: null, concepto: '...', recurso_interactivo: null, status: 'LOCKED' },
    ];
    private toDomain(dto: ModuleDTO): Module {
        return {
            id: dto.id_modulo,
            name: dto.nombre_modulo,
            order: dto.orden_modulo ?? 0,
            /**
            * AJUSTE: La conversión ahora es más directa.
            * El dto.status es un string ('IN_PROGRESS', 'LOCKED', etc.),
            * y nuestro tipo ModuleStatus es precisamente una unión de esos strings.
            * TypeScript verifica que el string del DTO sea uno de los valores permitidos.
            * Ya no necesitamos hacer una búsqueda en un objeto enum.
            */
            status: dto.status,
        };
    }
    async getLearningPath(learningPathId: number): Promise<Module[]> {
        console.log(`Buscando camino de aprendizaje con ID: ${learningPathId}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                // const pathModulesDTO = this.mockData.filter(m => m.id_aprendizaje === learningPathId);
                const domainModules = this.mockData.map(this.toDomain);
                resolve(domainModules);
            }, 100);
        });
    }
}