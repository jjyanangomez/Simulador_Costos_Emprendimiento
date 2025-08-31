import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { 
  BarChart3, 
  Download, 
  Share2, 
  Home, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Building2,
  Calculator,
  Package,
  DollarSign,
  Brain,
  ChefHat,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import { BusinessDataLocalStorageService } from '../../../../shared/infrastructure/services/businessDataLocalStorage.service';
import toast from 'react-hot-toast';

export function ResultsPage() {
  const navigate = useNavigate();
  const [resultsData, setResultsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = () => {
    try {
      setIsLoading(true);
      
      // Cargar todos los datos del localStorage
      const variableCostsProducts = BusinessDataLocalStorageService.getVariableCostsProducts();
      const variableCostsAdditionalCosts = BusinessDataLocalStorageService.getVariableCostsAdditionalCosts();
      const variableCostsBusinessType = BusinessDataLocalStorageService.getVariableCostsBusinessType();
      
      const precioVentaProductos = BusinessDataLocalStorageService.getPrecioVentaProductos();
      const precioVentaResumen = BusinessDataLocalStorageService.getPrecioVentaResumen();
      
      const fixedCosts = BusinessDataLocalStorageService.getFixedCosts();
      const totalFixedCosts = BusinessDataLocalStorageService.getTotalFixedCosts();

      // Calcular métricas
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
        return total + cost.value;
      }, 0);

      const averageSellingPrice = precioVentaProductos.length > 0 
        ? precioVentaProductos.reduce((sum, p) => sum + p.precio_venta_cliente, 0) / precioVentaProductos.length
        : 0;

      const averageVariableCost = variableCostsProducts.length > 0 
        ? totalVariableCosts / variableCostsProducts.length
        : 0;

      const estimatedMonthlyCapacity = variableCostsProducts.length > 0 ? 
        Math.max(100, variableCostsProducts.length * 50) : 1000;

      // Calcular análisis de rentabilidad
      const breakEvenUnits = averageSellingPrice > averageVariableCost 
        ? Math.ceil(totalFixedCosts / (averageSellingPrice - averageVariableCost))
        : 0;
      
      const breakEvenRevenue = breakEvenUnits * averageSellingPrice;
      const marginOfSafety = estimatedMonthlyCapacity > 0 
        ? ((estimatedMonthlyCapacity - breakEvenUnits) / estimatedMonthlyCapacity) * 100
        : 0;
      
      const monthlyProfit = (estimatedMonthlyCapacity * averageSellingPrice) - (estimatedMonthlyCapacity * averageVariableCost) - totalFixedCosts;
      const annualROI = totalFixedCosts > 0 ? ((monthlyProfit * 12) / 25000) * 100 : 0;
      const paybackPeriod = monthlyProfit > 0 ? 25000 / (monthlyProfit * 12) : 0;

      // Determinar nivel de riesgo
      let riskLevel = 'Alto';
      if (marginOfSafety > 30 && annualROI > 15) riskLevel = 'Bajo';
      else if (marginOfSafety > 15 && annualROI > 8) riskLevel = 'Medio';

      const data = {
        businessType: variableCostsBusinessType,
        products: variableCostsProducts,
        additionalCosts: variableCostsAdditionalCosts,
        fixedCosts: fixedCosts,
        precioVentaProductos: precioVentaProductos,
        metrics: {
          totalFixedCosts,
          totalVariableCosts,
          totalAdditionalCosts,
          averageSellingPrice,
          averageVariableCost,
          estimatedMonthlyCapacity,
          breakEvenUnits,
          breakEvenRevenue,
          marginOfSafety,
          monthlyProfit,
          annualROI,
          paybackPeriod,
          riskLevel
        }
      };

      setResultsData(data);
      toast.success('Datos cargados correctamente');
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando resultados...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!resultsData) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay datos disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              Completa las secciones anteriores para ver los resultados.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const { businessType, products, additionalCosts, fixedCosts, precioVentaProductos, metrics } = resultsData;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 ¡Análisis Completado!
          </h1>
          <p className="text-xl text-gray-600">
            Resumen completo de la rentabilidad de tu negocio de {businessType}
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
                <p><span className="font-medium">Tipo de Negocio:</span> {businessType}</p>
                <p><span className="font-medium">Productos Configurados:</span> {products.length}</p>
                <p><span className="font-medium">Costos Fijos:</span> ${metrics.totalFixedCosts.toLocaleString()}</p>
                <p><span className="font-medium">Costos Variables:</span> ${metrics.totalVariableCosts.toFixed(2)}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary-800 mb-4">Veredicto Final</h3>
              <div className="flex items-center space-x-3">
                {getRiskLevelIcon(metrics.riskLevel)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(metrics.riskLevel)}`}>
                  Riesgo {metrics.riskLevel}
                </span>
              </div>
              <p className="text-sm text-primary-700 mt-2">
                Tu negocio es {metrics.riskLevel === 'Bajo' ? 'altamente rentable' : metrics.riskLevel === 'Medio' ? 'moderadamente rentable' : 'de alto riesgo'}.
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
                <span className="font-semibold text-primary-600">{metrics.breakEvenUnits.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ventas para equilibrio:</span>
                <span className="font-semibold text-secondary-600">${metrics.breakEvenRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Margen de seguridad:</span>
                <span className="font-semibold text-green-600">{metrics.marginOfSafety.toFixed(1)}%</span>
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
                <span className="font-semibold text-green-600">${metrics.monthlyProfit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">ROI anual:</span>
                <span className="font-semibold text-blue-600">{metrics.annualROI.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Período de recuperación:</span>
                <span className="font-semibold text-purple-600">{metrics.paybackPeriod.toFixed(1)} años</span>
              </div>
            </div>
          </div>
        </div>

        {/* Productos Configurados */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Package className="w-6 h-6 mr-2 text-primary-600" />
            Productos Configurados ({products.length})
          </h2>
          <div className="grid gap-4">
            {products.map((product: any, index: number) => {
              const productCost = product.type === 'recipe' && product.ingredients 
                ? product.ingredients.reduce((sum: number, ingredient: any) => {
                    const costPerPortion = ingredient.unitPrice / (ingredient.portionsObtained || 1);
                    return sum + (costPerPortion * ingredient.portion);
                  }, 0)
                : product.resaleCost || 0;
              
              const precioVenta = precioVentaProductos.find((p: any) => p.id === product.id);
              
              return (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {product.type === 'recipe' ? (
                        <ChefHat className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-green-600" />
                      )}
                      <div>
                        <h4 className="font-medium text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          {product.type === 'recipe' ? 'Producto de Preparación' : 'Producto de Reventa'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Costo: ${productCost.toFixed(2)}</p>
                      {precioVenta && (
                        <p className="text-sm text-green-600">Precio: ${precioVenta.precio_venta_cliente.toFixed(2)}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Costos Fijos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-primary-600" />
            Costos Fijos ({fixedCosts.length})
          </h2>
          <div className="grid gap-4">
            {fixedCosts.map((cost: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{cost.name}</h4>
                    <p className="text-sm text-gray-600">{cost.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${cost.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">{cost.frequency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Costos Variables Adicionales */}
        {additionalCosts.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-2 text-primary-600" />
              Costos Variables Adicionales ({additionalCosts.length})
            </h2>
            <div className="grid gap-4">
              {additionalCosts.map((cost: any, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{cost.name}</h4>
                      <p className="text-sm text-gray-600">{cost.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${cost.value.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Análisis detallado */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Análisis Detallado</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">📊 Estructura de Costos</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Costos fijos mensuales:</span>
                  <span className="font-medium">${metrics.totalFixedCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Costo variable por unidad:</span>
                  <span className="font-medium">${metrics.averageVariableCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio promedio de venta:</span>
                  <span className="font-medium">${metrics.averageSellingPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margen de contribución:</span>
                  <span className="font-medium text-green-600">
                    {metrics.averageSellingPrice > 0 ? (((metrics.averageSellingPrice - metrics.averageVariableCost) / metrics.averageSellingPrice) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">🎯 Indicadores Clave</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacidad mensual:</span>
                  <span className="font-medium">{metrics.estimatedMonthlyCapacity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacidad utilizada:</span>
                  <span className="font-medium">{metrics.breakEvenUnits > 0 ? ((metrics.breakEvenUnits / metrics.estimatedMonthlyCapacity) * 100).toFixed(1) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Eficiencia operativa:</span>
                  <span className="font-medium text-green-600">
                    {metrics.marginOfSafety > 30 ? 'Alta' : metrics.marginOfSafety > 15 ? 'Media' : 'Baja'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sostenibilidad:</span>
                  <span className="font-medium text-green-600">
                    {metrics.annualROI > 20 ? 'Alta' : metrics.annualROI > 10 ? 'Media' : 'Baja'}
                  </span>
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
                {metrics.marginOfSafety > 30 && (
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Excelente margen de seguridad del {metrics.marginOfSafety.toFixed(1)}%</span>
                  </li>
                )}
                {metrics.annualROI > 15 && (
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>ROI anual atractivo del {metrics.annualROI.toFixed(1)}%</span>
                  </li>
                )}
                {products.length > 0 && (
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Diversificación con {products.length} productos configurados</span>
                  </li>
                )}
                {metrics.averageSellingPrice > metrics.averageVariableCost * 2 && (
                  <li className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Buen margen de contribución en los precios</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">🚀 Próximos Pasos</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {metrics.marginOfSafety < 30 && (
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Optimizar costos para mejorar el margen de seguridad</span>
                  </li>
                )}
                {metrics.annualROI < 15 && (
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Implementar estrategias para mejorar la rentabilidad</span>
                  </li>
                )}
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Desarrollar un plan de marketing detallado</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Implementar sistema de control de inventario</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Establecer métricas de seguimiento mensual</span>
                </li>
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
            Con un ROI del {metrics.annualROI.toFixed(1)}% y un margen de seguridad del {metrics.marginOfSafety.toFixed(1)}%, 
            tu negocio de {businessType} tiene {metrics.riskLevel === 'Bajo' ? 'excelentes' : metrics.riskLevel === 'Medio' ? 'buenas' : 'perspectivas de mejora en'} 
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
