// Fichero: src/core/learning-path/domain/repositories/ILearningPathRepository.ts

import type { Module } from "../entities/Module";

/**
 * Interfaz del Repositorio (Puerto).
 * Define el contrato que los adaptadores deben seguir.
 * Ahora acepta el ID del camino de aprendizaje para ser más específico.
 * Devuelve una promesa con un array de ENTIDADES DE DOMINIO, no DTOs.
 */
export interface ILearningPathRepository {
  getLearningPath(learningPathId: number): Promise<Module[]>;
}