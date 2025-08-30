import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { BarChart3, Download, Share2, Home, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export function ResultsPage() {
  const navigate = useNavigate();

  // Datos simulados de resultados
  const results = {
    businessName: 'La Buena Mesa',
    businessCategory: 'Restaurante',
    sector: 'La Mariscal',
    totalInvestment: 25000,
    monthlyFixedCosts: 8500,
    averageVariableCost: 3.50,
    averageSellingPrice: 12.50,
    breakEvenUnits: 944,
    breakEvenRevenue: 11800,
    marginOfSafety: 52.8,
    monthlyProfit: 10100,
    annualROI: 48.5,
    paybackPeriod: 2.1,
    riskLevel: 'Bajo',
    recommendations: [
      'Tu negocio tiene un excelente margen de seguridad del 52.8%',
      'El ROI anual del 48.5% es muy atractivo para inversores',
      'Considera implementar estrategias de marketing para aumentar ventas',
      'Mantén un control estricto de los costos variables',
      'Evalúa expandir el horario de operación para maximizar la capacidad'
    ],
    nextSteps: [
      'Desarrollar un plan de marketing detallado',
      'Implementar sistema de control de inventario',
      'Establecer métricas de seguimiento mensual',
      'Considerar opciones de financiamiento adicional',
      'Planificar expansión futura del negocio'
    ]
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'bajo': return 'text-green-600 bg-green-100';
      case 'medio': return 'text-yellow-600 bg-yellow-100';
      case 'alto': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'bajo': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'medio': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'alto': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 ¡Análisis Completado!
          </h1>
          <p className="text-xl text-gray-600">
            Aquí tienes el resumen completo de la rentabilidad de tu negocio
          </p>
        </div>

        {/* Resumen ejecutivo */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-8 border border-primary-200">
          <h2 className="text-2xl font-bold text-primary-900 mb-6 text-center">
            Resumen Ejecutivo
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-primary-800 mb-4">Información del Negocio</h3>
              <div className="space-y-2 text-sm text-primary-700">
                <p><span className="font-medium">Nombre:</span> {results.businessName}</p>
                <p><span className="font-medium">Categoría:</span> {results.businessCategory}</p>
                <p><span className="font-medium">Sector:</span> {results.sector}</p>
                <p><span className="font-medium">Inversión Total:</span> ${results.totalInvestment.toLocaleString()}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-800 mb-4">Veredicto Final</h3>
              <div className="flex items-center space-x-3">
                {getRiskLevelIcon(results.riskLevel)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(results.riskLevel)}`}>
                  Riesgo {results.riskLevel}
                </span>
              </div>
              <p className="text-sm text-primary-700 mt-2">
                Tu negocio es {results.riskLevel === 'Bajo' ? 'altamente rentable' : results.riskLevel === 'Medio' ? 'moderadamente rentable' : 'de alto riesgo'}.
              </p>
            </div>
          </div>
        </div>

        {/* Métricas clave */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
              Punto de Equilibrio
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Unidades para equilibrio:</span>
                <span className="font-semibold text-primary-600">{results.breakEvenUnits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ventas para equilibrio:</span>
                <span className="font-semibold text-secondary-600">${results.breakEvenRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Margen de seguridad:</span>
                <span className="font-semibold text-green-600">{results.marginOfSafety}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
              Rentabilidad
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Utilidad mensual:</span>
                <span className="font-semibold text-green-600">${results.monthlyProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ROI anual:</span>
                <span className="font-semibold text-blue-600">{results.annualROI}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Período de recuperación:</span>
                <span className="font-semibold text-purple-600">{results.paybackPeriod} años</span>
              </div>
            </div>
          </div>
        </div>

        {/* Análisis detallado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Análisis Detallado</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Estructura de Costos</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Costos fijos mensuales:</span>
                  <span className="font-medium">${results.monthlyFixedCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Costo variable por unidad:</span>
                  <span className="font-medium">${results.averageVariableCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio promedio de venta:</span>
                  <span className="font-medium">${results.averageSellingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margen de contribución:</span>
                  <span className="font-medium text-green-600">
                    {(((results.averageSellingPrice - results.averageVariableCost) / results.averageSellingPrice) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 Indicadores Clave</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacidad utilizada:</span>
                  <span className="font-medium">47.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Eficiencia operativa:</span>
                  <span className="font-medium text-green-600">Alta</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Competitividad de precios:</span>
                  <span className="font-medium text-green-600">Buena</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sostenibilidad:</span>
                  <span className="font-medium text-green-600">Alta</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">💡 Recomendaciones de la IA</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">✅ Fortalezas Identificadas</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">🚀 Próximos Pasos</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {results.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">📋 Acciones Disponibles</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Descargar Reporte PDF</span>
            </button>
            <button className="px-6 py-3 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Compartir Resultados</span>
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Volver al Dashboard</span>
            </button>
          </div>
        </div>

        {/* Mensaje final */}
        <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 border border-green-200">
          <h3 className="text-2xl font-bold text-green-900 mb-4">
            🎯 ¡Tu Negocio Está Listo para el Éxito!
          </h3>
          <p className="text-lg text-green-800 mb-6">
            Con un ROI del {results.annualROI}% y un margen de seguridad del {results.marginOfSafety}%, 
            tu negocio de {results.businessCategory.toLowerCase()} en {results.sector} tiene excelentes 
            perspectivas de rentabilidad.
          </p>
          <p className="text-green-700">
            Continúa monitoreando tus costos y ventas, y no dudes en ajustar tu estrategia 
            según las recomendaciones proporcionadas.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
