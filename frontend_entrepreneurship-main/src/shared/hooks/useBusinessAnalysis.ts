// 🎣 HOOK PERSONALIZADO PARA USAR EL SERVICIO DE ANÁLISIS DE NEGOCIO
// Este hook facilita el uso del BusinessAnalysisService en componentes React

import { useState, useEffect, useCallback } from 'react';
import { BusinessAnalysisService } from '../services/BusinessAnalysisService';
import { BusinessAnalysisData } from '../utils/businessAnalysisStorage';

export interface UseBusinessAnalysisReturn {
  // Datos
  businessData: BusinessAnalysisData | null;
  businessOnly: Partial<BusinessAnalysisData> | null;
  aiAnalysisOnly: BusinessAnalysisData['aiAnalysis'] | null;
  
  // Estados
  hasData: boolean;
  isViable: boolean;
  isRecent: boolean;
  isLoading: boolean;
  
  // Información formateada
  formattedSummary: string | null;
  financialSummary: ReturnType<typeof BusinessAnalysisService.getFinancialSummary>;
  costSuggestions: ReturnType<typeof BusinessAnalysisService.calculateFixedCostsSuggestions>;
  businessMetrics: ReturnType<typeof BusinessAnalysisService.getBusinessMetrics>;
  
  // Validaciones
  pageAccess: (requireViable?: boolean, requireRecent?: boolean) => { hasAccess: boolean, reason?: string };
  
  // Acciones
  refreshData: () => void;
  clearData: () => boolean;
  updateAnalysis: (newAnalysis: BusinessAnalysisData['aiAnalysis']) => boolean;
  exportData: () => string | null;
  importData: (jsonData: string) => boolean;
  
  // Debug
  debugInfo: ReturnType<typeof BusinessAnalysisService.getDebugInfo>;
}

/**
 * 🎣 Hook personalizado para manejar datos del análisis de negocio
 * 
 * @example
 * ```tsx
 * const { businessData, hasData, isViable, costSuggestions } = useBusinessAnalysis();
 * 
 * if (!hasData) {
 *   return <div>No hay datos</div>;
 * }
 * 
 * return (
 *   <div>
 *     <h1>{businessData.businessName}</h1>
 *     <p>Alquiler sugerido: ${costSuggestions.rent}</p>
 *   </div>
 * );
 * ```
 */
export function useBusinessAnalysis(): UseBusinessAnalysisReturn {
  const [businessData, setBusinessData] = useState<BusinessAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Función para cargar datos
  const loadData = useCallback(() => {
    setIsLoading(true);
    try {
      const data = BusinessAnalysisService.getBusinessAnalysisData();
      setBusinessData(data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setBusinessData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Función para refrescar datos
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  // Función para limpiar datos
  const clearData = useCallback(() => {
    const success = BusinessAnalysisService.clearAllData();
    if (success) {
      setBusinessData(null);
    }
    return success;
  }, []);

  // Función para actualizar solo el análisis
  const updateAnalysis = useCallback((newAnalysis: BusinessAnalysisData['aiAnalysis']) => {
    const success = BusinessAnalysisService.updateAnalysisOnly(newAnalysis);
    if (success) {
      refreshData();
    }
    return success;
  }, [refreshData]);

  // Función para verificar acceso a páginas
  const pageAccess = useCallback((requireViable: boolean = true, requireRecent: boolean = false) => {
    return BusinessAnalysisService.checkPageAccess(requireViable, requireRecent);
  }, []);

  // Función para exportar datos
  const exportData = useCallback(() => {
    return BusinessAnalysisService.exportData();
  }, []);

  // Función para importar datos
  const importData = useCallback((jsonData: string) => {
    const success = BusinessAnalysisService.importData(jsonData);
    if (success) {
      refreshData();
    }
    return success;
  }, [refreshData]);

  // Datos derivados que se recalculan cuando cambian los datos principales
  const derivedData = {
    businessOnly: BusinessAnalysisService.getBusinessDataOnly(),
    aiAnalysisOnly: BusinessAnalysisService.getAIAnalysisOnly(),
    hasData: BusinessAnalysisService.hasData(),
    isViable: BusinessAnalysisService.isLastAnalysisViable(),
    isRecent: BusinessAnalysisService.isDataRecent(),
    formattedSummary: BusinessAnalysisService.getFormattedSummary(),
    financialSummary: BusinessAnalysisService.getFinancialSummary(),
    costSuggestions: BusinessAnalysisService.calculateFixedCostsSuggestions(),
    businessMetrics: BusinessAnalysisService.getBusinessMetrics(),
    debugInfo: BusinessAnalysisService.getDebugInfo()
  };

  return {
    // Datos principales
    businessData,
    
    // Datos derivados
    ...derivedData,
    
    // Estados
    isLoading,
    
    // Funciones
    refreshData,
    clearData,
    updateAnalysis,
    pageAccess,
    exportData,
    importData
  };
}

/**
 * 🛡️ Hook para proteger páginas que requieren análisis viable
 * 
 * @param requireRecent - Si requiere que los datos sean recientes
 * @returns Objeto con estado de acceso y componente de guard
 * 
 * @example
 * ```tsx
 * function FixedCostsPage() {
 *   const { hasAccess, AccessGuard } = useBusinessAnalysisGuard();
 *   
 *   if (!hasAccess) {
 *     return <AccessGuard />;
 *   }
 *   
 *   return <div>Contenido de costos fijos</div>;
 * }
 * ```
 */
export function useBusinessAnalysisGuard(requireRecent: boolean = false) {
  const { hasData, isViable, businessData } = useBusinessAnalysis();
  const access = BusinessAnalysisService.checkPageAccess(true, requireRecent);

  const AccessGuard = () => {
    if (!hasData) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-yellow-800 mb-2">
              📊 Análisis de Negocio Requerido
            </h2>
            <p className="text-yellow-700 mb-4">
              Debes completar la configuración del negocio y el análisis de IA antes de acceder a esta página.
            </p>
            <button 
              onClick={() => window.location.href = '/business-setup'}
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 font-medium"
            >
              Ir a Configuración del Negocio
            </button>
          </div>
        </div>
      );
    }

    if (!isViable) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">
              🚫 Acceso Restringido
            </h2>
            <p className="text-red-700 mb-2">
              Solo negocios viables pueden acceder a esta funcionalidad.
            </p>
            <p className="text-red-600 text-sm mb-4">
              Negocio: {businessData?.businessName} - Estado: No Viable
            </p>
            <div className="space-x-3">
              <button 
                onClick={() => window.location.href = '/business-setup'}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
              >
                Regresar y Ajustar Negocio
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium"
              >
                Ir al Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null; // No mostrar nada si hay acceso
  };

  return {
    hasAccess: access.hasAccess,
    reason: access.reason,
    AccessGuard
  };
}

/**
 * 💰 Hook especializado para cálculos financieros
 * 
 * @returns Funciones y datos para cálculos financieros específicos
 * 
 * @example
 * ```tsx
 * const { calculateMonthlyExpenses, getBreakEvenPoint } = useBusinessFinancials();
 * ```
 */
export function useBusinessFinancials() {
  const { businessData, costSuggestions, financialSummary } = useBusinessAnalysis();

  const calculateMonthlyExpenses = useCallback((additionalCosts: { [key: string]: number } = {}) => {
    if (!costSuggestions) return null;

    const baseCosts = {
      rent: costSuggestions.rent,
      staff: costSuggestions.staff,
      utilities: costSuggestions.utilities,
      insurance: costSuggestions.insurance
    };

    const totalAdditionalCosts = Object.values(additionalCosts).reduce((sum, cost) => sum + cost, 0);
    const totalMonthlyCosts = costSuggestions.total + totalAdditionalCosts;

    return {
      baseCosts,
      additionalCosts,
      totalMonthlyCosts,
      breakdown: { ...baseCosts, ...additionalCosts }
    };
  }, [costSuggestions]);

  const calculateBreakEvenPoint = useCallback((averageTicket: number, monthlyCosts: number) => {
    if (!businessData || averageTicket <= 0) return null;

    const dailySales = monthlyCosts / 30;
    const transactionsPerDay = dailySales / averageTicket;
    const utilizationRate = (transactionsPerDay / businessData.capacity) * 100;

    return {
      transactionsPerDay: Math.ceil(transactionsPerDay),
      transactionsPerMonth: Math.ceil(transactionsPerDay * 30),
      utilizationRate: Math.round(utilizationRate),
      isRealistic: utilizationRate <= 70 // Consideramos realista hasta 70% de utilización
    };
  }, [businessData]);

  return {
    businessData,
    costSuggestions,
    financialSummary,
    calculateMonthlyExpenses,
    calculateBreakEvenPoint
  };
}
