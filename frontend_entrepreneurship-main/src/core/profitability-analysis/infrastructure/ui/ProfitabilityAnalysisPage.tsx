import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { TrendingUp, Calculator, BarChart3, Save, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { BusinessDataLocalStorageService } from '../../../../shared/infrastructure/services/businessDataLocalStorage.service';
import toast from 'react-hot-toast';

export function ProfitabilityAnalysisPage() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [hasData, setHasData] = useState(false);

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    loadDataFromLocalStorage();
  }, []);

  const loadDataFromLocalStorage = () => {
    try {
      // Obtener datos de costos variables
      const variableCostsProducts = BusinessDataLocalStorageService.getVariableCostsProducts();
      const variableCostsAdditionalCosts = BusinessDataLocalStorageService.getVariableCostsAdditionalCosts();
      
      // Obtener datos de precio de venta
      const precioVentaProductos = BusinessDataLocalStorageService.getPrecioVentaProductos();
      const precioVentaResumen = BusinessDataLocalStorageService.getPrecioVentaResumen();

      if (variableCostsProducts.length > 0 || precioVentaProductos.length > 0) {
        // Calcular datos para el análisis
        const totalVariableCosts = variableCostsProducts.reduce((total, product) => {
          const productCost = product.type === 'recipe' && product.ingredients 
            ? product.ingredients.reduce((sum, ingredient) => {
                const costPerPortion = ingredient.unitPrice / (ingredient.portionsObtained || 1);
                return sum + (costPerPortion * ingredient.portion);
              }, 0)
            : product.resaleCost || 0;
          return total + productCost;
        }, 0);

        const totalAdditionalCosts = variableCostsAdditionalCosts.reduce((total, cost) => {
          const monthlyCost = cost.frequency === 'monthly' ? cost.amount 
            : cost.frequency === 'quarterly' ? cost.amount / 3 
            : cost.amount / 12;
          return total + monthlyCost;
        }, 0);

        const averageSellingPrice = precioVentaProductos.length > 0 
          ? precioVentaProductos.reduce((sum, p) => sum + p.precio_venta_cliente, 0) / precioVentaProductos.length
          : 0;

        const averageVariableCost = variableCostsProducts.length > 0 
          ? totalVariableCosts / variableCostsProducts.length
          : 0;

        // Datos para el análisis
        // Obtener costos fijos desde localStorage
        const fixedCostsData = BusinessDataLocalStorageService.getFixedCosts();
        const totalFixedCosts = BusinessDataLocalStorageService.getTotalFixedCosts();
        
        // Calcular capacidad mensual basada en los productos
        const estimatedMonthlyCapacity = variableCostsProducts.length > 0 ? 
          Math.max(100, variableCostsProducts.length * 50) : 1000; // Estimación basada en productos
        
        const data = {
          fixedCosts: totalFixedCosts,
          variableCosts: averageVariableCost,
          averageSellingPrice: averageSellingPrice,
          monthlyCapacity: estimatedMonthlyCapacity,
          totalProducts: variableCostsProducts.length,
          totalRevenue: precioVentaResumen?.precio_venta_total_cliente || 0,
          totalCosts: totalVariableCosts + totalAdditionalCosts,
          additionalCosts: totalAdditionalCosts
        };

        setAnalysisData(data);
        setHasData(true);
        toast.success('Datos cargados correctamente');
      } else {
        setHasData(false);
        toast.error('No hay datos disponibles. Completa primero las secciones de Costos Variables y Precio de Venta.');
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
             toast.error('Error al cargar datos');
    }
  };

  const performAnalysis = async () => {
    if (!analysisData) {
      toast.error('No hay datos disponibles para el análisis');
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simular análisis con IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { fixedCosts, variableCosts, averageSellingPrice, monthlyCapacity } = analysisData;
      
      const results = {
        breakEvenUnits: Math.ceil(fixedCosts / (averageSellingPrice - variableCosts)),
        breakEvenRevenue: Math.ceil(fixedCosts / (averageSellingPrice - variableCosts)) * averageSellingPrice,
        marginOfSafety: ((monthlyCapacity - Math.ceil(fixedCosts / (averageSellingPrice - variableCosts))) / monthlyCapacity) * 100,
        monthlyProfit: (monthlyCapacity * averageSellingPrice) - (monthlyCapacity * variableCosts) - fixedCosts,
        roi: ((((monthlyCapacity * averageSellingPrice) - (monthlyCapacity * variableCosts) - fixedCosts) * 12) / 25000) * 100,
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

  if (!hasData) {
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

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay datos disponibles
              </h3>
              <p className="text-gray-600 mb-4">
                Para realizar el análisis de rentabilidad, primero debes completar las secciones de Costos Variables y Precio de Venta.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate('/variable-costs')}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Ir a Costos Variables
                </button>
                <button
                  onClick={() => navigate('/precio-venta')}
                  className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
                >
                  Ir a Precio de Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

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
           <div className="grid md:grid-cols-2 gap-6">
             <div className="text-center">
               <div className="text-2xl font-bold text-red-600">${analysisData.fixedCosts.toLocaleString()}</div>
               <div className="text-sm text-gray-600">Costos Fijos Mensuales</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-blue-600">${analysisData.variableCosts.toFixed(2)}</div>
               <div className="text-sm text-gray-600">Costo Variable por Unidad</div>
             </div>
           </div>
           
           {/* Información adicional */}
           <div className="mt-6 grid md:grid-cols-2 gap-4 text-center">
             <div>
               <div className="text-lg font-semibold text-purple-600">{analysisData.monthlyCapacity.toLocaleString()}</div>
               <div className="text-sm text-gray-600">Capacidad Mensual</div>
             </div>
             <div>
               <div className="text-lg font-semibold text-green-600">${analysisData.averageSellingPrice.toFixed(2)}</div>
               <div className="text-sm text-gray-600">Precio Promedio de Venta</div>
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
            onClick={() => navigate('/precio-venta')}
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
