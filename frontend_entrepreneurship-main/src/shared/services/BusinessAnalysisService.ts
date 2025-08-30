// 🏢 SERVICIO COMPLETO PARA MANEJO DE DATOS DEL ANÁLISIS DE NEGOCIO
// Esta clase contiene todos los métodos necesarios para trabajar con los datos del análisis

import { BusinessAnalysisData, LastAnalysisSummary } from '../utils/businessAnalysisStorage';

export class BusinessAnalysisService {
  
  // 📋 CONSTANTES
  private static readonly BUSINESS_ANALYSIS_KEY = 'businessAnalysisData';
  private static readonly LAST_ANALYSIS_KEY = 'lastBusinessAnalysis';
  private static readonly EXPIRY_HOURS = 24;

  // ===== MÉTODOS DE ALMACENAMIENTO =====

  /**
   * 💾 Guarda los datos completos del análisis de negocio
   * @param businessData - Datos del formulario de negocio
   * @param analysisData - Resultados del análisis de IA
   * @returns boolean - Éxito de la operación
   */
  static saveBusinessAnalysis(businessData: any, analysisData: any): boolean {
    try {
      const totalInvestment = businessData.investmentItems?.reduce(
        (sum: number, item: any) => sum + (Number(item.amount) || 0), 0
      ) || 0;

      const businessSummary: BusinessAnalysisData = {
        // Datos básicos del negocio
        businessName: businessData.businessName || '',
        businessCategory: businessData.businessCategory || '',
        sector: businessData.sector || '',
        exactLocation: businessData.exactLocation || '',
        businessSize: businessData.businessSize || '',
        capacity: Number(businessData.capacity) || 0,
        
        // Datos financieros
        financingType: businessData.financingType || '',
        totalInvestment: totalInvestment,
        ownCapital: Number(businessData.ownCapital) || 0,
        loanCapital: Number(businessData.loanCapital) || 0,
        interestRate: Number(businessData.interestRate) || 0,
        
        // Items de inversión
        investmentItems: businessData.investmentItems || [],
        
        // Análisis de IA
        aiAnalysis: {
          isViable: analysisData.isViable || false,
          score: Number(analysisData.score) || 0,
          riskLevel: analysisData.riskLevel || 'high',
          financialHealth: analysisData.financialHealth || 'poor',
          recommendations: analysisData.recommendations || [],
          warnings: analysisData.warnings || [],
          businessInsights: analysisData.businessInsights || []
        },
        
        // Metadatos
        analysisDate: new Date().toISOString(),
        analysisId: `analysis_${Date.now()}`
      };

      // Guardar en localStorage
      localStorage.setItem(this.BUSINESS_ANALYSIS_KEY, JSON.stringify(businessSummary));
      
      // Guardar resumen del último análisis
      const lastAnalysis: LastAnalysisSummary = {
        businessName: businessData.businessName || '',
        isViable: analysisData.isViable || false,
        date: new Date().toISOString()
      };
      localStorage.setItem(this.LAST_ANALYSIS_KEY, JSON.stringify(lastAnalysis));

      console.log('✅ Datos del análisis guardados exitosamente');
      return true;
      
    } catch (error) {
      console.error('❌ Error al guardar datos del análisis:', error);
      return false;
    }
  }

  // ===== MÉTODOS DE RECUPERACIÓN =====

  /**
   * 📊 Obtiene todos los datos del análisis de negocio
   * @returns BusinessAnalysisData | null
   */
  static getBusinessAnalysisData(): BusinessAnalysisData | null {
    try {
      const data = localStorage.getItem(this.BUSINESS_ANALYSIS_KEY);
      if (!data) return null;
      
      const parsedData = JSON.parse(data) as BusinessAnalysisData;
      
      // Verificar si los datos no están corruptos
      if (!parsedData.businessName || !parsedData.aiAnalysis) {
        console.warn('⚠️ Datos corruptos detectados, limpiando...');
        this.clearAllData();
        return null;
      }
      
      return parsedData;
    } catch (error) {
      console.error('❌ Error al obtener datos del análisis:', error);
      return null;
    }
  }

  /**
   * 🏢 Obtiene solo los datos del negocio (sin análisis de IA)
   * @returns Partial<BusinessAnalysisData> | null
   */
  static getBusinessDataOnly(): Partial<BusinessAnalysisData> | null {
    const fullData = this.getBusinessAnalysisData();
    if (!fullData) return null;
    
    const { aiAnalysis, analysisDate, analysisId, ...businessData } = fullData;
    return businessData;
  }

  /**
   * 🤖 Obtiene solo el análisis de IA
   * @returns AIAnalysis | null
   */
  static getAIAnalysisOnly(): BusinessAnalysisData['aiAnalysis'] | null {
    const fullData = this.getBusinessAnalysisData();
    return fullData?.aiAnalysis || null;
  }

  /**
   * 📄 Obtiene el resumen del último análisis
   * @returns LastAnalysisSummary | null
   */
  static getLastAnalysisSummary(): LastAnalysisSummary | null {
    try {
      const data = localStorage.getItem(this.LAST_ANALYSIS_KEY);
      if (!data) return null;
      
      return JSON.parse(data) as LastAnalysisSummary;
    } catch (error) {
      console.error('❌ Error al obtener resumen del último análisis:', error);
      return null;
    }
  }

  // ===== MÉTODOS DE VALIDACIÓN =====

  /**
   * ✅ Verifica si hay datos de análisis disponibles
   * @returns boolean
   */
  static hasData(): boolean {
    return localStorage.getItem(this.BUSINESS_ANALYSIS_KEY) !== null;
  }

  /**
   * 🟢 Verifica si el último análisis fue viable
   * @returns boolean
   */
  static isLastAnalysisViable(): boolean {
    const summary = this.getLastAnalysisSummary();
    return summary?.isViable || false;
  }

  /**
   * ⏰ Verifica si los datos son recientes (menos de 24 horas)
   * @returns boolean
   */
  static isDataRecent(): boolean {
    const data = this.getBusinessAnalysisData();
    if (!data) return false;
    
    const analysisDate = new Date(data.analysisDate);
    const now = new Date();
    const diffHours = (now.getTime() - analysisDate.getTime()) / (1000 * 60 * 60);
    
    return diffHours < this.EXPIRY_HOURS;
  }

  /**
   * 🔒 Verifica si el usuario tiene acceso a una página específica
   * @param requireViable - Si requiere que el negocio sea viable
   * @param requireRecent - Si requiere que los datos sean recientes
   * @returns { hasAccess: boolean, reason?: string }
   */
  static checkPageAccess(requireViable: boolean = true, requireRecent: boolean = false): { hasAccess: boolean, reason?: string } {
    if (!this.hasData()) {
      return { hasAccess: false, reason: 'No hay datos de análisis disponibles' };
    }

    if (requireViable && !this.isLastAnalysisViable()) {
      return { hasAccess: false, reason: 'El negocio no es viable según el último análisis' };
    }

    if (requireRecent && !this.isDataRecent()) {
      return { hasAccess: false, reason: 'Los datos del análisis son muy antiguos (>24h)' };
    }

    return { hasAccess: true };
  }

  // ===== MÉTODOS DE FORMATO =====

  /**
   * 📝 Obtiene un resumen formateado del negocio
   * @returns string | null
   */
  static getFormattedSummary(): string | null {
    const data = this.getBusinessAnalysisData();
    if (!data) return null;
    
    return `${data.businessName} - ${data.businessCategory} en ${data.sector} (${data.capacity} personas, $${data.totalInvestment.toLocaleString()} inversión)`;
  }

  /**
   * 💰 Obtiene datos financieros formateados
   * @returns object | null
   */
  static getFinancialSummary(): { 
    totalInvestment: string;
    ownCapital: string;
    loanCapital: string;
    debtRatio: number;
    investmentPerPerson: number;
  } | null {
    const data = this.getBusinessAnalysisData();
    if (!data) return null;

    const debtRatio = data.loanCapital / data.totalInvestment;
    const investmentPerPerson = data.totalInvestment / data.capacity;

    return {
      totalInvestment: `$${data.totalInvestment.toLocaleString()}`,
      ownCapital: `$${data.ownCapital.toLocaleString()}`,
      loanCapital: `$${data.loanCapital.toLocaleString()}`,
      debtRatio: Math.round(debtRatio * 100),
      investmentPerPerson: Math.round(investmentPerPerson)
    };
  }

  // ===== MÉTODOS DE CÁLCULOS INTELIGENTES =====

  /**
   * 🏠 Calcula sugerencias de costos fijos basadas en el análisis
   * @returns object | null
   */
  static calculateFixedCostsSuggestions(): {
    rent: number;
    staff: number;
    utilities: number;
    insurance: number;
    total: number;
  } | null {
    const data = this.getBusinessAnalysisData();
    if (!data) return null;

    // Factores basados en ubicación
    const locationMultiplier = this.getLocationMultiplier(data.sector);
    
    // Factores basados en categoría
    const categoryMultiplier = this.getCategoryMultiplier(data.businessCategory);

    const rent = Math.round(data.totalInvestment * 0.1 * locationMultiplier);
    const staff = Math.round(data.capacity * 400 * categoryMultiplier);
    const utilities = Math.round(data.capacity * 8);
    const insurance = Math.round(data.totalInvestment * 0.02);
    
    return {
      rent,
      staff,
      utilities,
      insurance,
      total: rent + staff + utilities + insurance
    };
  }

  /**
   * 📍 Obtiene el multiplicador de ubicación para cálculos
   * @private
   */
  private static getLocationMultiplier(sector: string): number {
    const primeLocations = ['Centro Histórico', 'La Mariscal', 'Cumbayá', 'La Floresta'];
    const goodLocations = ['Guápulo', 'Bellavista', 'Tumbaco', 'Valle de los Chillos'];
    
    if (primeLocations.includes(sector)) return 1.5;
    if (goodLocations.includes(sector)) return 1.2;
    return 1.0;
  }

  /**
   * 🍽️ Obtiene el multiplicador de categoría para cálculos
   * @private
   */
  private static getCategoryMultiplier(category: string): number {
    const highStaffCategories = ['restaurante', 'catering'];
    const mediumStaffCategories = ['cafeteria', 'panaderia'];
    
    if (highStaffCategories.includes(category)) return 1.3;
    if (mediumStaffCategories.includes(category)) return 1.1;
    return 1.0;
  }

  /**
   * 📊 Obtiene métricas del negocio para dashboard
   * @returns object | null
   */
  static getBusinessMetrics(): {
    viabilityStatus: 'viable' | 'not-viable' | 'unknown';
    riskLevel: 'low' | 'medium' | 'high';
    financialHealth: 'good' | 'fair' | 'poor';
    score: number;
    daysSinceAnalysis: number;
    needsUpdate: boolean;
  } | null {
    const data = this.getBusinessAnalysisData();
    if (!data) return null;

    const analysisDate = new Date(data.analysisDate);
    const now = new Date();
    const daysSinceAnalysis = Math.floor((now.getTime() - analysisDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      viabilityStatus: data.aiAnalysis.isViable ? 'viable' : 'not-viable',
      riskLevel: data.aiAnalysis.riskLevel,
      financialHealth: data.aiAnalysis.financialHealth,
      score: data.aiAnalysis.score,
      daysSinceAnalysis,
      needsUpdate: daysSinceAnalysis > 7 // Sugerir actualización después de 7 días
    };
  }

  // ===== MÉTODOS DE LIMPIEZA =====

  /**
   * 🗑️ Limpia todos los datos del análisis
   * @returns boolean - Éxito de la operación
   */
  static clearAllData(): boolean {
    try {
      localStorage.removeItem(this.BUSINESS_ANALYSIS_KEY);
      localStorage.removeItem(this.LAST_ANALYSIS_KEY);
      console.log('🗑️ Todos los datos del análisis han sido eliminados');
      return true;
    } catch (error) {
      console.error('❌ Error al eliminar datos del análisis:', error);
      return false;
    }
  }

  /**
   * 🔄 Actualiza solo el análisis de IA manteniendo los datos del negocio
   * @param newAnalysis - Nuevo análisis de IA
   * @returns boolean - Éxito de la operación
   */
  static updateAnalysisOnly(newAnalysis: BusinessAnalysisData['aiAnalysis']): boolean {
    try {
      const existingData = this.getBusinessAnalysisData();
      if (!existingData) return false;

      existingData.aiAnalysis = newAnalysis;
      existingData.analysisDate = new Date().toISOString();
      existingData.analysisId = `analysis_${Date.now()}`;

      localStorage.setItem(this.BUSINESS_ANALYSIS_KEY, JSON.stringify(existingData));
      
      // Actualizar resumen
      const lastAnalysis: LastAnalysisSummary = {
        businessName: existingData.businessName,
        isViable: newAnalysis.isViable,
        date: new Date().toISOString()
      };
      localStorage.setItem(this.LAST_ANALYSIS_KEY, JSON.stringify(lastAnalysis));

      console.log('🔄 Análisis actualizado exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error al actualizar análisis:', error);
      return false;
    }
  }

  // ===== MÉTODOS DE EXPORTACIÓN/IMPORTACIÓN =====

  /**
   * 📤 Exporta los datos como JSON para backup
   * @returns string | null
   */
  static exportData(): string | null {
    const data = this.getBusinessAnalysisData();
    if (!data) return null;

    return JSON.stringify({
      businessAnalysisData: data,
      lastAnalysisSummary: this.getLastAnalysisSummary(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
  }

  /**
   * 📥 Importa datos desde JSON
   * @param jsonData - Datos en formato JSON
   * @returns boolean - Éxito de la operación
   */
  static importData(jsonData: string): boolean {
    try {
      const parsedData = JSON.parse(jsonData);
      
      if (parsedData.businessAnalysisData) {
        localStorage.setItem(this.BUSINESS_ANALYSIS_KEY, JSON.stringify(parsedData.businessAnalysisData));
      }
      
      if (parsedData.lastAnalysisSummary) {
        localStorage.setItem(this.LAST_ANALYSIS_KEY, JSON.stringify(parsedData.lastAnalysisSummary));
      }

      console.log('📥 Datos importados exitosamente');
      return true;
    } catch (error) {
      console.error('❌ Error al importar datos:', error);
      return false;
    }
  }

  // ===== MÉTODOS DE DEBUG =====

  /**
   * 🔧 Obtiene información de debug para desarrollo
   * @returns object
   */
  static getDebugInfo(): {
    hasData: boolean;
    dataSize: number;
    isRecent: boolean;
    isViable: boolean;
    lastUpdate: string;
    storageKeys: string[];
  } {
    const data = this.getBusinessAnalysisData();
    
    return {
      hasData: this.hasData(),
      dataSize: data ? JSON.stringify(data).length : 0,
      isRecent: this.isDataRecent(),
      isViable: this.isLastAnalysisViable(),
      lastUpdate: data?.analysisDate || 'Never',
      storageKeys: Object.keys(localStorage).filter(key => 
        key.includes('business') || key.includes('analysis')
      )
    };
  }
}
