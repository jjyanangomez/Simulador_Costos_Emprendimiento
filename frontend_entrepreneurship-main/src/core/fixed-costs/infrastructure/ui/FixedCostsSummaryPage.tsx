import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info, 
  ArrowLeft, 
  Edit3, 
  ArrowRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  MapPin,
  Building
} from 'lucide-react';
import { FixedCostsSummary, CostValidation, MissingCost } from '../../domain/types';

export function FixedCostsSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [summary, setSummary] = useState<FixedCostsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Obtener datos del localStorage
    const storedSummary = localStorage.getItem('fixedCostsSummary');
    if (storedSummary) {
      setSummary(JSON.parse(storedSummary));
    }
    setIsLoading(false);
  }, []);

  const handleEditCosts = () => {
    // Guardar el resumen actual en localStorage para mantener los datos
    if (summary) {
      localStorage.setItem('fixedCostsSummary', JSON.stringify(summary));
    }
    navigate('/fixed-costs');
  };

  const handleContinue = () => {
    navigate('/variable-costs');
  };

  const getValidationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getValidationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excelente';
    if (score >= 70) return 'Bueno';
    if (score >= 50) return 'Regular';
    return 'Necesita Mejora';
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Analizando costos fijos...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!summary) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No se encontró el resumen</h1>
          <p className="text-gray-600 mb-6">Vuelve a la página de costos fijos para generar el análisis.</p>
          <button
            onClick={() => navigate('/fixed-costs')}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Volver a Costos Fijos
          </button>
        </div>
      </MainLayout>
    );
  }

  const { costs, businessData, analysis } = summary;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📊 Análisis de Costos Fijos
          </h1>
          <p className="text-lg text-gray-600">
            La IA ha analizado tus costos fijos y generado recomendaciones personalizadas
          </p>
        </div>

        {/* Resumen del Negocio */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-primary-600" />
            Información del Negocio
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{businessData.businessName}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{businessData.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{businessData.employeeCount} empleados</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{businessData.size}</span>
            </div>
          </div>
        </div>

        {/* Puntuación General */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Puntuación General</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(analysis.summary.riskLevel)}`}>
              Riesgo: {analysis.summary.riskLevel === 'low' ? 'Bajo' : analysis.summary.riskLevel === 'medium' ? 'Medio' : 'Alto'}
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}/100
              </div>
              <div className="text-sm text-gray-600">{getScoreLabel(analysis.score)}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {analysis.summary.completeness}%
              </div>
              <div className="text-sm text-gray-600">Completitud</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">
                {costs.length}
              </div>
              <div className="text-sm text-gray-600">Costos Registrados</div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">{analysis.overallAssessment}</p>
          </div>
        </div>

        {/* Resumen de Costos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
            Resumen de Costos
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                ${analysis.summary.totalMonthly.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Mensual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-600">
                ${analysis.summary.totalYearly.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600">Total Anual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {costs.length}
              </div>
              <div className="text-sm text-gray-600">Costos Registrados</div>
            </div>
          </div>

          {/* Lista de costos */}
          <div className="space-y-3">
            {costs.map((cost, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{cost.name}</div>
                  <div className="text-sm text-gray-600">
                    ${cost.amount} ({cost.frequency})
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">
                    ${(cost.frequency === 'mensual' ? cost.amount : 
                        cost.frequency === 'semestral' ? cost.amount / 6 : 
                        cost.amount / 12).toFixed(2)}/mes
                  </div>
                  <div className="text-sm text-gray-500 capitalize">{cost.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validaciones de IA */}
        {analysis.validations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Validaciones de IA</h2>
            <div className="space-y-3">
              {analysis.validations.map((validation, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getValidationColor(validation.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    {getValidationIcon(validation.type)}
                    <div className="flex-1">
                      <p className="text-sm">{validation.message}</p>
                      {validation.suggestedAmount && (
                        <p className="text-xs mt-1 text-gray-600">
                          Monto sugerido: ${validation.suggestedAmount.toFixed(2)}/mes
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Costos Faltantes */}
        {analysis.missingCosts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Costos Recomendados</h2>
            <div className="space-y-4">
              {analysis.missingCosts.map((missingCost, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    missingCost.importance === 'high' 
                      ? 'border-red-200 bg-red-50' 
                      : missingCost.importance === 'medium'
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{missingCost.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          missingCost.importance === 'high' 
                            ? 'bg-red-100 text-red-800' 
                            : missingCost.importance === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {missingCost.importance === 'high' ? 'Alta' : 
                           missingCost.importance === 'medium' ? 'Media' : 'Baja'} Importancia
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{missingCost.description}</p>
                      <p className="text-sm text-gray-700">{missingCost.reason}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        ${missingCost.estimatedAmount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">estimado/mes</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recomendaciones */}
        {analysis.recommendations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recomendaciones</h2>
            <div className="space-y-3">
              {analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
