import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { AddProductModal } from './components/AddProductModal';
import { AdditionalVariableCosts } from './components/AdditionalVariableCosts';
import { VariableCostsSummary } from './components/VariableCostsSummary';
import { 
  Package, 
  Plus, 
  Trash2, 
  Save,
  ArrowRight,
  ArrowLeft,
  ChefHat,
  ShoppingBag,
  Edit
} from 'lucide-react';
import { SeccionPrecioVenta } from './components/SeccionPrecioVenta';
import toast from 'react-hot-toast';

import type { Ingredient, Product, AdditionalCost } from '../../domain/types';

export function VariableCostsPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]);
  const [businessType, setBusinessType] = useState('restaurante'); // Por defecto, se puede obtener del contexto
  const [showSummary, setShowSummary] = useState(false);
  const [aiValidations, setAiValidations] = useState<Record<number, any[]>>({});
  // ID del negocio (en un caso real esto vendría del contexto o props)
  const negocioId = 1; // Temporal - debería venir del contexto de autenticación

  // Función helper para calcular el costo de un producto
  const calculateProductCost = (product: Product): number => {
    if (product.type === 'recipe' && product.ingredients) {
      return product.ingredients.reduce((total, ingredient) => {
        const costPerPortion = ingredient.unitPrice / (ingredient.portionsObtained || 1);
        return total + (costPerPortion * ingredient.portion);
      }, 0);
    } else if (product.type === 'resale') {
      return product.resaleCost || 0;
    }
    return 0;
  };

  const addProduct = (product: Product) => {
    if (editingProduct) {
      // Actualizar producto existente
      setProducts(products.map(p => p.id === product.id ? product : p));
      toast.success(`Producto "${product.name}" actualizado exitosamente`);
    } else {
      // Agregar nuevo producto
      setProducts([...products, product]);
      toast.success(`Producto "${product.name}" agregado exitosamente`);
    }
    setEditingProduct(null);
  };

  const editProduct = (product: Product) => {
    setEditingProduct(product);
    setShowAddProductModal(true);
  };

  const removeProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
    toast.success('Producto eliminado');
  };

  const handleAdditionalCostsChange = (costs: AdditionalCost[]) => {
    setAdditionalCosts(costs);
  };

  const handleSave = async () => {
    if (products.length === 0) {
      toast.error('Debes agregar al menos un producto');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica para guardar en el backend
      console.log('Productos:', products);
      console.log('Costos adicionales:', additionalCosts);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSummary(true);
      toast.success('¡Datos guardados exitosamente!');
    } catch (error) {
      toast.error('Error al guardar los datos');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    navigate('/profitability-analysis');
  };

  const handleCloseModal = () => {
    setShowAddProductModal(false);
    setEditingProduct(null);
  };

  if (showSummary) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Resumen de Costos Variables
            </h1>
            <p className="text-lg text-gray-600">
              Análisis completo de tus productos y costos variables
            </p>
          </div>

          <VariableCostsSummary 
            products={products}
            additionalCosts={additionalCosts}
            businessType={businessType}
          />

          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={() => setShowSummary(false)}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a Editar</span>
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

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Costos Variables
          </h1>
          <p className="text-lg text-gray-600">
            Define tus productos y costos variables adicionales
          </p>
        </div>

        {/* Sección 1: Costos Variables de Productos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2 text-primary-600" />
              Costos Variables de Productos
            </h2>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Producto</span>
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay productos agregados
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza agregando tus productos principales. Puedes crear productos de preparación con recetas o productos de reventa.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <ChefHat className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Producto de Preparación</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Productos que requieren ingredientes y preparación
                  </p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <ShoppingBag className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-gray-900">Producto de Reventa</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Productos comprados y vendidos directamente
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => {
                const productCost = calculateProductCost(product);
                
                return (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {product.type === 'recipe' ? (
                            <ChefHat className="w-5 h-5 text-blue-600" />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-green-600" />
                          )}
                          <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.type === 'recipe' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product.type === 'recipe' ? 'Preparación' : 'Reventa'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Costo total:</span>
                            <p className="font-semibold text-red-600">${productCost.toFixed(2)}</p>
                          </div>
                          {product.type === 'recipe' && (
                            <>
                              <div>
                                <span className="text-gray-600">Tiempo preparación:</span>
                                <p className="font-semibold text-gray-900">{product.preparationTime} min</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Personal requerido:</span>
                                <p className="font-semibold text-gray-900">{product.staffRequired} persona(s)</p>
                              </div>
                              {product.ingredients && (
                                <div className="md:col-span-3">
                                  <span className="text-gray-600">Ingredientes:</span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {product.ingredients.map((ingredient: Ingredient, index: number) => {
                                      const costPerPortion = ingredient.unitPrice / (ingredient.portionsObtained || 1);
                                      const totalCost = costPerPortion * ingredient.portion;
                                      
                                      return (
                                        <span key={index} className="px-2 py-1 bg-gray-100 rounded text-xs">
                                          {ingredient.name} ({ingredient.portion} {ingredient.unitOfMeasure}) - ${totalCost.toFixed(2)}
                                        </span>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => editProduct(product)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeProduct(product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sección 2: Costos Variables Adicionales */}
        <AdditionalVariableCosts 
          businessType={businessType}
          onCostsChange={handleAdditionalCostsChange}
        />

        {/* Nueva sección: Precio de Venta */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary-600" />
            Precio de Venta y Análisis de Rentabilidad
          </h2>

          {/* Resumen de costos totales */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Resumen de Costos Totales</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  ${products.reduce((sum, product) => sum + calculateProductCost(product), 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Costos de Productos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  ${additionalCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Costos Adicionales</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">
                  ${(products.reduce((sum, product) => sum + calculateProductCost(product), 0) + 
                     additionalCosts.reduce((sum, cost) => sum + (cost.amount || 0), 0)).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Costo Total General</p>
              </div>
            </div>
          </div>

          {/* Lista de productos con precios y ganancias */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Análisis de Productos y Precios</h3>
            
            {products.map((product, index) => {
              const totalCost = calculateProductCost(product);
              const suggestedPrice = totalCost * 1.5; // IA sugiere 50% de margen
              const actualPrice = product.sellingPrice || 0;
              const profit = actualPrice - totalCost;
              const profitMargin = actualPrice > 0 ? ((profit / actualPrice) * 100) : 0;

              return (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profitMargin >= 30 ? 'bg-green-100 text-green-800' :
                      profitMargin >= 20 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Margen: {profitMargin.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-600 font-medium">Costo Total:</span>
                      <p className="font-semibold text-red-600 text-lg">${totalCost.toFixed(2)}</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-600 font-medium">Precio Sugerido (IA):</span>
                      <p className="font-semibold text-blue-600 text-lg">${suggestedPrice.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Margen 50%</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-600 font-medium">Precio de Venta:</span>
                      <p className="font-semibold text-green-600 text-lg">${actualPrice.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Establecido por ti</p>
                    </div>
                    
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <span className="text-gray-600 font-medium">Ganancia:</span>
                      <p className="font-semibold text-green-600 text-lg">${profit.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">Por unidad</p>
                    </div>
                  </div>

                  {/* Análisis de rentabilidad */}
                  <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Análisis de Rentabilidad:</span>
                      <div className="flex items-center space-x-2">
                        {profitMargin >= 30 ? (
                          <span className="text-green-600 text-sm">✅ Excelente rentabilidad</span>
                        ) : profitMargin >= 20 ? (
                          <span className="text-yellow-600 text-sm">⚠️ Rentabilidad moderada</span>
                        ) : (
                          <span className="text-red-600 text-sm">❌ Baja rentabilidad</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Resumen general de ganancias */}
          <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Resumen General de Ganancias</h3>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  ${products.reduce((sum, product) => {
                    const totalCost = calculateProductCost(product);
                    const profit = (product.sellingPrice || 0) - totalCost;
                    return sum + profit;
                  }, 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Ganancia Total por Productos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  ${products.reduce((sum, product) => sum + (product.sellingPrice || 0), 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Ingresos Totales</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">
                  {(() => {
                    const totalCosts = products.reduce((sum, product) => 
                      sum + calculateProductCost(product), 0
                    );
                    const totalRevenue = products.reduce((sum, product) => 
                      sum + (product.sellingPrice || 0), 0
                    );
                    const totalProfit = totalRevenue - totalCosts;
                    const totalMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100) : 0;
                    return totalMargin.toFixed(1) + '%';
                  })()}
                </p>
                <p className="text-sm text-gray-600">Margen Total del Negocio</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🆕 NUEVA SECCIÓN: Precio de Venta */}
        <div className="mt-8">
          <SeccionPrecioVenta negocioId={negocioId} />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between items-center pt-6">
          <button
            type="button"
            onClick={() => navigate('/fixed-costs')}
            className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Paso Anterior</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={products.length === 0 || isSubmitting}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar y Ver Resumen</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Modal para agregar/editar productos */}
        <AddProductModal
          isOpen={showAddProductModal}
          onClose={handleCloseModal}
          onSave={addProduct}
          editingProduct={editingProduct}
        />
      </div>
    </MainLayout>
  );
}
