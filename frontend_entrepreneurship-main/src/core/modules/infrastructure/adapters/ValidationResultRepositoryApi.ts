import { apiClient } from "../../../../shared/infrastructure/http/api-client";

export interface SaveValidationResultRequest {
  negocioId: number;
  moduloId: number;
  costosValidados?: any[];
  costosFaltantes?: any[];
  resumenValidacion?: any;
  puntuacionGlobal?: number;
  puedeProseguirAnalisis: boolean;
}

export interface ValidationResultResponse {
  validacionId: number;
  negocioId: number;
  moduloId: number;
  fechaValidacion?: string;
  costosValidados?: any[];
  costosFaltantes?: any[];
  resumenValidacion?: any;
  puntuacionGlobal?: number;
  puedeProseguirAnalisis: boolean;
}

export class ValidationResultRepositoryApi {
  private static readonly BASE_URL = '/validation-results';

  /**
   * Guarda el resultado de validación en la base de datos
   */
  static async saveValidationResult(data: SaveValidationResultRequest): Promise<ValidationResultResponse> {
    console.log('💾 [FRONTEND-VALIDATION] Guardando resultado de validación:', data);
    console.log('💾 [FRONTEND-VALIDATION] URL de la petición:', this.BASE_URL);
    console.log('💾 [FRONTEND-VALIDATION] Datos enviados:', JSON.stringify(data, null, 2));

    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: ValidationResultResponse;
      }>(this.BASE_URL, data);

      console.log('✅ [FRONTEND-VALIDATION] Resultado guardado exitosamente:', response);
      console.log('✅ [FRONTEND-VALIDATION] Respuesta completa:', JSON.stringify(response, null, 2));
      
      // Verificar si los datos se guardaron correctamente
      if (response.data) {
        console.log('🔍 [FRONTEND-VALIDATION] Verificando datos guardados...');
        console.log('🔍 [FRONTEND-VALIDATION] costosValidados guardados:', response.data.costosValidados);
        console.log('🔍 [FRONTEND-VALIDATION] costosFaltantes guardados:', response.data.costosFaltantes);
        
        // Verificar si los arrays están vacíos (problema del backend)
        if (response.data.costosValidados && response.data.costosValidados.length > 0) {
          const hasEmptyArrays = response.data.costosValidados.some((item: any) => Array.isArray(item) && item.length === 0);
          if (hasEmptyArrays) {
            console.error('❌ [FRONTEND-VALIDATION] PROBLEMA DETECTADO: El backend está guardando arrays vacíos en lugar de los datos reales');
            console.error('❌ [FRONTEND-VALIDATION] Datos enviados vs Datos guardados:');
            console.error('❌ [FRONTEND-VALIDATION] Enviados:', data.costosValidados);
            console.error('❌ [FRONTEND-VALIDATION] Guardados:', response.data.costosValidados);
          }
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ [FRONTEND-VALIDATION] Error al guardar resultado:', error);
      console.error('❌ [FRONTEND-VALIDATION] Detalles del error:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        response: error.response,
        data: error.response?.data
      });
      throw new Error(`Error al guardar el resultado de validación: ${error.message}`);
    }
  }

  /**
   * Obtiene el resultado de validación por negocio y módulo
   */
  static async getValidationResultByBusinessAndModule(
    negocioId: number,
    moduloId: number
  ): Promise<ValidationResultResponse | null> {
    console.log(`🔍 [FRONTEND-VALIDATION] Buscando validación para negocio ${negocioId} y módulo ${moduloId}`);

    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: ValidationResultResponse | null;
      }>(`${this.BASE_URL}/business/${negocioId}/module/${moduloId}`);

      console.log('✅ [FRONTEND-VALIDATION] Validación encontrada:', response);
      return response.data;
    } catch (error) {
      console.error('❌ [FRONTEND-VALIDATION] Error al obtener validación:', error);
      return null;
    }
  }

  /**
   * Obtiene todos los resultados de validación de un negocio
   */
  static async getValidationResultsByBusiness(negocioId: number): Promise<ValidationResultResponse[]> {
    console.log(`🔍 [FRONTEND-VALIDATION] Buscando todas las validaciones del negocio ${negocioId}`);

    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: ValidationResultResponse[];
      }>(`${this.BASE_URL}/business/${negocioId}`);

      console.log(`✅ [FRONTEND-VALIDATION] Encontradas ${response.data.length} validaciones`);
      return response.data;
    } catch (error) {
      console.error('❌ [FRONTEND-VALIDATION] Error al obtener validaciones:', error);
      return [];
    }
  }
}
