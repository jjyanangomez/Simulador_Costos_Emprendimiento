import { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, DollarSign, Package } from 'lucide-react';
import type { Ingredient, Product, AdditionalCost, AIAnalysis } from '../../../domain/types';

interface VariableCostsSummaryProps {
  products: Product[];
  additionalCosts: AdditionalCost[];
  businessType: string;
}

export function VariableCostsSummary({ products, additionalCosts, businessType }: VariableCostsSummaryProps) {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Calcular costos totales de productos
  const calculateProductCosts = (product: Product): number => {
    if (product.type === 'recipe' && product.ingredients) {
      return product.ingredients.reduce((total, ingredient) => {
        const costPerPortion = ingredient.unitPrice / (ingredient.portionsObtained || 1);
        return total + (costPerPortion * ingredient.portion);
      }, 0);
    } else if (product.type === 'resale') {
      return product.resaleCost || 0; // ✅ Usar el costo de reventa
    }
    return 0;
  };

  // Generar análisis de IA
  const generateAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simular análisis de IA
    setTimeout(() => {
      const totalProductCosts = products.reduce((sum, product) => {
        return sum + calculateProductCosts(product); // ✅ Incluir todos los productos
      }, 0);

      const totalAdditionalCosts = additionalCosts.reduce((sum, cost) => sum + cost.value, 0);
      const totalRevenue = products.reduce((sum, product) => sum + (product.sellingPrice || 0), 0);
      const totalProfit = totalRevenue - totalProductCosts - totalAdditionalCosts;
      const averageMargin = totalRevenue > 0 ? ((totalRevenue - totalProductCosts) / totalRevenue) * 100 : 0;

      // Generar recomendaciones basadas en los datos
      const recommendations: string[] = [];
      
      if (totalProductCosts === 0) {
        recommendations.push('💡 No hay productos de preparación registrados. Considera agregar productos con ingredientes para un análisis más completo.');
      }

      if (totalAdditionalCosts > totalProductCosts * 0.5 && totalProductCosts > 0) {
        recommendations.push('⚠️ Los costos adicionales son altos comparados con los costos de productos. Revisa si son necesarios.');
      }

      if (products.filter(p => p.type === 'recipe').length === 0) {
        recommendations.push('💡 Considera agregar productos de preparación para tener un control más detallado de los costos.');
      }

      if (totalProductCosts > 0) {
        recommendations.push('✅ Has registrado costos de productos. Ahora puedes establecer precios de venta para calcular márgenes de ganancia.');
      }

      // Determinar nivel de riesgo
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (totalProductCosts === 0 && totalAdditionalCosts === 0) {
        riskLevel = 'medium';
      } else if (totalAdditionalCosts > totalProductCosts * 2 && totalProductCosts > 0) {
        riskLevel = 'high';
      }

      // Calcular puntuación de rentabilidad (0-100)
      const profitabilityScore = Math.min(100, Math.max(0, 
        (products.length * 10) + 
        (totalProductCosts > 0 ? 30 : 0) + 
        (totalAdditionalCosts > 0 ? 20 : 0) + 
        (riskLevel === 'low' ? 20 : riskLevel === 'medium' ? 10 : 0)
      ));

      setAnalysis({
        totalProductCosts,
        totalAdditionalCosts,
        totalRevenue,
        totalProfit,
        averageMargin,
        recommendations,
        riskLevel,
        profitabilityScore,
      });
      
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    if (products.length > 0 || additionalCosts.length > 0) {
      generateAIAnalysis();
    }
  }, [products, additionalCosts]);

  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-medium">Analizando datos con IA...</span>
          </div>
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm text-gray-600 mt-4">
            Generando recomendaciones personalizadas para tu negocio
          </p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-600" />
          Resumen y Análisis de Costos Variables
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          analysis.riskLevel === 'low' 
            ? 'bg-green-100 text-green-800' 
            : analysis.riskLevel === 'medium'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          Riesgo: {analysis.riskLevel === 'low' ? 'Bajo' : analysis.riskLevel === 'medium' ? 'Medio' : 'Alto'}
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Costos Productos</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">${analysis.totalProductCosts.toFixed(2)}</p>
        </div>
        
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Costos Adicionales</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">${analysis.totalAdditionalCosts.toFixed(2)}</p>
        </div>
        
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Total Costos Variables</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">
            ${(analysis.totalProductCosts + analysis.totalAdditionalCosts).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Puntuación de rentabilidad */}
      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-900">Puntuación de Completitud</span>
          <span className="text-2xl font-bold text-blue-600">{analysis.profitabilityScore.toFixed(0)}/100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              analysis.profitabilityScore >= 80 ? 'bg-green-500' :
              analysis.profitabilityScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${analysis.profitabilityScore}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Baja</span>
          <span>Media</span>
          <span>Alta</span>
        </div>
      </div>

      {/* Análisis detallado de productos */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Productos</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Producto</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Tipo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Costo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Ingredientes</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const productCost = calculateProductCosts(product);

                return (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        {product.type === 'recipe' && (
                          <p className="text-sm text-gray-500">
                            {product.preparationTime} min • {product.staffRequired} persona(s)
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.type === 'recipe' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.type === 'recipe' ? 'Preparación' : 'Reventa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-red-600">${productCost.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-gray-600">
                        {product.type === 'recipe' && product.ingredients 
                          ? `${product.ingredients.length} ingredientes`
                          : 'N/A'
                        }
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recomendaciones de la IA */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="w-5 h-5 mr-2 text-blue-600" />
          Recomendaciones de la IA
        </h3>
        <div className="space-y-3">
          {analysis.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex-shrink-0 mt-0.5">
                {recommendation.includes('⚠️') ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                ) : recommendation.includes('✅') ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Brain className="w-5 h-5 text-blue-600" />
                )}
              </div>
              <p className="text-sm text-blue-900">{recommendation.replace(/[⚠️✅💡]/g, '').trim()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
