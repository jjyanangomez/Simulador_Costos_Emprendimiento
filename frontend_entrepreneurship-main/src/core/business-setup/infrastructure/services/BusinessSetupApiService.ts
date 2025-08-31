// 🌐 SERVICIO API PARA ANÁLISIS DE CONFIGURACIÓN DE NEGOCIO
// Conecta el frontend con el backend para usar la IA real

export interface BusinessSetupData {
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
}

export interface AIAnalysisResponse {
  isViable: boolean;
  score: number;
  riskLevel: 'low' | 'medium' | 'high';
  financialHealth: 'good' | 'fair' | 'poor';
  businessInsights: string[];
  warnings: string[];
  recommendations: string[];
  analysisBreakdown?: {
    nombreNegocio?: { score: number; maxScore: number; evaluation: string };
    ubicacion?: { score: number; maxScore: number; evaluation: string };
    categoria?: { score: number; maxScore: number; evaluation: string };
    capacidadTamano?: { score: number; maxScore: number; evaluation: string };
    financiero?: { score: number; maxScore: number; evaluation: string };
    diversificacion?: { score: number; maxScore: number; evaluation: string };
    coherencia?: { score: number; maxScore: number; evaluation: string };
    bonificaciones?: { score: number; maxScore: number; evaluation: string };
  };
}

export interface APIResponse {
  success: boolean;
  data: AIAnalysisResponse;
  timestamp: string;
  duration: string;
}

export class BusinessSetupApiService {
  private static readonly BASE_URL = 'http://localhost:3000';
  private static readonly ENDPOINT = '/ai/analyze-business-setup';

  /**
   * 🤖 Envía los datos del negocio al backend para análisis con IA real
   * @param businessData - Datos del negocio a analizar
   * @returns Promise con el resultado del análisis
   */
  static async analyzeWithBackendAI(businessData: BusinessSetupData): Promise<AIAnalysisResponse> {
    try {
      console.log('🌐 [API-SERVICE] Enviando datos al backend para análisis...');
      console.log('📤 [API-SERVICE] Datos a enviar:', businessData);

      const response = await fetch(`${this.BASE_URL}${this.ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(businessData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result: APIResponse = await response.json();
      
      console.log('✅ [API-SERVICE] Respuesta del backend recibida:', result);

      if (!result.success) {
        throw new Error('El backend reportó un error en el análisis');
      }

      // Validar que la respuesta tenga la estructura esperada
      this.validateAIResponse(result.data);

      return result.data;

    } catch (error) {
      console.error('❌ [API-SERVICE] Error al conectar con el backend:', error);
      
      // Si hay error de conexión, lanzar error específico
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.');
      }
      
      throw error;
    }
  }

  /**
   * 🔍 Valida que la respuesta de la IA tenga la estructura correcta
   * @private
   */
  private static validateAIResponse(data: any): void {
    const requiredFields = ['isViable', 'score', 'riskLevel', 'financialHealth', 'businessInsights', 'warnings', 'recommendations'];
    
    for (const field of requiredFields) {
      if (!(field in data)) {
        throw new Error(`Respuesta inválida: falta el campo '${field}'`);
      }
    }

    // Validar tipos específicos
    if (typeof data.isViable !== 'boolean') {
      throw new Error('Respuesta inválida: isViable debe ser boolean');
    }

    if (typeof data.score !== 'number' || data.score < 0 || data.score > 100) {
      throw new Error('Respuesta inválida: score debe ser un número entre 0 y 100');
    }

    if (!['low', 'medium', 'high'].includes(data.riskLevel)) {
      throw new Error('Respuesta inválida: riskLevel debe ser low, medium o high');
    }

    if (!['good', 'fair', 'poor'].includes(data.financialHealth)) {
      throw new Error('Respuesta inválida: financialHealth debe ser good, fair o poor');
    }

    if (!Array.isArray(data.businessInsights) || !Array.isArray(data.warnings) || !Array.isArray(data.recommendations)) {
      throw new Error('Respuesta inválida: businessInsights, warnings y recommendations deben ser arrays');
    }
  }

  /**
   * 🏃‍♂️ Prueba rápida de conectividad con el backend
   * @returns Promise<boolean> - true si el backend está disponible
   */
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      return response.ok;
    } catch (error) {
      console.warn('⚠️ [API-SERVICE] Backend no disponible:', error);
      return false;
    }
  }

  /**
   * 📊 Obtiene estadísticas del servicio (para debug)
   */
  static getServiceInfo(): {
    baseUrl: string;
    endpoint: string;
    fullUrl: string;
  } {
    return {
      baseUrl: this.BASE_URL,
      endpoint: this.ENDPOINT,
      fullUrl: `${this.BASE_URL}${this.ENDPOINT}`
    };
  }
}

