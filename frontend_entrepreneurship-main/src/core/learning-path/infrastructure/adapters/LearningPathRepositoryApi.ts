import { apiClient } from "../../../../shared/infrastructure/http/api-client";
import type { Module } from "../../domain/entities/Module";
import type { ModuleStatus } from "../../domain/entities/ModuleStatus";
import type { ILearningPathRepository } from "../../domain/repositories/ILearningPathRepository";

// Interfaces para mapear entre frontend y backend
interface ModuloApiResponse {
  idModulo: number;
  idAprendizaje: number;
  ordenModulo?: number;
  nombreModulo: string;
  tituloContenido?: string;
  concepto: string;
  recursoInteractivo?: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
}

// Mapper para convertir entre entidades del frontend y backend
const mapApiToModule = (apiModulo: ModuloApiResponse): Module => {
  return {
    id: apiModulo.idModulo,
    name: apiModulo.nombreModulo,
    order: apiModulo.ordenModulo || 0,
    status: apiModulo.status as ModuleStatus,
  };
};

export class LearningPathRepositoryApi implements ILearningPathRepository {
  async getLearningPath(learningPathId: number): Promise<Module[]> {
    try {
      console.log(`📚 [FRONTEND] Solicitando módulos del aprendizaje ${learningPathId}...`);
      
      // Primero, obtener el ID del aprendizaje disponible
      const aprendizajes = await apiClient.get<any[]>('/aprendizaje');
      console.log(`📥 [FRONTEND] Aprendizajes disponibles:`, aprendizajes);
      
      if (!aprendizajes || aprendizajes.length === 0) {
        throw new Error('No hay aprendizajes disponibles en la base de datos');
      }
      
      // Usar el primer aprendizaje disponible (ID 1)
      const aprendizajeId = aprendizajes[0].idAprendizaje;
      console.log(`🔍 [FRONTEND] Usando aprendizaje ID: ${aprendizajeId}`);
      
      // Intentar obtener módulos con progreso del negocio específico
      try {
        const response = await apiClient.get<ModuloApiResponse[]>(`/aprendizaje/${aprendizajeId}/modulos/${learningPathId}/progreso`);
        
        console.log(`📥 [FRONTEND] Respuesta del backend para módulos con progreso:`, response);
        
        const mappedModules = response.map(mapApiToModule);
        console.log(`✅ [FRONTEND] Módulos mapeados con progreso:`, mappedModules);
        
        return mappedModules;
      } catch (progresoError) {
        console.log(`⚠️ [FRONTEND] No se pudo obtener progreso, obteniendo módulos básicos...`);
        
        // Si falla la obtención con progreso, obtener solo los módulos
        const response = await apiClient.get<ModuloApiResponse[]>(`/aprendizaje/${aprendizajeId}/modulos`);
        
        console.log(`📥 [FRONTEND] Respuesta del backend para módulos básicos:`, response);
        
        const mappedModules = response.map((modulo) => ({
          id: modulo.idModulo,
          name: modulo.nombreModulo,
          order: modulo.ordenModulo || 0,
          status: (modulo.ordenModulo === 1 ? 'IN_PROGRESS' : 'LOCKED') as ModuleStatus,
        }));
        
        console.log(`✅ [FRONTEND] Módulos mapeados básicos:`, mappedModules);
        return mappedModules;
      }
    } catch (error) {
      console.error(`💥 [FRONTEND] Error en LearningPathRepositoryApi.getLearningPath:`, error);
      throw new Error('No se pudieron cargar los módulos del aprendizaje. Inténtalo de nuevo.');
    }
  }
}
