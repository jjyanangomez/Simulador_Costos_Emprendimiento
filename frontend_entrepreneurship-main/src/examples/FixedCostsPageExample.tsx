// EJEMPLO: Cómo usar los datos del análisis de negocio en la página de costos fijos

import React, { useEffect, useState } from 'react';
import { BusinessSummaryCard } from '../shared/components/BusinessSummaryCard';
import { 
  useBusinessAnalysisData, 
  getBusinessAnalysisData, 
  BusinessAnalysisData 
} from '../shared/utils/businessAnalysisStorage';
import { ArrowLeft, Plus, DollarSign } from 'lucide-react';

export function FixedCostsPageExample() {
  const { businessData, hasData, isViable, formattedSummary } = useBusinessAnalysisData();
  const [businessInfo, setBusinessInfo] = useState<BusinessAnalysisData | null>(null);

  useEffect(() => {
    // Obtener los datos del análisis al cargar la página
    const analysisData = getBusinessAnalysisData();
    setBusinessInfo(analysisData);

    // Verificar si el usuario tiene acceso a esta página
    if (!analysisData || !analysisData.aiAnalysis.isViable) {
      console.warn('Usuario no tiene acceso a costos fijos: negocio no viable');
      // Aquí podrías redirigir de vuelta a la configuración
    }
  }, []);

  // Si no hay datos, mostrar mensaje
  if (!hasData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">
            Datos de Negocio No Encontrados
          </h2>
          <p className="text-yellow-700 mb-4">
            Debes completar la configuración del negocio antes de acceder a costos fijos.
          </p>
          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700">
            Ir a Configuración del Negocio
          </button>
        </div>
      </div>
    );
  }

  // Si el negocio no es viable, bloquear acceso
  if (!isViable) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Acceso Restringido
          </h2>
          <p className="text-red-700 mb-4">
            Solo negocios viables pueden acceder a la configuración de costos fijos.
          </p>
          <p className="text-red-600 text-sm mb-4">
            Negocio analizado: {formattedSummary}
          </p>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
            Regresar y Ajustar Negocio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button className="mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Costos Fijos</h1>
            <p className="text-gray-600">Define los costos fijos mensuales de tu negocio</p>
          </div>
        </div>
      </div>

      {/* Resumen del Negocio */}
      <BusinessSummaryCard showFullDetails={false} />

      {/* Información disponible del análisis */}
      {businessInfo && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">
            ✅ Datos Disponibles del Análisis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-green-700 font-medium">Inversión Total</p>
              <p className="text-green-900">${businessInfo.totalInvestment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Capacidad</p>
              <p className="text-green-900">{businessInfo.capacity} personas</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Financiamiento</p>
              <p className="text-green-900 capitalize">{businessInfo.financingType}</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Items de Inversión</p>
              <p className="text-green-900">{businessInfo.investmentItems.length} categorías</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Riesgo</p>
              <p className="text-green-900">{businessInfo.aiAnalysis.riskLevel.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-green-700 font-medium">Fecha Análisis</p>
              <p className="text-green-900">
                {new Date(businessInfo.analysisDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sección de Costos Fijos */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <DollarSign className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900">Costos Fijos Mensuales</h2>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Costo
          </button>
        </div>

        <div className="space-y-4">
          {/* Ejemplo: Usar datos del negocio para sugerir costos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">
              💡 Sugerencias Basadas en tu Negocio
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-700">Alquiler sugerido ({businessData?.sector}):</span>
                <span className="font-medium text-blue-900">
                  ${Math.round((businessData?.totalInvestment || 0) * 0.1).toLocaleString()}/mes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Personal estimado ({businessData?.capacity} personas):</span>
                <span className="font-medium text-blue-900">
                  ${Math.round((businessData?.capacity || 0) * 400).toLocaleString()}/mes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Servicios básicos:</span>
                <span className="font-medium text-blue-900">$200-400/mes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-700">Seguros y permisos:</span>
                <span className="font-medium text-blue-900">$150-300/mes</span>
              </div>
            </div>
          </div>

          {/* Lista de costos fijos */}
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 text-center py-8">
              Aquí irían los costos fijos que el usuario agregue...
            </p>
          </div>
        </div>
      </div>

      {/* Debug Info (remover en producción) */}
      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <summary className="cursor-pointer font-medium text-gray-700">
          🔧 Información de Debug (Datos Disponibles)
        </summary>
        <pre className="mt-2 text-xs text-gray-600 overflow-auto">
          {JSON.stringify(businessInfo, null, 2)}
        </pre>
      </details>
    </div>
  );
}
