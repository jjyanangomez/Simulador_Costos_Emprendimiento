import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { TrendingUp, Calculator, BarChart3, Save, ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProfitabilityAnalysisPage() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Datos simulados para el análisis
  const mockData = {
    fixedCosts: 8500, // Costos fijos mensuales
    variableCosts: 3.50, // Costo variable por unidad
    averageSellingPrice: 12.50, // Precio promedio de venta
    monthlyCapacity: 2000, // Capacidad mensual
  };

  const performAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simular análisis con IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results = {
        breakEvenUnits: Math.ceil(mockData.fixedCosts / (mockData.averageSellingPrice - mockData.variableCosts)),
        breakEvenRevenue: Math.ceil(mockData.fixedCosts / (mockData.averageSellingPrice - mockData.variableCosts)) * mockData.averageSellingPrice,
        marginOfSafety: ((mockData.monthlyCapacity - Math.ceil(mockData.fixedCosts / (mockData.averageSellingPrice - mockData.variableCosts))) / mockData.monthlyCapacity) * 100,
        monthlyProfit: (mockData.monthlyCapacity * mockData.averageSellingPrice) - (mockData.monthlyCapacity * mockData.variableCosts) - mockData.fixedCosts,
        roi: ((((mockData.monthlyCapacity * mockData.averageSellingPrice) - (mockData.monthlyCapacity * mockData.variableCosts) - mockData.fixedCosts) * 12) / 25000) * 100,
      };
      
      setAnalysisResults(results);
      toast.success('¡Análisis de rentabilidad completado!');
    } catch (error) {
      toast.error('Error al realizar el análisis');
      console.error('Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveAndContinue = () => {
    toast.success('¡Análisis guardado exitosamente!');
    navigate('/results');
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Análisis de Rentabilidad
          </h1>
          <p className="text-lg text-gray-600">
            Calcula el punto de equilibrio y analiza la rentabilidad de tu negocio
          </p>
        </div>

        {/* Resumen de datos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de Datos</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">${mockData.fixedCosts.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Costos Fijos Mensuales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">${mockData.variableCosts}</div>
              <div className="text-sm text-gray-600">Costo Variable por Unidad</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">${mockData.averageSellingPrice}</div>
              <div className="text-sm text-gray-600">Precio Promedio de Venta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{mockData.monthlyCapacity.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Capacidad Mensual</div>
            </div>
          </div>
        </div>

        {/* Botón de análisis */}
        <div className="text-center">
          <button
            onClick={performAnalysis}
            disabled={isAnalyzing}
            className="px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2 mx-auto"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analizando con IA...</span>
              </>
            ) : (
              <>
                <Calculator className="w-5 h-5" />
                <span>Realizar Análisis de Rentabilidad</span>
              </>
            )}
          </button>
        </div>

        {/* Resultados del análisis */}
        {analysisResults && (
          <div className="space-y-6">
            {/* Punto de equilibrio */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary-600" />
                Punto de Equilibrio
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">{analysisResults.breakEvenUnits.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Unidades para Equilibrio</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary-600">${analysisResults.breakEvenRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Ventas para Equilibrio</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{analysisResults.marginOfSafety.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Margen de Seguridad</div>
                </div>
              </div>
            </div>

            {/* Análisis de rentabilidad */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary-600" />
                Análisis de Rentabilidad
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">${analysisResults.monthlyProfit.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Utilidad Mensual Proyectada</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{analysisResults.roi.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">ROI Anual Proyectado</div>
                </div>
              </div>
            </div>

            {/* Recomendaciones */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-900 mb-4">
                💡 Recomendaciones de la IA
              </h3>
              <div className="space-y-3 text-sm text-primary-800">
                {analysisResults.marginOfSafety > 50 ? (
                  <p>✅ Excelente margen de seguridad. Tu negocio tiene un buen buffer contra fluctuaciones.</p>
                ) : analysisResults.marginOfSafety > 20 ? (
                  <p>⚠️ Margen de seguridad moderado. Considera optimizar costos o aumentar precios.</p>
                ) : (
                  <p>🚨 Margen de seguridad bajo. Revisa tu estructura de costos y precios.</p>
                )}
                
                {analysisResults.roi > 20 ? (
                  <p>✅ ROI muy atractivo. La inversión se recuperará en menos de 5 años.</p>
                ) : analysisResults.roi > 10 ? (
                  <p>⚠️ ROI moderado. Considera estrategias para mejorar la rentabilidad.</p>
                ) : (
                  <p>🚨 ROI bajo. Revisa tu modelo de negocio y estructura de costos.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-between items-center pt-6">
          <button
            onClick={() => navigate('/variable-costs')}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Paso Anterior</span>
          </button>
          
          {analysisResults && (
            <button
              onClick={saveAndContinue}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar y Ver Resultados</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
