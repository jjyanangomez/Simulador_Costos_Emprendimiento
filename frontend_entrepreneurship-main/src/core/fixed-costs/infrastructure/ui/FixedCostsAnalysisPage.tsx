import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  Edit3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Building2,
  Lightbulb,
  AlertCircle,
  Info,
  BarChart3,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import { FixedCostsAnalysisService, type OverallAnalysisResult, type CostAnalysisResult } from '../../../../shared/services/FixedCostsAnalysisService';
import { BusinessAnalysisService } from '../../../../shared/services/BusinessAnalysisService';
import toast from 'react-hot-toast';

export function FixedCostsAnalysisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [analysisResult, setAnalysisResult] = useState<OverallAnalysisResult | null>(null);
  const [businessData, setBusinessData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'analysis' | 'recommendations'>('summary');

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = () => {
    try {
      setIsLoading(true);
      
      // Intentar obtener el resultado del análisis desde localStorage
      let result = FixedCostsAnalysisService.getAnalysisResult();
      
      // Si no hay resultado guardado, intentar obtenerlo de los parámetros de la URL
      if (!result && location.state?.analysisResult) {
        result = location.state.analysisResult;
        // Guardar el resultado para futuras visitas
        if (result) {
          FixedCostsAnalysisService.saveAnalysisResult(result);
        }
      }
      
      if (result) {
        setAnalysisResult(result);
      } else {
        // Si no hay análisis, redirigir a la página de costos fijos
        toast.error('No hay análisis de costos fijos disponible');
        navigate('/fixed-costs');
        return;
      }

      // Obtener datos del negocio
      const business = BusinessAnalysisService.getBusinessAnalysisData();
      if (business) {
        setBusinessData(business);
      }

    } catch (error) {
      console.error('Error al cargar datos del análisis:', error);
      toast.error('Error al cargar el análisis');
      navigate('/fixed-costs');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskLevelIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'high': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-100 border-blue-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low': return <Info className="w-4 h-4 text-blue-600" />;
      default: return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="w-6 h-6 text-green-600" />;
    if (score >= 60) return <TrendingDown className="w-6 h-6 text-yellow-600" />;
    return <TrendingDown className="w-6 h-6 text-red-600" />;
  };

  const handleEditCosts = () => {
    navigate('/fixed-costs');
  };

  const handleContinue = () => {
    navigate('/variable-costs');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Analizando costos fijos con IA...</h2>
            <p className="text-gray-500">Esto puede tomar unos segundos</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!analysisResult || !businessData) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">No se pudo cargar el análisis</h2>
            <p className="text-gray-500">Por favor, regresa a la página de costos fijos</p>
            <button
              onClick={() => navigate('/fixed-costs')}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Volver a Costos Fijos
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Análisis de IA - Costos Fijos
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hemos analizado tus costos fijos usando inteligencia artificial para detectar inconsistencias, 
            costos faltantes y optimizaciones según tu tipo de negocio.
          </p>
        </div>

        {/* Panel de contexto del negocio */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {businessData.businessName}
              </h3>
              <p className="text-sm text-gray-600">
                {businessData.businessCategory} • {businessData.sector} • {businessData.businessSize}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/60 rounded-lg p-3">
              <span className="font-medium text-blue-900">Capacidad:</span>
              <span className="text-blue-800 ml-2">{businessData.capacity} personas</span>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <span className="font-medium text-blue-900">Inversión Total:</span>
              <span className="text-blue-800 ml-2">${businessData.totalInvestment?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <span className="font-medium text-blue-900">Fecha de Análisis:</span>
              <span className="text-blue-800 ml-2">{new Date().toLocaleDateString('es-ES')}</span>
            </div>
          </div>
        </div>

        {/* Puntuación general */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Puntuación General del Análisis</h2>
            {getScoreIcon(analysisResult.aiScore)}
          </div>
          <div className="text-center">
            <div className={`text-6xl font-bold ${getScoreColor(analysisResult.aiScore)} mb-2`}>
              {analysisResult.aiScore}/100
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {getRiskLevelIcon(analysisResult.summary.riskLevel)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(analysisResult.summary.riskLevel)}`}>
                Riesgo {analysisResult.summary.riskLevel === 'low' ? 'Bajo' : analysisResult.summary.riskLevel === 'medium' ? 'Medio' : 'Alto'}
              </span>
            </div>
            <p className="text-gray-600">
              {analysisResult.aiScore >= 80 
                ? '¡Excelente! Tus costos fijos están bien estructurados y dentro de rangos razonables.'
                : analysisResult.aiScore >= 60
                ? 'Bueno, pero hay algunas áreas que podrías mejorar para optimizar tu presupuesto.'
                : 'Hay varias inconsistencias que deberías revisar para mejorar la viabilidad de tu negocio.'
              }
            </p>
          </div>
        </div>

        {/* Resumen ejecutivo */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen Ejecutivo</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">${analysisResult.summary.totalMonthly.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Mensual</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{analysisResult.summary.totalCosts}</div>
              <div className="text-sm text-gray-600">Costos Ingresados</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{analysisResult.summary.completeness}%</div>
              <div className="text-sm text-gray-600">Completitud</div>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{analysisResult.missingCosts.length}</div>
              <div className="text-sm text-gray-600">Costos Faltantes</div>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'summary'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                📊 Resumen General
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analysis'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🔍 Análisis Detallado
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recommendations'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                💡 Recomendaciones
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Tab: Resumen General */}
            {activeTab === 'summary' && (
              <div className="space-y-6">
                {/* Resumen ejecutivo simplificado */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <span>Resumen Ejecutivo</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Estado general */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          analysisResult.aiScore >= 80 ? 'bg-green-500' : 
                          analysisResult.aiScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium text-gray-900">
                          Estado General: {
                            analysisResult.aiScore >= 80 ? 'Excelente' : 
                            analysisResult.aiScore >= 60 ? 'Bueno' : 'Requiere Atención'
                          }
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-700 space-y-2">
                        <p>• <strong>Puntuación IA:</strong> {analysisResult.aiScore}/100</p>
                        <p>• <strong>Nivel de Riesgo:</strong> {
                          analysisResult.summary.riskLevel === 'low' ? 'Bajo' : 
                          analysisResult.summary.riskLevel === 'medium' ? 'Medio' : 'Alto'
                        }</p>
                        <p>• <strong>Completitud:</strong> {analysisResult.summary.completeness}%</p>
                        <p>• <strong>Total Mensual:</strong> ${analysisResult.summary.totalMonthly.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Puntos clave */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Puntos Clave:</h4>
                      <div className="space-y-2 text-sm">
                        {analysisResult.aiScore >= 80 && (
                          <div className="flex items-center space-x-2 text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            <span>Costos bien estructurados y dentro de rangos razonables</span>
                          </div>
                        )}
                        {analysisResult.missingCosts.length === 0 && (
                          <div className="flex items-center space-x-2 text-green-700">
                            <CheckCircle className="w-4 h-4" />
                            <span>No faltan costos esenciales</span>
                          </div>
                        )}
                        {analysisResult.missingCosts.length > 0 && (
                          <div className="flex items-center space-x-2 text-yellow-700">
                            <AlertTriangle className="w-4 h-4" />
                            <span>{analysisResult.missingCosts.length} costos importantes faltan</span>
                          </div>
                        )}
                        {analysisResult.costAnalysis.some(cost => cost.analysis.riskLevel === 'high') && (
                          <div className="flex items-center space-x-2 text-red-700">
                            <XCircle className="w-4 h-4" />
                            <span>Algunos costos están fuera de rangos recomendados</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Costos ingresados - versión compacta */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Costos Ingresados ({analysisResult.costAnalysis.length})</span>
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {analysisResult.costAnalysis.map((cost) => (
                      <div key={cost.costId} className="bg-white rounded-lg p-3 border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-gray-900 text-sm">{cost.costName}</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(cost.analysis.riskLevel)}`}>
                            {cost.analysis.riskLevel === 'low' ? 'Bajo' : cost.analysis.riskLevel === 'medium' ? 'Medio' : 'Alto'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">{cost.category}</div>
                        <div className="font-semibold text-gray-900">${cost.monthlyEquivalent.toFixed(2)}/mes</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Costos faltantes - versión compacta */}
                {analysisResult.missingCosts.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span>Costos Faltantes ({analysisResult.missingCosts.length})</span>
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {analysisResult.missingCosts.map((cost, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-gray-900 text-sm">{cost.name}</div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(cost.priority)}`}>
                              {cost.priority === 'high' ? 'Alta' : cost.priority === 'medium' ? 'Media' : 'Baja'}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mb-1">{cost.reason}</div>
                          <div className="text-sm font-medium text-gray-900">
                            ~${cost.estimatedAmount.toFixed(2)}/mes
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Análisis Detallado */}
            {activeTab === 'analysis' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis Individual de Costos</h3>
                
                {/* Filtros rápidos */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    Todos ({analysisResult.costAnalysis.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                  >
                    Alto Riesgo ({analysisResult.costAnalysis.filter(c => c.analysis.riskLevel === 'high').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium"
                  >
                    Medio Riesgo ({analysisResult.costAnalysis.filter(c => c.analysis.riskLevel === 'medium').length})
                  </button>
                  <button
                    onClick={() => setActiveTab('analysis')}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    Bajo Riesgo ({analysisResult.costAnalysis.filter(c => c.analysis.riskLevel === 'low').length})
                  </button>
                </div>

                <div className="space-y-4">
                  {analysisResult.costAnalysis.map((cost) => (
                    <div key={cost.costId} className="bg-gray-50 rounded-lg p-4">
                      {/* Header del costo */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900">{cost.costName}</h4>
                          <p className="text-sm text-gray-600">{cost.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">${cost.monthlyEquivalent.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">mensual</div>
                        </div>
                      </div>
                      
                      {/* Métricas clave en grid compacto */}
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-sm font-medium text-gray-700 mb-1">Rango Esperado</div>
                          <div className="text-lg font-semibold text-gray-900">
                            ${cost.analysis.expectedRange.min} - ${cost.analysis.expectedRange.max}
                          </div>
                          <div className="text-xs text-gray-500">{cost.analysis.expectedRange.unit}</div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-3">
                          <div className="text-sm font-medium text-gray-700 mb-1">Nivel de Riesgo</div>
                          <div className="flex items-center space-x-2">
                            {getRiskLevelIcon(cost.analysis.riskLevel)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskLevelColor(cost.analysis.riskLevel)}`}>
                              {cost.analysis.riskLevel === 'low' ? 'Bajo' : cost.analysis.riskLevel === 'medium' ? 'Medio' : 'Alto'}
                            </span>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-3">
                          <div className="text-sm font-medium text-gray-700 mb-1">Estado</div>
                          <div className={`text-lg font-semibold ${
                            cost.analysis.riskLevel === 'low' ? 'text-green-600' : 
                            cost.analysis.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {cost.analysis.riskLevel === 'low' ? '✅ Aceptable' : 
                             cost.analysis.riskLevel === 'medium' ? '⚠️ Revisar' : '❌ Crítico'}
                          </div>
                        </div>
                      </div>

                      {/* Observaciones y recomendaciones en tabs internos */}
                      <div className="bg-white rounded-lg border">
                        <div className="border-b border-gray-200">
                          <div className="flex">
                            <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border-b-2 border-blue-500">
                              Observaciones ({cost.analysis.observations.length})
                            </button>
                            <button className="flex-1 px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent">
                              Recomendaciones ({cost.analysis.recommendations.length})
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          {/* Observaciones */}
                          <div className="space-y-2">
                            {cost.analysis.observations.length > 0 ? (
                              cost.analysis.observations.map((observation, index) => (
                                <div key={index} className="flex items-start space-x-2 text-sm">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-gray-700">{observation}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 text-sm">No hay observaciones específicas para este costo.</p>
                            )}
                          </div>

                          {/* Recomendaciones */}
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="space-y-2">
                              {cost.analysis.recommendations.length > 0 ? (
                                cost.analysis.recommendations.map((recommendation, index) => (
                                  <div key={index} className="flex items-start space-x-2 text-sm">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-gray-700">{recommendation}</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-gray-500 text-sm">No hay recomendaciones específicas para este costo.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Recomendaciones */}
            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                {/* Recomendaciones principales */}
                {analysisResult.recommendations.length > 0 && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Recomendaciones Principales</span>
                    </h3>
                    <div className="space-y-2">
                      {analysisResult.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-green-800">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advertencias */}
                {analysisResult.warnings.length > 0 && (
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span>Advertencias Importantes</span>
                    </h3>
                    <div className="space-y-2">
                      {analysisResult.warnings.map((warning, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-yellow-800">{warning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Plan de acción */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    <span>Plan de Acción Sugerido</span>
                  </h3>
                  <div className="space-y-3">
                    {analysisResult.missingCosts.length > 0 && (
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <div className="font-medium text-blue-900 mb-2">1. Agregar Costos Faltantes</div>
                        <div className="text-sm text-blue-800">
                          Prioriza los costos de alta prioridad: {analysisResult.missingCosts
                            .filter(cost => cost.priority === 'high')
                            .map(cost => cost.name)
                            .join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {analysisResult.costAnalysis.some(cost => cost.analysis.riskLevel === 'high') && (
                      <div className="bg-white rounded-lg p-3 border border-blue-200">
                        <div className="font-medium text-blue-900 mb-2">2. Revisar Costos de Alto Riesgo</div>
                        <div className="text-sm text-blue-800">
                          Revisa los costos marcados como de alto riesgo para optimizar tu presupuesto
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="font-medium text-blue-900 mb-2">3. Continuar con el Análisis</div>
                      <div className="text-sm text-blue-800">
                        Una vez optimizados los costos fijos, continúa con el análisis de costos variables
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between items-center pt-6">
          <button
            onClick={handleEditCosts}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Costos</span>
          </button>
          
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <span>Continuar con Costos Variables</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
