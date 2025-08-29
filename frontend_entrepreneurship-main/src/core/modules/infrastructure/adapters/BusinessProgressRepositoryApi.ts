import { apiClient } from '../../../../shared/infrastructure/http/api-client';

export interface CompleteModuleResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    negocio_id: number;
    modulo_id: number;
    estado: string;
    fecha_completado: string;
    modulo_nombre: string;
    negocio_nombre: string;
  };
}

export interface ModuleProgressResponse {
  id: number;
  negocio_id: number;
  modulo_id: number;
  id_estado: number;
  fecha_inicio: string;
  fecha_completado: string;
  estado_nombre: string;
}

export class BusinessProgressRepositoryApi {
  /**
   * Marcar un módulo como completado
   */
  async completeModule(negocioId: number, moduloId: number): Promise<CompleteModuleResponse> {
    try {
      console.log('🎯 [FRONTEND] Marcando módulo como completado:', { negocioId, moduloId });
      
      const response = await apiClient.put<CompleteModuleResponse>(
        `/business-progress/${negocioId}/module/${moduloId}/complete`
      );
      
      console.log('✅ [FRONTEND] Módulo marcado como completado:', response);
      return response;
    } catch (error) {
      console.error('💥 [FRONTEND] Error al marcar módulo como completado:', error);
      throw new Error('Error al marcar módulo como completado');
    }
  }

  /**
   * Obtener el progreso de un módulo específico
   */
  async getProgress(negocioId: number, moduloId: number): Promise<ModuleProgressResponse | null> {
    try {
      console.log('🔍 [FRONTEND] Obteniendo progreso del módulo:', { negocioId, moduloId });
      
      const response = await apiClient.get<ModuleProgressResponse>(
        `/business-progress/${negocioId}/module/${moduloId}`
      );
      
      console.log('✅ [FRONTEND] Progreso del módulo obtenido:', response);
      return response;
    } catch (error) {
      console.error('💥 [FRONTEND] Error al obtener progreso del módulo:', error);
      // Si no se encuentra el progreso, retornar null en lugar de lanzar error
      return null;
    }
  }
}
