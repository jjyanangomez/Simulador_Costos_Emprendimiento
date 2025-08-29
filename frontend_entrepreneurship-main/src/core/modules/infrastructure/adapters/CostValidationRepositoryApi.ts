import { apiClient } from "../../../../shared/infrastructure/http/api-client";

export interface CreateCostValidationRequest {
  negocioId: number;
  moduloId: number;
  costosValidados: any[];
  costosFaltantes: any[];
  resumenValidacion: any;
  puntuacionGlobal: number;
  puedeProseguirAnalisis: boolean;
}

export interface CostValidationResponse {
  validacionId: number;
  negocioId: number;
  moduloId: number;
  fechaValidacion: string;
  costosValidados: any[];
  costosFaltantes: any[];
  resumenValidacion: any;
  puntuacionGlobal: number;
  puedeProseguirAnalisis: boolean;
}

export class CostValidationRepositoryApi {
  private static readonly BASE_URL = '/cost-validation';

  /**
   * Crea un resultado de validación de costos
   */
  static async createCostValidation(data: CreateCostValidationRequest): Promise<CostValidationResponse> {
    try {
      console.log('📤 [VALIDATION-REPO] ===== INICIANDO LLAMADA AL BACKEND =====');
      console.log('📤 [VALIDATION-REPO] URL del endpoint:', `${this.BASE_URL}`);
      console.log('📤 [VALIDATION-REPO] Datos a enviar:', data);
      console.log('📤 [VALIDATION-REPO] Datos JSON:', JSON.stringify(data, null, 2));
      
      // Verificar que apiClient esté disponible
      if (!apiClient) {
        throw new Error('apiClient no está disponible');
      }
      
      console.log('📤 [VALIDATION-REPO] apiClient disponible:', !!apiClient);
      
      const response = await apiClient.post<any>(`${this.BASE_URL}`, data);

      console.log('✅ [VALIDATION-REPO] ===== RESPUESTA DEL BACKEND =====');
      console.log('✅ [VALIDATION-REPO] Response completo:', response);
      
      // Verificar si la respuesta indica éxito
      if (response && response.success === false) {
        throw new Error(`Error del servidor: ${response.message || 'Error desconocido'}`);
      }
      
      const result = response.data || response;
      console.log('✅ [VALIDATION-REPO] Datos a retornar:', result);
      return result;
    } catch (error: any) {
      console.error('💥 [VALIDATION-REPO] ===== ERROR DETECTADO =====');
      console.error('💥 [VALIDATION-REPO] Error completo:', error);
      console.error('💥 [VALIDATION-REPO] Tipo de error:', typeof error);
      console.error('💥 [VALIDATION-REPO] Error name:', error.name);
      console.error('💥 [VALIDATION-REPO] Error message:', error.message);
      console.error('💥 [VALIDATION-REPO] Error stack:', error.stack);
      
      // Extraer información detallada del error
      let errorMessage = 'Error al crear la validación de costos';
      
      // El apiClient usa fetch, no Axios, por lo que el manejo de errores es diferente
      if (error.message) {
        if (error.message.includes('HTTP error!')) {
          // Error HTTP del servidor
          console.error('💥 [VALIDATION-REPO] Error HTTP del servidor detectado');
          errorMessage = `Error del servidor: ${error.message}`;
        } else if (error.message.includes('Failed to fetch')) {
          // Error de red
          console.error('💥 [VALIDATION-REPO] Error de red detectado');
          errorMessage = 'Error de conexión: No se pudo conectar con el servidor';
        } else {
          // Error personalizado
          console.error('💥 [VALIDATION-REPO] Error personalizado detectado');
          errorMessage = error.message;
        }
      }
      
      console.error('💥 [VALIDATION-REPO] Mensaje de error final:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}
