// Fichero: src/core/learning-path/application/useCase/GetLearningPath.ts

import type { Module } from "../../domain/entities/Module";
import type { ILearningPathRepository } from "../../domain/repositories/ILearningPathRepository";

/**
 * Caso de Uso para obtener el camino de aprendizaje.
 * Orquesta la llamada al repositorio pasándole los parámetros necesarios.
 * No cambia mucho, demostrando la estabilidad de esta capa.
 */
export class GetLearningPath {
private readonly repositoryLearning: ILearningPathRepository;
  constructor(repositoryLearning: ILearningPathRepository) {
    this.repositoryLearning=repositoryLearning;
  }

  // El método ahora recibe el ID del camino de aprendizaje.
  async execute(learningPathId: number): Promise<Module[]> {
    const modules = await this.repositoryLearning.getLearningPath(learningPathId);
    // Ordena los módulos según el campo 'order' antes de devolverlos.
    return modules.sort((a, b) => a.order - b.order);
  }
}