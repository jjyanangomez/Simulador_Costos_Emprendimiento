import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AiService } from './ai.service';
import { PromptService } from './prompt.service';
import { CompleteAnalysisResultService } from '../../mvc/services/complete-analysis-result.service';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
    private readonly completeAnalysisResultService: CompleteAnalysisResultService
  ) {}

  /**
   * Análisis detallado de costos (5-8 segundos)
   */
  async analyzeCosts(
    costs: Array<{ name: string; amount: string }>,
    businessInfo: { tipoNegocio: string; tamano: string; ubicacion: string },
    validationResult: any
  ) {
    try {
      console.log('📊 [ANALYSIS-SERVICE] Iniciando análisis detallado...');
      
      // Generar prompt para análisis detallado
      const prompt = this.promptService.generateAnalysisPrompt(costs, businessInfo, validationResult);
      
      console.log('📝 [ANALYSIS-SERVICE] Prompt generado, llamando a IA...');
      
      // Llamar a la IA con timeout estándar
      const response = await this.aiService.analyzePrompt(prompt, 15000); // 15 segundos timeout
      
      console.log('✅ [ANALYSIS-SERVICE] Respuesta de IA recibida');
      
      // Parsear la respuesta JSON
      const parsedResponse = this.parseAiResponse(response);
      
      console.log('🔄 [ANALYSIS-SERVICE] Respuesta parseada:', parsedResponse);
      
      return {
        success: true,
        data: parsedResponse,
        timestamp: new Date().toISOString(),
        duration: 'detailed_analysis',
        validationResult: validationResult
      };
      
    } catch (error) {
      console.error('💥 [ANALYSIS-SERVICE] Error en análisis:', error);
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        duration: 'detailed_analysis_failed'
      };
    }
  }

  /**
   * Análisis final con recomendaciones (3-5 segundos)
   */
  async finalAnalysis(
    costs: Array<{ name: string; amount: string }>,
    businessInfo: { tipoNegocio: string; tamano: string; ubicacion: string },
    previousResults: any
  ) {
    try {
      console.log('🎯 [ANALYSIS-SERVICE] Iniciando análisis final...');
      
      // Generar prompt para análisis final
      const prompt = this.promptService.generateFinalAnalysisPrompt(costs, businessInfo, previousResults);
      
      console.log('📝 [ANALYSIS-SERVICE] Prompt final generado, llamando a IA...');
      
      // Llamar a la IA con timeout más corto para análisis final
      const response = await this.aiService.analyzePrompt(prompt, 12000); // 12 segundos timeout
      
      console.log('✅ [ANALYSIS-SERVICE] Respuesta final de IA recibida');
      
      // Parsear la respuesta JSON
      const parsedResponse = this.parseAiResponse(response);
      
      console.log('🔄 [ANALYSIS-SERVICE] Respuesta final parseada:', parsedResponse);
      
      return {
        success: true,
        data: parsedResponse,
        timestamp: new Date().toISOString(),
        duration: 'final_analysis',
        previousResults: previousResults
      };
      
    } catch (error) {
      console.error('💥 [ANALYSIS-SERVICE] Error en análisis final:', error);
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        duration: 'final_analysis_failed'
      };
    }
  }

  /**
   * Parsea la respuesta de la IA para extraer el JSON
   */
  private parseAiResponse(response: string): any {
    try {
      // Intentar extraer JSON del response
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('💥 [ANALYSIS-SERVICE] Error parseando respuesta:', error);
      throw new Error('Respuesta de IA no válida');
    }
  }

  /**
   * Combina todos los resultados en un análisis completo
   */
  combineResults(validationResult: any, analysisResult: any, finalResult: any) {
    return {
      validation: validationResult,
      analysis: analysisResult,
      finalRecommendations: finalResult,
      summary: {
        totalDuration: 'optimized_flow',
        stepsCompleted: 3,
        timestamp: new Date().toISOString()
      }
    };
  }

  async saveCompleteAnalysisResults(
    negocioId: number,
    moduloId: number,
    analisisId: number,
    costosAnalizados: any[],
    riesgosDetectados: any[],
    planAccion: any[],
    resumenAnalisis?: any
  ): Promise<any> {
    console.log('💾 [ANALYSIS-SERVICE] Guardando resultados completos de análisis');
    console.log('📊 [ANALYSIS-SERVICE] Negocio ID:', negocioId);
    console.log('📚 [ANALYSIS-SERVICE] Módulo ID:', moduloId);
    console.log('🤖 [ANALYSIS-SERVICE] Análisis ID:', analisisId);

    try {
      const result = await this.completeAnalysisResultService.saveCompleteAnalysis(
        negocioId,
        moduloId,
        analisisId,
        costosAnalizados,
        riesgosDetectados,
        planAccion,
        resumenAnalisis
      );

      console.log('✅ [ANALYSIS-SERVICE] Resultados guardados exitosamente');
      return {
        success: true,
        message: 'Resultados de análisis guardados exitosamente',
        data: result
      };
    } catch (error) {
      console.error('❌ [ANALYSIS-SERVICE] Error al guardar resultados:', error);
      throw new InternalServerErrorException('Error al guardar los resultados de análisis');
    }
  }

  async getCompleteAnalysisResults(negocioId: number, moduloId: number): Promise<any> {
    console.log(`🔍 [ANALYSIS-SERVICE] Obteniendo resultados para negocio ${negocioId} y módulo ${moduloId}`);

    try {
      const result = await this.completeAnalysisResultService.findByNegocioAndModulo(negocioId, moduloId);
      
      if (!result) {
        return {
          success: false,
          message: 'No se encontraron resultados de análisis para este negocio y módulo',
          data: null
        };
      }

      return {
        success: true,
        message: 'Resultados de análisis encontrados',
        data: result
      };
    } catch (error) {
      console.error('❌ [ANALYSIS-SERVICE] Error al obtener resultados:', error);
      throw new InternalServerErrorException('Error al obtener los resultados de análisis');
    }
  }

  /**
   * Análisis completo de configuración de negocio con IA
   */
  async analyzeBusinessSetup(businessData: {
    businessName: string;
    businessCategory: string;
    sector: string;
    exactLocation?: string;
    businessSize: string;
    capacity: number;
    financingType: 'personal' | 'prestamo' | 'mixto';
    investmentItems: Array<{ description: string; amount: number; quantity?: number }>;
    ownCapital: number;
    loanCapital?: number;
    interestRate?: number;
  }) {
    try {
      console.log('🏢 [ANALYSIS-SERVICE] Iniciando análisis de configuración de negocio...');
      
      // Generar prompt especializado para análisis de negocio
      const prompt = this.generateBusinessSetupPrompt(businessData);
      
      console.log('📝 [ANALYSIS-SERVICE] Prompt generado, llamando a IA...');
      
      // Llamar a la IA con timeout estándar
      const response = await this.aiService.analyzePrompt(prompt, 20000); // 20 segundos timeout
      
      console.log('✅ [ANALYSIS-SERVICE] Respuesta de IA recibida');
      
      // Parsear la respuesta JSON
      const parsedResponse = this.parseBusinessAnalysisResponse(response);
      
      console.log('🔄 [ANALYSIS-SERVICE] Respuesta parseada:', parsedResponse);
      
      return {
        success: true,
        data: parsedResponse,
        timestamp: new Date().toISOString(),
        duration: 'business_setup_analysis'
      };
      
    } catch (error) {
      console.error('💥 [ANALYSIS-SERVICE] Error en análisis de negocio:', error);
      
      throw new InternalServerErrorException(
        `Error al realizar el análisis de configuración del negocio: ${error.message}`
      );
    }
  }

  /**
   * Genera el prompt especializado para análisis de configuración de negocio
   */
  private generateBusinessSetupPrompt(businessData: any): string {
    const totalInvestment = businessData.investmentItems.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
    const debtRatio = businessData.financingType === 'personal' ? 0 : (businessData.loanCapital || 0) / totalInvestment;
    
    const investmentItemsList = businessData.investmentItems
      .map((item: any, index: number) => `${index + 1}. ${item.description}: $${item.amount.toLocaleString()} ${item.quantity ? `(cantidad: ${item.quantity})` : ''}`)
      .join('\n');

    return `Eres un experto asesor de negocios especializado en análisis de viabilidad de emprendimientos en Ecuador. 
Tu tarea es realizar un análisis exhaustivo de la configuración de un nuevo negocio y determinar su viabilidad.

DATOS DEL NEGOCIO A ANALIZAR:
📊 Información Básica:
- Nombre del Negocio: ${businessData.businessName}
- Categoría: ${businessData.businessCategory}
- Sector/Ubicación: ${businessData.sector}
- Ubicación Exacta: ${businessData.exactLocation || 'No especificada'}
- Tamaño del Negocio: ${businessData.businessSize}
- Capacidad: ${businessData.capacity} personas

💰 Información Financiera:
- Tipo de Financiamiento: ${businessData.financingType}
- Capital Propio: $${businessData.ownCapital.toLocaleString()}
- Capital Préstamo: $${(businessData.loanCapital || 0).toLocaleString()}
- Tasa de Interés: ${businessData.interestRate || 0}%
- Inversión Total: $${totalInvestment.toLocaleString()}
- Ratio de Deuda: ${(debtRatio * 100).toFixed(1)}%

🛍️ Items de Inversión:
${investmentItemsList}

ANÁLISIS REQUERIDO:
Realiza un análisis completo considerando los siguientes aspectos:

1. **Análisis del Nombre del Negocio (5 puntos)**
   - Evalúa si el nombre es adecuado, memorable y refleja la actividad
   - Considera originalidad y potencial de marca

2. **Análisis de Ubicación (15 puntos)**
   - Evalúa la ubicación según zonas de Quito
   - Zonas Prime: Centro Histórico, La Mariscal, Cumbayá, La Carolina (+15 pts)
   - Zonas Buenas: Guápulo, Bellavista, La Floresta, Tumbaco (+10 pts)  
   - Zonas Regulares: Otras zonas (+5 pts)

3. **Análisis de Categoría de Negocio (10 puntos)**
   - Evalúa la demanda y viabilidad según el tipo de negocio
   - Alta demanda: cafetería, restaurante, panadería (+10 pts)
   - Media demanda: catering, comida rápida (+7 pts)
   - Baja demanda: otros (+3 pts)

4. **Análisis de Capacidad vs Tamaño (10 puntos)**
   - Evalúa coherencia entre capacidad y tamaño empresarial
   - Micro: ≤30 personas (+10 pts), >30 (+5 pts)
   - Pequeña: 20-80 personas (+10 pts), fuera del rango (+5 pts)

5. **Análisis Financiero Completo (25 puntos)**
   - Inversión total: <$10k (+5), $10k-$30k (+15), $30k-$50k (+20), >$50k (+25)
   - Ratio deuda: ≤40% (+15), ≤70% (+10), >70% (+0)
   - Tasa de interés: ≤10% (+5), ≤15% (+3), >15% (+0)

6. **Análisis de Diversificación (10 puntos)**
   - Evalúa distribución de inversiones
   - Bien diversificada: ≥3 categorías (+10)
   - Moderada: 2 categorías (+7)
   - Concentrada: 1 categoría (+3)

7. **Análisis de Coherencia (10 puntos)**
   - Evalúa coherencia entre todos los elementos del negocio

8. **Sistema de Bonificaciones (5 puntos)**
   - Bonificaciones por factores adicionales positivos

CRITERIOS DE VIABILIDAD:
- Puntuación ≥75 Y Riesgo = 'low' = VIABLE
- Puntuación <75 O Riesgo = 'medium'/'high' = NO VIABLE

RESPONDE ÚNICAMENTE EN FORMATO JSON CON LA SIGUIENTE ESTRUCTURA EXACTA:

{
  "isViable": true,
  "score": 85,
  "riskLevel": "low",
  "financialHealth": "good",
  "businessInsights": [
    "Excelente ubicación en zona comercial estratégica",
    "Inversión realista y bien distribuida",
    "Capacidad adecuada para el tamaño del negocio"
  ],
  "warnings": [
    "Considerar horarios de mayor demanda en la zona",
    "Evaluar competencia directa en el sector"
  ],
  "recommendations": [
    "Implementar sistema de reservas online",
    "Desarrollar programa de fidelización de clientes",
    "Considerar delivery para ampliar mercado"
  ],
  "analysisBreakdown": {
    "nombreNegocio": { "score": 4, "maxScore": 5, "evaluation": "Nombre claro y relacionado con la actividad" },
    "ubicacion": { "score": 15, "maxScore": 15, "evaluation": "Zona prime con alto tráfico comercial" },
    "categoria": { "score": 10, "maxScore": 10, "evaluation": "Alta demanda en el mercado local" },
    "capacidadTamano": { "score": 10, "maxScore": 10, "evaluation": "Coherencia perfecta entre capacidad y tamaño" },
    "financiero": { "score": 23, "maxScore": 25, "evaluation": "Estructura financiera sólida con bajo riesgo" },
    "diversificacion": { "score": 8, "maxScore": 10, "evaluation": "Buena distribución de inversiones" },
    "coherencia": { "score": 10, "maxScore": 10, "evaluation": "Excelente coherencia entre todos los elementos" },
    "bonificaciones": { "score": 5, "maxScore": 5, "evaluation": "Factores adicionales muy positivos" }
  }
}

IMPORTANTE: 
- NO incluyas texto explicativo fuera del JSON
- Asegúrate de que la puntuación total coincida con la suma de scores individuales
- Usa criterios específicos para Ecuador y el contexto local
- Sé realista pero constructivo en el análisis`;
  }

  /**
   * Parsea la respuesta de la IA para análisis de negocio
   */
  private parseBusinessAnalysisResponse(response: string): any {
    try {
      // Limpiar la respuesta para extraer solo el JSON
      let cleanResponse = response.trim();
      
      // Buscar el inicio y fin del JSON
      const jsonStart = cleanResponse.indexOf('{');
      const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd === 0) {
        throw new Error('No se encontró JSON válido en la respuesta');
      }
      
      cleanResponse = cleanResponse.substring(jsonStart, jsonEnd);
      
      // Parsear el JSON
      const parsedData = JSON.parse(cleanResponse);
      
      // Validar estructura básica
      if (!parsedData.hasOwnProperty('isViable') || 
          !parsedData.hasOwnProperty('score') || 
          !parsedData.hasOwnProperty('riskLevel')) {
        throw new Error('Estructura de respuesta inválida');
      }
      
      return parsedData;
      
    } catch (error) {
      console.error('❌ [ANALYSIS-SERVICE] Error al parsear respuesta de IA:', error);
      console.error('📄 [ANALYSIS-SERVICE] Respuesta recibida:', response);
      
      // Fallback con análisis básico
      return {
        isViable: false,
        score: 0,
        riskLevel: 'high',
        financialHealth: 'poor',
        businessInsights: [],
        warnings: ['Error en el análisis automático. Por favor, revise los datos ingresados.'],
        recommendations: ['Contacte con un asesor para análisis manual.'],
        analysisBreakdown: {
          error: 'No se pudo procesar el análisis completo'
        }
      };
    }
  }
}
