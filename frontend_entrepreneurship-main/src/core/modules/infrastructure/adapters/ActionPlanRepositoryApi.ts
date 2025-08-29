import { apiClient } from "../../../../shared/infrastructure/http/api-client";

export interface CreateActionPlanRequest {
  analisisId: number;
  titulo: string;
  descripcion: string;
  prioridad: string;
}

export interface ActionPlanResponse {
  planId: number;
  analisisId: number;
  titulo: string;
  descripcion: string;
  prioridad: string;
}

export class ActionPlanRepositoryApi {
  private static readonly BASE_URL = '/action-plan';

  /**
   * Crea múltiples planes de acción
   */
  static async createMultipleActionPlans(data: CreateActionPlanRequest[]): Promise<ActionPlanResponse[]> {
    try {
      console.log('📤 [ACTION-REPO] ===== INICIANDO LLAMADA AL BACKEND =====');
      console.log('📤 [ACTION-REPO] URL del endpoint:', `${this.BASE_URL}/multiple`);
      console.log('📤 [ACTION-REPO] Datos a enviar:', { results: data });
      console.log('📤 [ACTION-REPO] Cantidad de elementos:', data.length);
      console.log('📤 [ACTION-REPO] Primer elemento:', data[0]);
      console.log('📤 [ACTION-REPO] Datos JSON:', JSON.stringify({ results: data }, null, 2));
      
      // Verificar que apiClient esté disponible
      if (!apiClient) {
        throw new Error('apiClient no está disponible');
      }
      
      console.log('📤 [ACTION-REPO] apiClient disponible:', !!apiClient);
      
      const response = await apiClient.post<any>(`${this.BASE_URL}/multiple`, { results: data });

      console.log('✅ [ACTION-REPO] ===== RESPUESTA DEL BACKEND =====');
      console.log('✅ [ACTION-REPO] Response completo:', response);
      
      // Verificar si la respuesta indica éxito
      if (response && response.success === false) {
        throw new Error(`Error del servidor: ${response.message || 'Error desconocido'}`);
      }
      
      const result = response.data || response;
      console.log('✅ [ACTION-REPO] Datos a retornar:', result);
      return result;
    } catch (error: any) {
      console.error('💥 [ACTION-REPO] ===== ERROR DETECTADO =====');
      console.error('💥 [ACTION-REPO] Error completo:', error);
      console.error('💥 [ACTION-REPO] Tipo de error:', typeof error);
      console.error('💥 [ACTION-REPO] Error name:', error.name);
      console.error('💥 [ACTION-REPO] Error message:', error.message);
      console.error('💥 [ACTION-REPO] Error stack:', error.stack);
      
      // Extraer información detallada del error
      let errorMessage = 'Error al crear los planes de acción';
      
      // El apiClient usa fetch, no Axios, por lo que el manejo de errores es diferente
      if (error.message) {
        if (error.message.includes('HTTP error!')) {
          // Error HTTP del servidor
          console.error('💥 [ACTION-REPO] Error HTTP del servidor detectado');
          errorMessage = `Error del servidor: ${error.message}`;
        } else if (error.message.includes('Failed to fetch')) {
          // Error de red
          console.error('💥 [ACTION-REPO] Error de red detectado');
          errorMessage = 'Error de conexión: No se pudo conectar con el servidor';
        } else {
          // Error personalizado
          console.error('💥 [ACTION-REPO] Error personalizado detectado');
          errorMessage = error.message;
        }
      }
      
      console.error('💥 [ACTION-REPO] Mensaje de error final:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}
