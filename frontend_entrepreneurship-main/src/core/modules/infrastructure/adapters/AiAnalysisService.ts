import { apiClient } from '../../../../shared/infrastructure/http/api-client';

export interface BusinessInfo {
  tipoNegocio: string;
  tamano: string;
  ubicacion: string;
}

export interface CostRecord {
  name: string;
  amount: string;
}

export interface ValidationResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
  duration: string;
}

export interface AnalysisResult {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
  duration: string;
  validationResult?: any;
}

export class AiAnalysisService {
  
  /**
   * Paso 1: Validación rápida de costos (2-3 segundos)
   */
  async validateCosts(costs: CostRecord[], businessInfo: BusinessInfo): Promise<ValidationResult> {
    try {
      console.log('🔍 [FRONTEND-AI] Iniciando validación rápida...');
      console.log('📊 [FRONTEND-AI] Datos a enviar:', { costs, businessInfo });
      
      const requestBody = {
        costs,
        businessInfo
      };
      
      console.log('📤 [FRONTEND-AI] Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await apiClient.post<ValidationResult>('/ai/validate-costs', requestBody);
      
      console.log('✅ [FRONTEND-AI] Validación completada:', response);
      console.log('📊 [FRONTEND-AI] Estructura de respuesta:', JSON.stringify(response, null, 2));
      console.log('📊 [FRONTEND-AI] response.data:', response.data);
      console.log('📊 [FRONTEND-AI] response.data.validacion_de_costos:', response.data?.validacion_de_costos);
      console.log('📊 [FRONTEND-AI] response.data.costos_obligatorios_faltantes:', response.data?.costos_obligatorios_faltantes);
      console.log('📊 [FRONTEND-AI] response.data.resumen_validacion:', response.data?.resumen_validacion);
      return response;
    } catch (error) {
      console.error('💥 [FRONTEND-AI] Error en validación:', error);
      throw new Error('Error al validar los costos');
    }
  }

  /**
   * Paso 2: Análisis detallado de costos (5-8 segundos)
   */
  async analyzeCosts(
    costs: CostRecord[], 
    businessInfo: BusinessInfo, 
    validationResult: any
  ): Promise<AnalysisResult> {
    try {
      console.log('📊 [FRONTEND-AI] Iniciando análisis detallado...');
      
      const response = await apiClient.post<AnalysisResult>('/ai/analyze-costs', {
        costs,
        businessInfo,
        validationResult
      });
      
      console.log('✅ [FRONTEND-AI] Análisis completado:', response);
      return response;
    } catch (error) {
      console.error('💥 [FRONTEND-AI] Error en análisis:', error);
      throw new Error('Error al analizar los costos');
    }
  }

  /**
   * Paso 3: Análisis final con recomendaciones (3-5 segundos)
   */
  async finalAnalysis(
    costs: CostRecord[], 
    businessInfo: BusinessInfo, 
    previousResults: any
  ): Promise<AnalysisResult> {
    try {
      console.log('🎯 [FRONTEND-AI] Iniciando análisis final...');
      
      const response = await apiClient.post<AnalysisResult>('/ai/final-analysis', {
        costs,
        businessInfo,
        validationResult: previousResults
      });
      
      console.log('✅ [FRONTEND-AI] Análisis final completado:', response);
      return response;
    } catch (error) {
      console.error('💥 [FRONTEND-AI] Error en análisis final:', error);
      throw new Error('Error al realizar el análisis final');
    }
  }

  /**
   * Flujo completo optimizado
   */
  async completeAnalysis(costs: CostRecord[], businessInfo: BusinessInfo) {
    try {
      console.log('🚀 [FRONTEND-AI] Iniciando flujo completo optimizado...');
      
      // Paso 1: Validación rápida
      const validationResult = await this.validateCosts(costs, businessInfo);
      
      if (!validationResult.success) {
        console.log('❌ [FRONTEND-AI] Validación falló, deteniendo flujo');
        return validationResult;
      }

      // Paso 2: Análisis detallado (solo si pasa validación)
      const analysisResult = await this.analyzeCosts(costs, businessInfo, validationResult.data);
      
      if (!analysisResult.success) {
        console.log('❌ [FRONTEND-AI] Análisis falló, retornando validación');
        return {
          ...validationResult,
          analysisError: analysisResult.error
        };
      }

      // Paso 3: Análisis final (opcional)
      const finalResult = await this.finalAnalysis(costs, businessInfo, analysisResult.data);
      
      console.log('🎉 [FRONTEND-AI] Flujo completo finalizado');
      
      return {
        success: true,
        validation: validationResult,
        analysis: analysisResult,
        final: finalResult,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('💥 [FRONTEND-AI] Error en flujo completo:', error);
      throw error;
    }
  }
}
