import { apiClient } from "../../../../shared/infrastructure/http/api-client";

export interface CreateAnalyzedCostResultRequest {
  analysisId: number;
  costName: string;
  receivedValue: string;
  estimatedRange: string;
  evaluation: string;
  comment: string;
}

export interface AnalyzedCostResultResponse {
  resultadoCostoId: number;
  analisisId: number;
  nombreCosto: string;
  valorRecibido: string;
  rangoEstimado: string;
  evaluacion: string;
  comentario: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class AnalyzedCostResultRepositoryApi {
  private static readonly BASE_URL = '/analyzed-costs';

  /**
   * Crea un resultado de análisis de costo
   */
  static async createAnalyzedCostResult(data: CreateAnalyzedCostResultRequest): Promise<AnalyzedCostResultResponse> {
    try {
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: AnalyzedCostResultResponse;
      }>(this.BASE_URL, data);

      return response.data;
    } catch (error) {
      throw new Error('Error al crear el resultado de análisis de costo');
    }
  }

  /**
   * Crea múltiples resultados de análisis de costos
   */
  static async createMultipleAnalyzedCostResults(data: CreateAnalyzedCostResultRequest[]): Promise<AnalyzedCostResultResponse[]> {
    try {
      console.log('📤 [REPOSITORY] ===== INICIANDO LLAMADA AL BACKEND =====');
      console.log('📤 [REPOSITORY] URL del endpoint:', `${this.BASE_URL}/multiple`);
      console.log('📤 [REPOSITORY] Datos a enviar:', { results: data });
      console.log('📤 [REPOSITORY] Cantidad de elementos:', data.length);
      console.log('📤 [REPOSITORY] Primer elemento:', data[0]);
      console.log('📤 [REPOSITORY] Datos JSON:', JSON.stringify({ results: data }, null, 2));
      
      // Verificar que apiClient esté disponible
      if (!apiClient) {
        throw new Error('apiClient no está disponible');
      }
      
      console.log('📤 [REPOSITORY] apiClient disponible:', !!apiClient);
      
      const response = await apiClient.post<any>(`${this.BASE_URL}/multiple`, { results: data });

      console.log('✅ [REPOSITORY] ===== RESPUESTA DEL BACKEND =====');
      console.log('✅ [REPOSITORY] Response completo:', response);
      
      // Verificar si la respuesta indica éxito
      if (response && response.success === false) {
        throw new Error(`Error del servidor: ${response.message || 'Error desconocido'}`);
      }
      
      const result = response.data || response;
      console.log('✅ [REPOSITORY] Datos a retornar:', result);
      return result;
    } catch (error: any) {
      console.error('💥 [REPOSITORY] ===== ERROR DETECTADO =====');
      console.error('💥 [REPOSITORY] Error completo:', error);
      console.error('💥 [REPOSITORY] Tipo de error:', typeof error);
      console.error('💥 [REPOSITORY] Error name:', error.name);
      console.error('💥 [REPOSITORY] Error message:', error.message);
      console.error('💥 [REPOSITORY] Error stack:', error.stack);
      
      // Extraer información detallada del error
      let errorMessage = 'Error al crear los resultados de análisis de costos';
      
      // El apiClient usa fetch, no Axios, por lo que el manejo de errores es diferente
      if (error.message) {
        if (error.message.includes('HTTP error!')) {
          // Error HTTP del servidor
          console.error('💥 [REPOSITORY] Error HTTP del servidor detectado');
          errorMessage = `Error del servidor: ${error.message}`;
        } else if (error.message.includes('Failed to fetch')) {
          // Error de red
          console.error('💥 [REPOSITORY] Error de red detectado');
          errorMessage = 'Error de conexión: No se pudo conectar con el servidor';
        } else {
          // Error personalizado
          console.error('💥 [REPOSITORY] Error personalizado detectado');
          errorMessage = error.message;
        }
      }
      
      console.error('💥 [REPOSITORY] Mensaje de error final:', errorMessage);
      throw new Error(errorMessage);
    }
  }

  /**
   * Obtiene todos los resultados de análisis de costos
   */
  static async getAllAnalyzedCostResults(): Promise<AnalyzedCostResultResponse[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: AnalyzedCostResultResponse[];
      }>(this.BASE_URL);

      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los resultados de análisis de costos');
    }
  }

  /**
   * Obtiene resultados de análisis de costos por ID de análisis
   */
  static async getAnalyzedCostResultsByAnalysisId(analysisId: number): Promise<AnalyzedCostResultResponse[]> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: AnalyzedCostResultResponse[];
      }>(`${this.BASE_URL}/analysis/${analysisId}`);

      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los resultados de análisis de costos');
    }
  }

  /**
   * Obtiene un resultado de análisis de costo por ID
   */
  static async getAnalyzedCostResultById(id: number): Promise<AnalyzedCostResultResponse> {
    try {
      const response = await apiClient.get<{
        success: boolean;
        message: string;
        data: AnalyzedCostResultResponse;
      }>(`${this.BASE_URL}/${id}`);

      return response.data;
    } catch (error) {
      throw new Error('Error al obtener el resultado de análisis de costo');
    }
  }
}
