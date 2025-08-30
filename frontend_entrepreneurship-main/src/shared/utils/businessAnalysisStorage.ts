// Utilidades para manejar el almacenamiento de datos del análisis de negocio

export interface BusinessAnalysisData {
  // Datos básicos del negocio
  businessName: string;
  businessCategory: string;
  sector: string;
  exactLocation: string;
  businessSize: string;
  capacity: number;
  
  // Datos financieros
  financingType: string;
  totalInvestment: number;
  ownCapital: number;
  loanCapital: number;
  interestRate: number;
  
  // Items de inversión
  investmentItems: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
  
  // Análisis de IA
  aiAnalysis: {
    isViable: boolean;
    score: number;
    riskLevel: 'low' | 'medium' | 'high';
    financialHealth: 'good' | 'fair' | 'poor';
    recommendations: string[];
    warnings: string[];
    businessInsights: string[];
  };
  
  // Metadatos
  analysisDate: string;
  analysisId: string;
}

export interface LastAnalysisSummary {
  businessName: string;
  isViable: boolean;
  date: string;
}

// Claves para localStorage
const BUSINESS_ANALYSIS_KEY = 'businessAnalysisData';
const LAST_ANALYSIS_KEY = 'lastBusinessAnalysis';

/**
 * Obtiene los datos completos del análisis de negocio
 */
export const getBusinessAnalysisData = (): BusinessAnalysisData | null => {
  try {
    const data = localStorage.getItem(BUSINESS_ANALYSIS_KEY);
    if (!data) return null;
    
    return JSON.parse(data) as BusinessAnalysisData;
  } catch (error) {
    console.error('Error al obtener datos del análisis:', error);
    return null;
  }
};

/**
 * Obtiene un resumen del último análisis realizado
 */
export const getLastAnalysisSummary = (): LastAnalysisSummary | null => {
  try {
    const data = localStorage.getItem(LAST_ANALYSIS_KEY);
    if (!data) return null;
    
    return JSON.parse(data) as LastAnalysisSummary;
  } catch (error) {
    console.error('Error al obtener resumen del último análisis:', error);
    return null;
  }
};

/**
 * Verifica si hay datos de análisis disponibles
 */
export const hasBusinessAnalysisData = (): boolean => {
  return localStorage.getItem(BUSINESS_ANALYSIS_KEY) !== null;
};

/**
 * Verifica si el último análisis fue viable
 */
export const isLastAnalysisViable = (): boolean => {
  const summary = getLastAnalysisSummary();
  return summary?.isViable || false;
};

/**
 * Obtiene solo los datos del negocio (sin análisis de IA)
 */
export const getBusinessDataOnly = (): Partial<BusinessAnalysisData> | null => {
  const fullData = getBusinessAnalysisData();
  if (!fullData) return null;
  
  const { aiAnalysis, analysisDate, analysisId, ...businessData } = fullData;
  return businessData;
};

/**
 * Obtiene solo el análisis de IA
 */
export const getAIAnalysisOnly = (): BusinessAnalysisData['aiAnalysis'] | null => {
  const fullData = getBusinessAnalysisData();
  return fullData?.aiAnalysis || null;
};

/**
 * Limpia todos los datos del análisis
 */
export const clearBusinessAnalysisData = (): void => {
  try {
    localStorage.removeItem(BUSINESS_ANALYSIS_KEY);
    localStorage.removeItem(LAST_ANALYSIS_KEY);
    console.log('Datos del análisis eliminados');
  } catch (error) {
    console.error('Error al eliminar datos del análisis:', error);
  }
};

/**
 * Obtiene información formateada para mostrar
 */
export const getFormattedBusinessSummary = (): string | null => {
  const data = getBusinessAnalysisData();
  if (!data) return null;
  
  return `${data.businessName} - ${data.businessCategory} en ${data.sector} (${data.capacity} personas, $${data.totalInvestment.toLocaleString()} inversión)`;
};

/**
 * Verifica si los datos son recientes (menos de 24 horas)
 */
export const isAnalysisDataRecent = (): boolean => {
  const data = getBusinessAnalysisData();
  if (!data) return false;
  
  const analysisDate = new Date(data.analysisDate);
  const now = new Date();
  const diffHours = (now.getTime() - analysisDate.getTime()) / (1000 * 60 * 60);
  
  return diffHours < 24;
};

/**
 * Hook personalizado para usar en componentes React
 */
export const useBusinessAnalysisData = () => {
  const data = getBusinessAnalysisData();
  const summary = getLastAnalysisSummary();
  
  return {
    businessData: data,
    lastAnalysis: summary,
    hasData: hasBusinessAnalysisData(),
    isViable: isLastAnalysisViable(),
    isRecent: isAnalysisDataRecent(),
    businessOnly: getBusinessDataOnly(),
    aiAnalysisOnly: getAIAnalysisOnly(),
    formattedSummary: getFormattedBusinessSummary(),
    clearData: clearBusinessAnalysisData
  };
};
