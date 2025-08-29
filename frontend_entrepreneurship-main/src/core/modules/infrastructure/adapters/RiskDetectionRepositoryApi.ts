import { apiClient } from "../../../../shared/infrastructure/http/api-client";

export interface CreateRiskDetectionRequest {
  analisisId: number;
  riesgo: string;
  causaDirecta: string;
  impactoPotencial: string;
}

export interface RiskDetectionResponse {
  riesgoId: number;
  analisisId: number;
  riesgo: string;
  causaDirecta: string;
  impactoPotencial: string;
}

export class RiskDetectionRepositoryApi {
  private static readonly BASE_URL = '/risk-detection';

  /**
   * Crea múltiples riesgos detectados
   */
  static async createMultipleRiskDetections(data: CreateRiskDetectionRequest[]): Promise<RiskDetectionResponse[]> {
    try {
      console.log('📤 [RISK-REPO] ===== INICIANDO LLAMADA AL BACKEND =====');
      console.log('📤 [RISK-REPO] URL del endpoint:', `${this.BASE_URL}/multiple`);
      console.log('📤 [RISK-REPO] Datos a enviar:', { results: data });
      console.log('📤 [RISK-REPO] Cantidad de elementos:', data.length);
      console.log('📤 [RISK-REPO] Primer elemento:', data[0]);
      console.log('📤 [RISK-REPO] Datos JSON:', JSON.stringify({ results: data }, null, 2));
      
      // Verificar que apiClient esté disponible
      if (!apiClient) {
        throw new Error('apiClient no está disponible');
      }
      
      console.log('📤 [RISK-REPO] apiClient disponible:', !!apiClient);
      
      const response = await apiClient.post<any>(`${this.BASE_URL}/multiple`, { results: data });

      console.log('✅ [RISK-REPO] ===== RESPUESTA DEL BACKEND =====');
      console.log('✅ [RISK-REPO] Response completo:', response);
      
      // Verificar si la respuesta indica éxito
      if (response && response.success === false) {
        throw new Error(`Error del servidor: ${response.message || 'Error desconocido'}`);
      }
      
      const result = response.data || response;
      console.log('✅ [RISK-REPO] Datos a retornar:', result);
      return result;
    } catch (error: any) {
      console.error('💥 [RISK-REPO] ===== ERROR DETECTADO =====');
      console.error('💥 [RISK-REPO] Error completo:', error);
      console.error('💥 [RISK-REPO] Tipo de error:', typeof error);
      console.error('💥 [RISK-REPO] Error name:', error.name);
      console.error('💥 [RISK-REPO] Error message:', error.message);
      console.error('💥 [RISK-REPO] Error stack:', error.stack);
      
      // Extraer información detallada del error
      let errorMessage = 'Error al crear los riesgos detectados';
      
      // El apiClient usa fetch, no Axios, por lo que el manejo de errores es diferente
      if (error.message) {
        if (error.message.includes('HTTP error!')) {
          // Error HTTP del servidor
          console.error('💥 [RISK-REPO] Error HTTP del servidor detectado');
          errorMessage = `Error del servidor: ${error.message}`;
        } else if (error.message.includes('Failed to fetch')) {
          // Error de red
          console.error('💥 [RISK-REPO] Error de red detectado');
          errorMessage = 'Error de conexión: No se pudo conectar con el servidor';
        } else {
          // Error personalizado
          console.error('💥 [RISK-REPO] Error personalizado detectado');
          errorMessage = error.message;
        }
      }
      
      console.error('💥 [RISK-REPO] Mensaje de error final:', errorMessage);
      throw new Error(errorMessage);
    }
  }
}
