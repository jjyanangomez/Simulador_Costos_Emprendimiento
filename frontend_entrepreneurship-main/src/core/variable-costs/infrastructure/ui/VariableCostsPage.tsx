import { useState, useEffect } from 'react';
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

import toast from 'react-hot-toast';
import { useAuth } from '../../../../core/auth/infrastructure/hooks/useAuth';
import { apiService } from '../../../../shared/infrastructure/services/api.service';

import type { Ingredient, Product, AdditionalCost } from '../../domain/types';

export function VariableCostsPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [additionalCosts, setAdditionalCosts] = useState<AdditionalCost[]>([]);
  const [businessType, setBusinessType] = useState('restaurante');
  const [showSummary, setShowSummary] = useState(false);
  const [aiValidations, setAiValidations] = useState<Record<number, any[]>>({});
  const [negocioId, setNegocioId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [costTypes, setCostTypes] = useState<any[]>([]);
  const [unitMeasures, setUnitMeasures] = useState<any[]>([]);
  const [savedVariableCosts, setSavedVariableCosts] = useState<any[]>([]);
  const [savedProducts, setSavedProducts] = useState<any[]>([]);

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Obtener el negocio del usuario logueado
        if (user && user.usuarioId) {
          try {
            const businessesResponse = await apiService.getBusinesses();
            console.log('📡 Respuesta de la API de negocios:', businessesResponse);
            
            // La API devuelve directamente un array, no { data: [...] }
            const negocios = Array.isArray(businessesResponse) ? businessesResponse : businessesResponse.data || [];
            console.log('📋 Negocios disponibles:', negocios);
            
            // Buscar el negocio del usuario usando los nombres de campos correctos
            const userBusiness = negocios.find((business: any) => 
              business.usuarioId === user.usuarioId || business.usuario_id === user.usuarioId
            );
            
            if (userBusiness) {
              // Usar el campo correcto para el ID del negocio
              const negocioId = userBusiness.negocioId || userBusiness.negocio_id;
              setNegocioId(negocioId);
              console.log('✅ Negocio encontrado para el usuario:', userBusiness);
              console.log('🆔 ID del negocio:', negocioId);
              
              // 4. Cargar costos variables guardados previamente
              try {
                const variableCostsResponse = await apiService.getVariableCosts(negocioId);
                setSavedVariableCosts(variableCostsResponse.data || []);
                console.log('✅ Costos variables guardados cargados:', variableCostsResponse.data);
              } catch (variableCostsError) {
                console.error('❌ Error al cargar costos variables guardados:', variableCostsError);
              }
              
              // 5. Cargar productos guardados previamente
              try {
                const productsResponse = await apiService.getProducts(negocioId);
                setSavedProducts(productsResponse.data || []);
                console.log('✅ Productos guardados cargados:', productsResponse.data);
              } catch (productsError) {
                console.error('❌ Error al cargar productos guardados:', productsError);
              }
            } else {
              setError('No se encontró un negocio para este usuario');
              console.error('❌ No hay negocio para el usuario:', user.usuarioId);
            }
          } catch (businessError) {
            console.error('❌ Error al obtener negocios:', businessError);
            setError('Error al obtener el negocio del usuario');
          }
        } else {
          setError('Usuario no autenticado');
        }
        
        // 2. Cargar tipos de costo variables
        try {
          const costTypesResponse = await apiService.getCostTypes();
          const variableCostTypes = costTypesResponse.data?.filter((type: any) => !type.es_fijo) || [];
          setCostTypes(variableCostTypes);
          console.log('✅ Tipos de costo variables cargados:', variableCostTypes);
        } catch (costTypesError) {
          console.error('❌ Error al cargar tipos de costo:', costTypesError);
        }
        
        // 3. Cargar unidades de medida
        try {
          const unitMeasuresResponse = await apiService.getUnitMeasures();
          setUnitMeasures(unitMeasuresResponse.data || []);
          console.log('✅ Unidades de medida cargadas:', unitMeasuresResponse.data);
        } catch (unitMeasuresError) {
          console.error('❌ Error al cargar unidades de medida:', unitMeasuresError);
        }
        
      } catch (error) {
        console.error('❌ Error al cargar datos iniciales:', error);
        setError('Error al cargar datos iniciales');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user) {
      loadInitialData();
    } else {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  // Función para combinar datos guardados con nuevos datos
  const getCombinedData = () => {
    // Combinar productos guardados con nuevos productos
    const allProducts = [...savedProducts, ...products];
    
    // Combinar costos variables guardados con nuevos costos adicionales
    const allVariableCosts = [...savedVariableCosts, ...additionalCosts];
    
    return { allProducts, allVariableCosts };
  };

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

    if (!negocioId) {
      toast.error('No se pudo obtener el ID del negocio');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('💾 Iniciando guardado de costos variables...');
      console.log('📦 Productos a guardar:', products);
      console.log('💰 Costos adicionales a guardar:', additionalCosts);
      
      // 1. Guardar productos (con sus recetas si aplica)
      const productPromises = products.map(async (product) => {
        try {
          // Crear el producto base
          const productData = {
            negocioId: negocioId,
            categoriaId: 1, // Categoría por defecto - se puede hacer configurable
            unidadMedidaId: 1, // Unidad por defecto - se puede hacer configurable
            nombreProducto: product.name,
            precioPorUnidad: calculateProductCost(product) || 0.01, // Mínimo 0.01 para evitar validación
            porcionRequerida: 1,
            costoPorUnidad: calculateProductCost(product) || 0.01 // Mínimo 0.01 para evitar validación
          };
          
          console.log('📤 Enviando producto al backend:', productData);
          const productResponse = await apiService.createProduct(productData);
          console.log('✅ Producto creado:', productResponse);
          
          // Si es un producto de receta, crear la receta con ingredientes
          if (product.type === 'recipe' && product.ingredients && product.ingredients.length > 0) {
            const recipeData = {
              productoId: productResponse.data.producto_id,
              nombreReceta: product.name,
              tiempoPreparacion: product.preparationTime || 0,
              personalRequerido: product.staffRequired || 1,
              costosAdicionales: 0.01, // ✅ Mínimo 0.01 para evitar validación
              precioVenta: calculateProductCost(product) || 0.01 // Mínimo 0.01 para evitar validación
            };
            
            console.log('📤 Enviando receta al backend:', recipeData);
            const recipeResponse = await apiService.createRecipe(recipeData);
            console.log('✅ Receta creada:', recipeResponse);
            
            // Crear costos variables para cada ingrediente
            const ingredientPromises = product.ingredients.map(async (ingredient) => {
              const costoVariableData = {
                negocioId: negocioId,
                productoId: productResponse.data.producto_id,
                recetaId: recipeResponse.data.receta_id,
                tipoCostoId: 5, // Materia Prima
                nombre: ingredient.name,
                descripcion: `Ingrediente: ${ingredient.name}`,
                montoPorUnidad: ingredient.unitPrice,
                unidadMedidaId: 1 // Se puede hacer configurable
              };
              
              console.log('📤 Enviando costo variable de ingrediente:', costoVariableData);
              return apiService.createVariableCost(costoVariableData);
            });
            
            await Promise.all(ingredientPromises);
            console.log('✅ Costos variables de ingredientes creados');
          }
          
          return productResponse;
        } catch (productError) {
          console.error(`❌ Error al guardar producto ${product.name}:`, productError);
          throw productError;
        }
      });
      
      // 2. Guardar costos adicionales
      const additionalCostPromises = additionalCosts.map(async (cost) => {
        try {
          const costoVariableData = {
            negocioId: negocioId,
            tipoCostoId: 6, // Mano de Obra
            nombre: cost.name,
            descripcion: cost.category,
            montoPorUnidad: cost.value,
            unidadMedidaId: 1 // Se puede hacer configurable
          };
          
          console.log('📤 Enviando costo adicional:', costoVariableData);
          return apiService.createVariableCost(costoVariableData);
        } catch (costError) {
          console.error(`❌ Error al guardar costo adicional ${cost.name}:`, costError);
          throw costError;
        }
      });
      
      // 3. Esperar a que se guarden todos los datos
      await Promise.all([...productPromises, ...additionalCostPromises]);
      
      console.log('🎉 Todos los costos variables guardados exitosamente');
      toast.success('¡Costos variables guardados exitosamente en la base de datos!');
      
      setShowSummary(true);
    } catch (error) {
      console.error('❌ Error al guardar costos variables:', error);
      toast.error('Error al guardar los costos variables en la base de datos');
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

  // Verificar si el usuario está autenticado y tiene un negocio
  if (!isAuthenticated || !user) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-yellow-800 mb-4">
              🔐 Acceso Requerido
            </h1>
            <p className="text-lg text-yellow-700">
              Debes iniciar sesión para acceder a esta página.
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-red-800 mb-4">
              ❌ Error
            </h1>
            <p className="text-lg text-red-700">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!negocioId) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <h1 className="text-2xl font-bold text-blue-800 mb-4">
              🔄 Cargando...
            </h1>
            <p className="text-lg text-blue-700">
              Obteniendo información del negocio...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (showSummary) {
    const { allProducts, allVariableCosts } = getCombinedData();
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowSummary(false)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver a Costos Variables</span>
            </button>
          </div>
          
          <VariableCostsSummary 
            products={allProducts}
            additionalCosts={allVariableCosts}
            businessType={businessType}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Costos Variables</h1>
            <p className="text-lg text-gray-600 mt-2">
              Gestiona los costos que varían según el volumen de producción
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al Dashboard</span>
          </button>
        </div>

        {/* Sección 1: Productos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Productos y Recetas
            </h2>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Producto</span>
            </button>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay productos agregados
              </h3>
              <p className="text-gray-600 mb-4">
                Comienza agregando productos de preparación o reventa
              </p>
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <ChefHat className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Productos que preparas con ingredientes
                  </p>
                </div>
                <div className="text-center">
                  <ShoppingBag className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Productos que compras y vendes directamente
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {product.type === 'recipe' ? (
                        <ChefHat className="w-5 h-5 text-blue-600" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-green-600" />
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">
                          {product.type === 'recipe' ? 'Producto de Preparación' : 'Producto de Reventa'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        Costo: ${calculateProductCost(product).toFixed(2)}
                      </span>
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
                  
                  {product.type === 'recipe' && product.ingredients && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredientes:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {product.ingredients.map((ingredient, index) => (
                          <div key={index} className="text-sm text-gray-600">
                            • {ingredient.name}: {ingredient.portion} {ingredient.unitOfMeasure} (${ingredient.unitPrice})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección 2: Costos Variables Adicionales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Costos Variables Adicionales
          </h2>
          <AdditionalVariableCosts
            onCostsChange={handleAdditionalCostsChange}
            businessType={businessType}
          />
        </div>

        {/* Botones de acción */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Dashboard</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar y Continuar</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal para agregar/editar productos */}
      <AddProductModal
        isOpen={showAddProductModal}
        onClose={handleCloseModal}
        onSave={addProduct}
        editingProduct={editingProduct}
      />
    </MainLayout>
  );
}
