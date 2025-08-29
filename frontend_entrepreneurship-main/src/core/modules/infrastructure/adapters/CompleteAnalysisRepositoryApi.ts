import { config } from '../../../../config/environment';

export interface CompleteAnalysisResult {
  resultadoId: number;
  negocioId: number;
  moduloId: number;
  analisisId: number;
  fechaAnalisis: Date;
  costosAnalizados: any[];
  riesgosDetectados: any[];
  planAccion: any[];
  resumenAnalisis: any;
  estadoGuardado: string;
}

export interface SaveCompleteAnalysisRequest {
  negocioId: number;
  moduloId: number;
  analisisId: number;
  costosAnalizados: any[];
  riesgosDetectados: any[];
  planAccion: any[];
  resumenAnalisis?: any;
}

export class CompleteAnalysisRepositoryApi {
  private readonly baseUrl = config.api.baseURL;

  async saveCompleteAnalysis(data: SaveCompleteAnalysisRequest): Promise<CompleteAnalysisResult> {
    try {
      console.log('💾 [FRONTEND-REPO] Guardando análisis completo:', data);
      
      const response = await fetch(`${this.baseUrl}/ai/save-complete-results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al guardar análisis: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ [FRONTEND-REPO] Análisis guardado exitosamente:', result);
      
      return result.data;
    } catch (error) {
      console.error('❌ [FRONTEND-REPO] Error al guardar análisis:', error);
      throw error;
    }
  }

  async getCompleteAnalysis(negocioId: number, moduloId: number): Promise<CompleteAnalysisResult | null> {
    try {
      console.log(`🔍 [FRONTEND-REPO] Obteniendo análisis para negocio ${negocioId} y módulo ${moduloId}`);
      
      const response = await fetch(`${this.baseUrl}/ai/get-complete-results/${negocioId}/${moduloId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('❌ [FRONTEND-REPO] No se encontraron resultados');
          return null;
        }
        throw new Error(`Error al obtener análisis: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ [FRONTEND-REPO] Análisis obtenido exitosamente:', result);
      
      return result.data;
    } catch (error) {
      console.error('❌ [FRONTEND-REPO] Error al obtener análisis:', error);
      throw error;
    }
  }

  async saveCompleteAnalysisAlternative(data: SaveCompleteAnalysisRequest): Promise<CompleteAnalysisResult> {
    try {
      console.log('💾 [FRONTEND-REPO] Guardando análisis completo (endpoint alternativo):', data);
      
      const response = await fetch(`${this.baseUrl}/complete-analysis-results/save-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al guardar análisis: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ [FRONTEND-REPO] Análisis guardado exitosamente:', result);
      
      return result.data;
    } catch (error) {
      console.error('❌ [FRONTEND-REPO] Error al guardar análisis:', error);
      throw error;
    }
  }

  async getCompleteAnalysisAlternative(negocioId: number, moduloId: number): Promise<CompleteAnalysisResult | null> {
    try {
      console.log(`🔍 [FRONTEND-REPO] Obteniendo análisis (endpoint alternativo) para negocio ${negocioId} y módulo ${moduloId}`);
      
      const response = await fetch(`${this.baseUrl}/complete-analysis-results/negocio/${negocioId}/modulo/${moduloId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('❌ [FRONTEND-REPO] No se encontraron resultados');
          return null;
        }
        throw new Error(`Error al obtener análisis: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ [FRONTEND-REPO] Análisis obtenido exitosamente:', result);
      
      return result.data;
    } catch (error) {
      console.error('❌ [FRONTEND-REPO] Error al obtener análisis:', error);
      throw error;
    }
  }
}
