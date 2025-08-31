// 🤖 Servicio para comunicación con el análisis de IA del backend
// Utiliza el servicio de IA del backend para análisis financiero avanzado

import { API_CONFIG } from '../../config/api.config';

export interface BusinessCostsData {
  tipoNegocio: string;
  ubicacion: string;
  costosFijos: any[];
  totalMonthly: number;
  totalYearly: number;
  costBreakdown: {
    mensual: number;
    semestral: number;
    anual: number;
  };
  businessInfo?: {
    name?: string;
    businessAnalysis?: any;
    businessDataOnly?: any;
  };
  metadata?: {
    fechaGeneracion: string;
    timestamp: number;
    version: string;
  };
}

export interface AiAnalysisResponse {
  success: boolean;
  respuesta?: string;
  error?: string;
  timestamp: string;
}

export class AiAnalysisBackendService {
  private static readonly BASE_URL = API_CONFIG.BASE_URL;
  private static readonly AI_ENDPOINT = '/ai/analizar';

  /**
   * 🎯 Analiza los costos del negocio usando IA del backend
   * @param businessData - Datos completos del negocio y costos
   * @returns Respuesta de la IA del backend
   */
  static async analyzeBusinessCosts(businessData: BusinessCostsData): Promise<AiAnalysisResponse> {
    try {
      console.log('🤖 [AI_BACKEND_SERVICE] Iniciando análisis de costos con IA del backend...');
      
      // Generar el prompt personalizado
      const prompt = this.generateFinancialAnalysisPrompt(businessData);
      
      console.log('📝 [AI_BACKEND_SERVICE] Prompt generado, enviando al backend...');
      
      // Enviar al backend
      const response = await fetch(`${this.BASE_URL}${this.AI_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('✅ [AI_BACKEND_SERVICE] Respuesta recibida del backend:', result);
      
      return {
        success: true,
        respuesta: result.respuesta,
        timestamp: new Date().toISOString(),
      };
      
    } catch (error) {
      console.error('❌ [AI_BACKEND_SERVICE] Error al analizar con IA del backend:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      };
    }
  }

  /**
   * 📝 Genera el prompt personalizado para análisis financiero
   * @param businessData - Datos del negocio
   * @returns Prompt formateado para la IA
   */
  private static generateFinancialAnalysisPrompt(businessData: BusinessCostsData): string {
    const {
      tipoNegocio,
      ubicacion,
      costosFijos,
      totalMonthly,
      totalYearly,
      costBreakdown,
      businessInfo,
      metadata
    } = businessData;

    // Construir el prompt según la especificación del usuario
    const prompt = `Actúa como un asesor financiero de élite y analista de riesgos, especializado en la rentabilidad y optimización de costos para ${tipoNegocio} en ${ubicacion}. Tu análisis debe ser preciso, práctico y basado en datos del mercado local.

Contexto
Soy un emprendedor con un ${tipoNegocio} en ${ubicacion} y necesito un diagnóstico financiero experto. He pasado por un proceso de validación previa donde:

Se confirmó que mis costos son efectivamente costos fijos
Se identificaron costos obligatorios y recomendados que me faltaban
Se corrigieron errores de formato y especificidad

Ahora tengo una lista completa y técnicamente correcta de costos fijos. Tu misión es auditar estos números validados contra el mercado local de ${ubicacion} y alertarme sobre riesgos operativos y oportunidades de optimización financiera.

Nota importante: Los costos de personal (sueldos, salarios, honorarios, nómina) han sido excluidos de este análisis según el proceso de validación previa.

Información del Negocio:
${JSON.stringify({
  tipoNegocio,
  ubicacion,
  costosFijos,
  totales: {
    mensual: totalMonthly,
    anual: totalYearly,
    desglose: costBreakdown
  },
  informacionAdicional: businessInfo,
  metadata
}, null, 2)}

Por favor, proporciona un análisis estructurado que incluya:

1. **DIAGNÓSTICO FINANCIERO ACTUAL**
   - Evaluación de la estructura de costos
   - Comparación con estándares del mercado local
   - Identificación de costos críticos vs. opcionales

2. **RIESGOS OPERATIVOS DETECTADOS**
   - Costos que podrían escalar rápidamente
   - Dependencias de proveedores o servicios
   - Vulnerabilidades financieras identificadas

3. **OPORTUNIDADES DE OPTIMIZACIÓN**
   - Costos que podrían reducirse o negociarse
   - Alternativas más económicas disponibles
   - Estrategias de ahorro recomendadas

4. **RECOMENDACIONES ESTRATÉGICAS**
   - Prioridades de acción inmediata
   - Plan de monitoreo de costos
   - Indicadores de alerta financiera

5. **PROYECCIÓN FINANCIERA**
   - Estimación de costos futuros
   - Escenarios de crecimiento vs. contracción
   - Puntos de inflexión financieros

Responde en formato estructurado y profesional, con recomendaciones específicas y accionables.`;

    return prompt;
  }

  /**
   * 🔍 Valida que los datos del negocio sean completos
   * @param businessData - Datos a validar
   * @returns true si los datos son válidos
   */
  static validateBusinessData(businessData: BusinessCostsData): boolean {
    if (!businessData.tipoNegocio || !businessData.ubicacion) {
      console.warn('⚠️ [AI_BACKEND_SERVICE] Datos del negocio incompletos');
      return false;
    }

    if (!businessData.costosFijos || businessData.costosFijos.length === 0) {
      console.warn('⚠️ [AI_BACKEND_SERVICE] No hay costos fijos para analizar');
      return false;
    }

    if (businessData.totalMonthly <= 0 && businessData.totalYearly <= 0) {
      console.warn('⚠️ [AI_BACKEND_SERVICE] Totales de costos inválidos');
      return false;
    }

    return true;
  }

  /**
   * 📊 Prepara los datos del negocio para el análisis
   * @param completeBusinessData - Datos completos del negocio
   * @returns Datos formateados para el análisis de IA
   */
  static prepareDataForAnalysis(completeBusinessData: any): BusinessCostsData {
    try {
      // Extraer información del negocio
      const businessName = completeBusinessData.businessInfo?.name || 'Negocio';
      const businessAnalysis = completeBusinessData.businessInfo?.businessAnalysis;
      const businessDataOnly = completeBusinessData.businessInfo?.businessDataOnly;
      
      // Determinar tipo de negocio y ubicación
      let tipoNegocio = 'Negocio';
      let ubicacion = 'Ubicación no especificada';
      
      if (businessAnalysis?.businessCategory) {
        tipoNegocio = businessAnalysis.businessCategory;
      } else if (businessDataOnly?.businessCategory) {
        tipoNegocio = businessDataOnly.businessCategory;
      }
      
      if (businessAnalysis?.exactLocation) {
        ubicacion = businessAnalysis.exactLocation;
      } else if (businessDataOnly?.exactLocation) {
        ubicacion = businessDataOnly.exactLocation;
      } else if (businessAnalysis?.sector) {
        ubicacion = businessAnalysis.sector;
      }

      // Extraer costos fijos
      const costosFijos = completeBusinessData.costosFijos?.data?.costos || [];
      const totalMonthly = completeBusinessData.costosFijos?.data?.totalMonthly || 0;
      const totalYearly = completeBusinessData.costosFijos?.data?.totalYearly || 0;
      const costBreakdown = completeBusinessData.costosFijos?.data?.costBreakdown || {
        mensual: 0,
        semestral: 0,
        anual: 0
      };

      return {
        tipoNegocio,
        ubicacion,
        costosFijos,
        totalMonthly,
        totalYearly,
        costBreakdown,
        businessInfo: {
          name: businessName,
          businessAnalysis,
          businessDataOnly
        },
        metadata: completeBusinessData.metadata
      };
      
    } catch (error) {
      console.error('❌ [AI_BACKEND_SERVICE] Error al preparar datos para análisis:', error);
      throw new Error('Error al preparar datos para análisis de IA');
    }
  }

  /**
   * 🚀 Ejecuta el análisis completo: prepara datos y los envía a la IA
   * @param completeBusinessData - Datos completos del negocio
   * @returns Respuesta de la IA del backend
   */
  static async executeCompleteAnalysis(completeBusinessData: any): Promise<AiAnalysisResponse> {
    try {
      console.log('🚀 [AI_BACKEND_SERVICE] Iniciando análisis completo...');
      
      // 1. Preparar datos para el análisis
      const preparedData = this.prepareDataForAnalysis(completeBusinessData);
      
      // 2. Validar datos
      if (!this.validateBusinessData(preparedData)) {
        throw new Error('Datos del negocio incompletos o inválidos');
      }
      
      // 3. Ejecutar análisis con IA del backend
      const analysisResult = await this.analyzeBusinessCosts(preparedData);
      
      console.log('✅ [AI_BACKEND_SERVICE] Análisis completo finalizado');
      return analysisResult;
      
    } catch (error) {
      console.error('❌ [AI_BACKEND_SERVICE] Error en análisis completo:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
      };
    }
  }
}
