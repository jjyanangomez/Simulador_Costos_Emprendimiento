// 🎯 EJEMPLO COMPLETO: Cómo usar todas las funciones del análisis de negocio
// Este archivo muestra todos los métodos disponibles y cómo usarlos

import React, { useState } from 'react';
import { BusinessAnalysisService } from '../shared/services/BusinessAnalysisService';
import { 
  useBusinessAnalysis, 
  useBusinessAnalysisGuard, 
  useBusinessFinancials 
} from '../shared/hooks/useBusinessAnalysis';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  AlertCircle, 
  CheckCircle,
  DollarSign,
  BarChart3
} from 'lucide-react';

export function CompleteUsageExample() {
  const [jsonData, setJsonData] = useState('');
  
  // ===== HOOK PRINCIPAL =====
  const {
    businessData,
    hasData,
    isViable,
    isRecent,
    formattedSummary,
    financialSummary,
    costSuggestions,
    businessMetrics,
    refreshData,
    clearData,
    exportData,
    importData,
    debugInfo
  } = useBusinessAnalysis();

  // ===== HOOK DE PROTECCIÓN =====
  const { hasAccess, reason, AccessGuard } = useBusinessAnalysisGuard();

  // ===== HOOK FINANCIERO =====
  const { calculateMonthlyExpenses, calculateBreakEvenPoint } = useBusinessFinancials();

  // ===== MÉTODOS DIRECTOS DEL SERVICIO =====

  const handleDirectMethods = () => {
    console.log('=== MÉTODOS DIRECTOS DEL SERVICIO ===');
    
    // Verificaciones básicas
    console.log('¿Hay datos?', BusinessAnalysisService.hasData());
    console.log('¿Es viable?', BusinessAnalysisService.isLastAnalysisViable());
    console.log('¿Es reciente?', BusinessAnalysisService.isDataRecent());
    
    // Obtener datos
    const allData = BusinessAnalysisService.getBusinessAnalysisData();
    const businessOnly = BusinessAnalysisService.getBusinessDataOnly();
    const aiOnly = BusinessAnalysisService.getAIAnalysisOnly();
    
    console.log('Datos completos:', allData);
    console.log('Solo negocio:', businessOnly);
    console.log('Solo IA:', aiOnly);
    
    // Verificar acceso
    const access = BusinessAnalysisService.checkPageAccess(true, false);
    console.log('Acceso a página:', access);
    
    // Cálculos inteligentes
    const suggestions = BusinessAnalysisService.calculateFixedCostsSuggestions();
    const metrics = BusinessAnalysisService.getBusinessMetrics();
    const financial = BusinessAnalysisService.getFinancialSummary();
    
    console.log('Sugerencias de costos:', suggestions);
    console.log('Métricas:', metrics);
    console.log('Resumen financiero:', financial);
  };

  const handleExport = () => {
    const data = exportData();
    if (data) {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `business-analysis-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = () => {
    if (jsonData.trim()) {
      const success = importData(jsonData);
      if (success) {
        alert('Datos importados exitosamente');
        setJsonData('');
      } else {
        alert('Error al importar datos');
      }
    }
  };

  // Cálculos de ejemplo
  const monthlyExpenses = calculateMonthlyExpenses({ 
    marketing: 500, 
    maintenance: 200, 
    supplies: 800 
  });

  const breakEven = businessData && calculateBreakEvenPoint(25, monthlyExpenses?.totalMonthlyCosts || 0);

  // Si no hay acceso, mostrar guard
  if (!hasAccess) {
    return <AccessGuard />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎯 Ejemplo Completo de Uso
        </h1>
        <p className="text-xl text-gray-600">
          Todas las funciones disponibles para manejar datos del análisis de negocio
        </p>
      </div>

      {/* ===== INFORMACIÓN GENERAL ===== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg border-2 ${hasData ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center">
            {hasData ? <CheckCircle className="w-5 h-5 text-green-600 mr-2" /> : <AlertCircle className="w-5 h-5 text-red-600 mr-2" />}
            <span className={`font-bold ${hasData ? 'text-green-800' : 'text-red-800'}`}>
              {hasData ? 'Datos Disponibles' : 'Sin Datos'}
            </span>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border-2 ${isViable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-center">
            {isViable ? <CheckCircle className="w-5 h-5 text-green-600 mr-2" /> : <AlertCircle className="w-5 h-5 text-red-600 mr-2" />}
            <span className={`font-bold ${isViable ? 'text-green-800' : 'text-red-800'}`}>
              {isViable ? 'Negocio Viable' : 'No Viable'}
            </span>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg border-2 ${isRecent ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <div className="flex items-center">
            <RefreshCw className={`w-5 h-5 mr-2 ${isRecent ? 'text-blue-600' : 'text-yellow-600'}`} />
            <span className={`font-bold ${isRecent ? 'text-blue-800' : 'text-yellow-800'}`}>
              {isRecent ? 'Datos Recientes' : 'Datos Antiguos'}
            </span>
          </div>
        </div>
        
        <div className="p-4 rounded-lg border-2 bg-purple-50 border-purple-200">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
            <span className="font-bold text-purple-800">
              Score: {businessMetrics?.score || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* ===== HOOK PRINCIPAL ===== */}
      {businessData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🎣 Hook Principal (useBusinessAnalysis)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Datos Básicos</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Nombre: {businessData.businessName}</li>
                <li>• Categoría: {businessData.businessCategory}</li>
                <li>• Ubicación: {businessData.sector}</li>
                <li>• Capacidad: {businessData.capacity} personas</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Datos Financieros</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Inversión: {financialSummary?.totalInvestment}</li>
                <li>• Capital propio: {financialSummary?.ownCapital}</li>
                <li>• Préstamo: {financialSummary?.loanCapital}</li>
                <li>• Deuda: {financialSummary?.debtRatio}%</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-700">Análisis IA</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Viable: {businessData.aiAnalysis.isViable ? 'Sí' : 'No'}</li>
                <li>• Riesgo: {businessData.aiAnalysis.riskLevel}</li>
                <li>• Salud: {businessData.aiAnalysis.financialHealth}</li>
                <li>• Puntuación: {businessData.aiAnalysis.score}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===== CÁLCULOS INTELIGENTES ===== */}
      {costSuggestions && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            💰 Cálculos Inteligentes (Hook Financiero)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Costos Fijos Sugeridos</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Alquiler:</span>
                  <span className="font-medium">${costSuggestions.rent.toLocaleString()}/mes</span>
                </div>
                <div className="flex justify-between">
                  <span>Personal:</span>
                  <span className="font-medium">${costSuggestions.staff.toLocaleString()}/mes</span>
                </div>
                <div className="flex justify-between">
                  <span>Servicios:</span>
                  <span className="font-medium">${costSuggestions.utilities.toLocaleString()}/mes</span>
                </div>
                <div className="flex justify-between">
                  <span>Seguros:</span>
                  <span className="font-medium">${costSuggestions.insurance.toLocaleString()}/mes</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total Base:</span>
                  <span>${costSuggestions.total.toLocaleString()}/mes</span>
                </div>
              </div>
            </div>
            
            {monthlyExpenses && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Gastos Mensuales Totales</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Costos Base:</span>
                    <span className="font-medium">${costSuggestions.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketing:</span>
                    <span className="font-medium">$500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mantenimiento:</span>
                    <span className="font-medium">$200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Suministros:</span>
                    <span className="font-medium">$800</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Mensual:</span>
                    <span>${monthlyExpenses.totalMonthlyCosts.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Punto de Equilibrio */}
          {breakEven && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">📊 Punto de Equilibrio (Ticket Promedio: $25)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Ventas/día necesarias:</span>
                  <p className="font-bold text-blue-900">{breakEven.transactionsPerDay} transacciones</p>
                </div>
                <div>
                  <span className="text-blue-700">Ventas/mes necesarias:</span>
                  <p className="font-bold text-blue-900">{breakEven.transactionsPerMonth} transacciones</p>
                </div>
                <div>
                  <span className="text-blue-700">Utilización necesaria:</span>
                  <p className={`font-bold ${breakEven.isRealistic ? 'text-green-800' : 'text-red-800'}`}>
                    {breakEven.utilizationRate}% {breakEven.isRealistic ? '✅' : '❌'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== MÉTODOS DIRECTOS ===== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          🔧 Métodos Directos del Servicio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Acciones</h3>
            <div className="space-y-2">
              <button
                onClick={handleDirectMethods}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Ver Métodos Directos en Console
              </button>
              <button
                onClick={refreshData}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refrescar Datos
              </button>
              <button
                onClick={() => clearData() && window.location.reload()}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpiar Todos los Datos
              </button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Exportar/Importar</h3>
            <div className="space-y-2">
              <button
                onClick={handleExport}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Datos (JSON)
              </button>
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder="Pegar JSON para importar..."
                className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                rows={3}
              />
              <button
                onClick={handleImport}
                disabled={!jsonData.trim()}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar Datos
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===== INFORMACIÓN DE DEBUG ===== */}
      <details className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
          🔍 Información de Debug
        </summary>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Estados</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Tiene datos: {debugInfo.hasData ? 'Sí' : 'No'}</li>
              <li>• Tamaño de datos: {debugInfo.dataSize} bytes</li>
              <li>• Es reciente: {debugInfo.isRecent ? 'Sí' : 'No'}</li>
              <li>• Es viable: {debugInfo.isViable ? 'Sí' : 'No'}</li>
              <li>• Última actualización: {debugInfo.lastUpdate}</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Storage Keys</h4>
            <ul className="space-y-1 text-gray-600 text-xs">
              {debugInfo.storageKeys.map((key, index) => (
                <li key={index}>• {key}</li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-gray-700 mb-2">Resumen Formateado</h4>
          <p className="text-gray-600 text-sm bg-white p-2 rounded border">
            {formattedSummary || 'No disponible'}
          </p>
        </div>
      </details>
    </div>
  );
}
