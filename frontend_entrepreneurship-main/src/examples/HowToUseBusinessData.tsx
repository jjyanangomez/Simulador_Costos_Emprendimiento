// EJEMPLO COMPLETO: Cómo recuperar y usar los datos del análisis de negocio

import React, { useEffect, useState } from 'react';
import { 
  useBusinessAnalysisData,
  getBusinessAnalysisData,
  BusinessAnalysisData,
  hasBusinessAnalysisData,
  isLastAnalysisViable,
  getFormattedBusinessSummary,
  clearBusinessAnalysisData
} from '../shared/utils/businessAnalysisStorage';
import { BusinessSummaryCard } from '../shared/components/BusinessSummaryCard';

export function HowToUseBusinessData() {
  const [datos, setDatos] = useState<BusinessAnalysisData | null>(null);
  
  // Método 1: Usar el hook personalizado (MÁS FÁCIL)
  const { 
    businessData, 
    hasData, 
    isViable, 
    formattedSummary,
    clearData 
  } = useBusinessAnalysisData();

  useEffect(() => {
    // Método 2: Obtener datos manualmente
    const datosGuardados = getBusinessAnalysisData();
    setDatos(datosGuardados);
    
    // Método 3: Verificaciones rápidas
    console.log('¿Hay datos guardados?', hasBusinessAnalysisData());
    console.log('¿Último análisis viable?', isLastAnalysisViable());
    console.log('Resumen formateado:', getFormattedBusinessSummary());
  }, []);

  // Si no hay datos
  if (!hasData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">
            📊 No hay datos del análisis
          </h2>
          <p className="text-yellow-700 mb-4">
            Primero debes completar la configuración del negocio y el análisis de IA.
          </p>
          <button 
            onClick={() => window.location.href = '/business-setup'}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
          >
            Ir a Configuración del Negocio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        📋 Ejemplo: Cómo Usar los Datos del Negocio
      </h1>

      {/* Método 1: Usando el hook */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-blue-800 mb-4">
          🎣 Método 1: Usando el Hook (useBusinessAnalysisData)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Datos del Hook:</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Nombre: {businessData?.businessName}</li>
              <li>• Ubicación: {businessData?.sector}</li>
              <li>• Capacidad: {businessData?.capacity} personas</li>
              <li>• Inversión: ${businessData?.totalInvestment.toLocaleString()}</li>
              <li>• Viable: {isViable ? 'Sí ✅' : 'No ❌'}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Estados:</h3>
            <ul className="text-sm text-blue-600 space-y-1">
              <li>• Tiene datos: {hasData ? 'Sí' : 'No'}</li>
              <li>• Es viable: {isViable ? 'Sí' : 'No'}</li>
              <li>• Resumen: {formattedSummary}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Método 2: Datos manuales */}
      {datos && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-green-800 mb-4">
            🔧 Método 2: Datos Obtenidos Manualmente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Datos Básicos:</h3>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Nombre: {datos.businessName}</li>
                <li>• Categoría: {datos.businessCategory}</li>
                <li>• Sector: {datos.sector}</li>
                <li>• Tamaño: {datos.businessSize}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Datos Financieros:</h3>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Financiamiento: {datos.financingType}</li>
                <li>• Capital propio: ${datos.ownCapital.toLocaleString()}</li>
                <li>• Préstamo: ${datos.loanCapital.toLocaleString()}</li>
                <li>• Interés: {datos.interestRate}%</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Análisis IA:</h3>
              <ul className="text-sm text-green-600 space-y-1">
                <li>• Viable: {datos.aiAnalysis.isViable ? 'Sí' : 'No'}</li>
                <li>• Puntuación: {datos.aiAnalysis.score}</li>
                <li>• Riesgo: {datos.aiAnalysis.riskLevel}</li>
                <li>• Salud: {datos.aiAnalysis.financialHealth}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Método 3: Componente visual */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-purple-800 mb-4">
          🎨 Método 3: Componente Visual Reutilizable
        </h2>
        <BusinessSummaryCard showFullDetails={true} />
      </div>

      {/* Método 4: Ejemplos de uso práctico */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          💡 Método 4: Ejemplos de Uso Práctico
        </h2>
        
        {businessData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 mb-2">Cálculos para Costos Fijos:</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  <strong>Alquiler sugerido:</strong> 
                  ${Math.round(businessData.totalInvestment * 0.1).toLocaleString()}/mes
                  <br />
                  <span className="text-xs text-gray-500">(10% de la inversión total)</span>
                </li>
                <li>
                  <strong>Personal estimado:</strong> 
                  ${Math.round(businessData.capacity * 400).toLocaleString()}/mes
                  <br />
                  <span className="text-xs text-gray-500">($400 por persona de capacidad)</span>
                </li>
                <li>
                  <strong>Servicios básicos:</strong> 
                  ${Math.round(businessData.capacity * 5).toLocaleString()}/mes
                  <br />
                  <span className="text-xs text-gray-500">(Basado en capacidad)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-semibold text-gray-700 mb-2">Recomendaciones de IA:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {businessData.aiAnalysis.recommendations.slice(0, 3).map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Controles */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-800 mb-4">
          🗑️ Limpiar Datos
        </h2>
        <p className="text-red-700 mb-4">
          Si necesitas limpiar los datos guardados (por ejemplo, para empezar un nuevo análisis):
        </p>
        <button 
          onClick={() => {
            clearData();
            window.location.reload();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Limpiar Todos los Datos
        </button>
      </div>

      {/* Código de ejemplo */}
      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
          💻 Ver Código de Ejemplo
        </summary>
        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg text-xs overflow-auto">
{`// Importar utilidades
import { useBusinessAnalysisData } from '../shared/utils/businessAnalysisStorage';

function MiComponente() {
  const { businessData, hasData, isViable } = useBusinessAnalysisData();
  
  if (!hasData) {
    return <div>No hay datos</div>;
  }
  
  return (
    <div>
      <h2>{businessData.businessName}</h2>
      <p>Inversión: $\{businessData.totalInvestment}</p>
      <p>Estado: {isViable ? 'Viable' : 'No Viable'}</p>
    </div>
  );
}`}
        </pre>
      </details>
    </div>
  );
}
