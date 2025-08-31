import React, { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { Target, TrendingUp, DollarSign, Calculator, BarChart3, ChefHat, AlertCircle, CheckCircle } from 'lucide-react';
import { BusinessDataLocalStorageService } from '../../../../shared/infrastructure/services/businessDataLocalStorage.service';
import toast from 'react-hot-toast';

export function EquilibriumPage() {
  // Estado para los costos fijos (por defecto 0)
  const [costosFijos, setCostosFijos] = useState<number>(0);
  const [loadingCostos, setLoadingCostos] = useState<boolean>(true);
  
  // Estado para las recetas desde localStorage
  const [recetas, setRecetas] = useState<any[]>([]);
  const [loadingRecetas, setLoadingRecetas] = useState<boolean>(true);
  
  const gananciaObjetivo = 2000; // $2,000 de ganancia objetivo

  // Estado para las cantidades de ventas de cada receta
  const [cantidadesVentas, setCantidadesVentas] = useState<{ [key: number]: number }>({});

  // Estado para el ganancia objetivo
  const [gananciaObjetivoState, setGananciaObjetivoState] = useState(gananciaObjetivo);

  // CÁLCULOS CORREGIDOS usando las fórmulas correctas
  const recetasEquilibrio = recetas.length > 0 ? recetas.map(receta => {
    const qty = cantidadesVentas[receta.receta_id] || 0;
    const price = receta.precio_venta;
    const varCost = receta.costo_receta || 0;
    
    // Fórmula correcta: revenue = qty × price
    const revenue = qty * price;
    
    // Fórmula correcta: varTotal = qty × varCost
    const varTotal = qty * varCost;
    
    // Fórmula correcta: CM = revenue - varTotal
    const CM = revenue - varTotal;
    
    // Fórmula correcta: CMR = CM / revenue (si revenue > 0)
    const CMR = revenue > 0 ? CM / revenue : 0;

    return {
      receta,
      cantidad_ventas: qty,
      ingresos_totales: revenue,
      costos_variables: varTotal,
      margen_contribucion: CM,
      ratio_margen: CMR,
      precio_venta: price,
      costo_variable_unitario: varCost
    };
  }) : [];

  // CÁLCULOS TOTALES CORREGIDOS usando useMemo para optimización
  const totalRevenue = useMemo(() => 
    recetas.length > 0 ? recetasEquilibrio.reduce((sum, item) => sum + item.ingresos_totales, 0) : 0,
    [recetasEquilibrio, recetas.length]
  );
  
  const totalVarCosts = useMemo(() => 
    recetas.length > 0 ? recetasEquilibrio.reduce((sum, item) => sum + item.costos_variables, 0) : 0,
    [recetasEquilibrio, recetas.length]
  );
  
  const totalCM = useMemo(() => 
    totalRevenue - totalVarCosts,
    [totalRevenue, totalVarCosts]
  );
  
  const totalCMR = useMemo(() => 
    totalRevenue > 0 ? totalCM / totalRevenue : 0,
    [totalRevenue, totalCM]
  );
  
  const profit = useMemo(() => 
    totalRevenue - totalVarCosts - costosFijos,
    [totalRevenue, totalVarCosts, costosFijos]
  );
  
  // PUNTO DE EQUILIBRIO CLÁSICO (sin meta)
  const BE_revenue = useMemo(() => 
    recetas.length > 0 && totalCMR > 0 ? costosFijos / totalCMR : 0,
    [totalCMR, costosFijos, recetas.length]
  );
  
  const gap_BE = useMemo(() => 
    recetas.length > 0 ? Math.max(0, BE_revenue - totalRevenue) : 0,
    [BE_revenue, totalRevenue, recetas.length]
  );
  
  // EQUILIBRIO CON META (cubrir CF + CV + meta)
  const Target_revenue = useMemo(() => 
    recetas.length > 0 && totalCMR > 0 ? (costosFijos + gananciaObjetivoState) / totalCMR : 0,
    [totalCMR, gananciaObjetivoState, costosFijos, recetas.length]
  );
  
  const gap_Target = useMemo(() => 
    Math.max(0, Target_revenue - totalRevenue),
    [Target_revenue, totalRevenue, recetas.length]
  );

  // Función para actualizar cantidades de ventas
  const actualizarCantidadVentas = (recetaId: number, nuevaCantidad: number) => {
    setCantidadesVentas(prev => ({
      ...prev,
      [recetaId]: Math.max(0, nuevaCantidad)
    }));
  };

  // Función para cargar recetas desde localStorage
  const cargarRecetas = async () => {
    try {
      setLoadingRecetas(true);
      console.log('🔄 Iniciando carga de recetas desde localStorage...');
      
      // Obtener productos de costos variables del localStorage
      const variableCostsProducts = BusinessDataLocalStorageService.getVariableCostsProducts();
      
      if (variableCostsProducts.length > 0) {
        // Convertir productos de costos variables a formato de recetas para equilibrio
        const recetasFromLocalStorage = variableCostsProducts
          .filter(product => product.type === 'recipe') // Solo productos de tipo receta
          .map((product, index) => {
            // Calcular costo total del producto
            const costoTotal = product.ingredients 
              ? product.ingredients.reduce((total, ingredient) => {
                  const costPerPortion = ingredient.unitPrice / (ingredient.portionsObtained || 1);
                  return total + (costPerPortion * ingredient.portion);
                }, 0)
              : 0;

            // Obtener precio de venta del localStorage de precio de venta
            const precioVentaProductos = BusinessDataLocalStorageService.getPrecioVentaProductos();
            const precioVentaProducto = precioVentaProductos.find(p => p.nombre_producto === product.name);
            const precioVenta = precioVentaProducto ? precioVentaProducto.precio_venta_cliente : costoTotal * 1.3; // 30% margen por defecto

            return {
              receta_id: index + 1,
              nombre_receta: product.name,
              precio_venta: precioVenta,
              costo_receta: costoTotal,
              descripcion: `Receta de ${product.name}`,
              tiempo_preparacion: product.preparationTime || 30,
              dificultad: 'Media',
              categoria: 'Principal'
            };
          });

        console.log('✅ Recetas cargadas desde localStorage:', recetasFromLocalStorage);
        console.log('📊 Cantidad de recetas:', recetasFromLocalStorage.length);
        
        setRecetas(recetasFromLocalStorage);
        
        // Inicializar cantidades de ventas con valores por defecto
        const cantidadesIniciales: { [key: number]: number } = {};
        recetasFromLocalStorage.forEach((receta: any) => {
          cantidadesIniciales[receta.receta_id] = 0; // Comenzar desde 0
        });
        setCantidadesVentas(cantidadesIniciales);
        console.log('🎯 Cantidades iniciales configuradas:', cantidadesIniciales);
      } else {
        console.log('⚠️ No hay productos de receta en localStorage');
        setRecetas([]);
        setCantidadesVentas({});
      }
    } catch (error) {
      console.error('❌ Error al cargar recetas desde localStorage:', error);
      setRecetas([]);
      setCantidadesVentas({});
    } finally {
      setLoadingRecetas(false);
      console.log('🏁 Carga de recetas finalizada');
    }
  };

  // Función para cargar costos fijos desde localStorage
  const cargarCostosFijos = async () => {
    try {
      setLoadingCostos(true);
      console.log('🔄 Cargando costos fijos desde localStorage...');
      
      // Cargar costos fijos desde localStorage
      const fixedCostsData = BusinessDataLocalStorageService.getFixedCosts();
      const totalFixedCosts = BusinessDataLocalStorageService.getTotalFixedCosts();
      
      setCostosFijos(totalFixedCosts);
      console.log('✅ Costos fijos cargados desde localStorage:', totalFixedCosts);
      console.log('📊 Datos de costos fijos:', fixedCostsData);
    } catch (error) {
      console.error('❌ Error al cargar costos fijos desde localStorage:', error);
      setCostosFijos(0);
    } finally {
      setLoadingCostos(false);
      console.log('🏁 Carga de costos fijos finalizada');
    }
  };

  // Función para actualizar ganancia objetivo
  const actualizarGananciaObjetivo = (nuevaGanancia: number) => {
    setGananciaObjetivoState(Math.max(0, nuevaGanancia));
  };

  // useEffect para cargar datos al montar el componente
  useEffect(() => {
    cargarRecetas();
    cargarCostosFijos();
  }, []);

  // useEffect para depurar cambios en ganancia objetivo
  useEffect(() => {
    console.log('Ganancia objetivo actualizada:', gananciaObjetivoState);
    console.log('Target_revenue recalculado:', Target_revenue);
    console.log('gap_Target recalculado:', gap_Target);
  }, [gananciaObjetivoState, Target_revenue, gap_Target]);

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Punto de Equilibrio Interactivo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ajusta las cantidades de ventas de cada receta y observa en tiempo real 
            cómo cambian tus ingresos, costos y ganancias. Encuentra el punto de equilibrio perfecto.
          </p>
        </div>

        {/* Control de ganancia objetivo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Configuración de Ganancia Objetivo</h2>
          <div className="flex items-center gap-4">
            <label className="text-lg font-medium text-gray-700">Ganancia Objetivo Mensual:</label>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">$</span>
              <input
                type="number"
                value={gananciaObjetivoState}
                onChange={(e) => {
                  const valor = Number(e.target.value);
                  console.log('Input cambiado a:', valor);
                  actualizarGananciaObjetivo(valor);
                }}
                onBlur={(e) => {
                  const valor = Number(e.target.value);
                  if (valor < 0) {
                    actualizarGananciaObjetivo(0);
                  }
                }}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-lg font-semibold text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2000"
                min="0"
                step="100"
              />
            </div>
            <div className="text-sm text-gray-500">
              💡 Este valor se actualiza automáticamente en los cálculos de abajo
            </div>
          </div>
        </div>

        {/* Resumen de costos y métricas clave */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Métricas Clave del Negocio</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Costos Fijos</p>
                  <p className="text-xl font-bold text-blue-900">${costosFijos.toLocaleString()}</p>
                </div>
                {loadingCostos && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                )}
              </div>
              {!loadingCostos && (
                <p className="text-xs text-blue-600 mt-1">
                  {costosFijos > 0 ? 'Cargado desde BD' : 'Sin datos en BD'}
                </p>
              )}
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-600 font-medium">Ingresos Totales</p>
                  <p className="text-xl font-bold text-green-900">${totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Margen Contribución</p>
                  <p className="text-xl font-bold text-purple-900">${totalCM.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className={`rounded-lg p-4 border ${profit >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-3">
                {profit >= 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className={`text-sm font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {profit >= 0 ? 'Utilidad' : 'Pérdida'}
                  </p>
                  <p className={`text-xl font-bold ${profit >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                    ${Math.abs(profit).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de recetas con controles interactivos */}
        {recetas.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recetas y Controles Interactivos</h2>
            
            {loadingRecetas ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-lg text-gray-600">Cargando recetas desde la base de datos...</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {recetasEquilibrio.map((item) => {
                 const cantidadMinima = 0; // Siempre empieza desde 0
                 const cantidadMaxima = 500; // Máximo fijo para simplicidad
                 
                 return (
                   <div key={item.receta.receta_id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                     <div className="flex items-center justify-between mb-4">
                       <div>
                         <h3 className="text-lg font-semibold text-gray-900">{item.receta.nombre_receta}</h3>
                         <p className="text-sm text-gray-600">
                           Producto: {item.receta.producto?.nombre_producto || 'N/A'}
                         </p>
                       </div>
                       <div className="text-right">
                         <p className="text-2xl font-bold text-blue-600">${item.receta.precio_venta.toFixed(2)}</p>
                         <p className="text-sm text-gray-500">Precio de venta</p>
                       </div>
                     </div>

                     {/* Control deslizante interactivo */}
                     <div className="mb-6">
                       <div className="flex items-center justify-between mb-2">
                         <label className="text-sm font-medium text-gray-700">
                           Cantidad de Ventas: <span className="font-bold text-blue-600">{item.cantidad_ventas}</span>
                         </label>
                         <div className="text-sm text-gray-500">
                           Mín: 0 | Máx: {cantidadMaxima}
                         </div>
                       </div>
                       
                       <div className="relative">
                         <input
                           type="range"
                           min={cantidadMinima}
                           max={cantidadMaxima}
                           value={item.cantidad_ventas}
                           onChange={(e) => actualizarCantidadVentas(item.receta.receta_id, Number(e.target.value))}
                           className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                           style={{
                             background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(item.cantidad_ventas / cantidadMaxima) * 100}%, #E5E7EB ${(item.cantidad_ventas / cantidadMaxima) * 100}%, #E5E7EB 100%)`
                           }}
                         />
                         <div className="flex justify-between text-xs text-gray-500 mt-1">
                           <span>0</span>
                           <span>{Math.round(cantidadMaxima / 2)}</span>
                           <span>{cantidadMaxima}</span>
                         </div>
                       </div>
                     </div>

                     {/* Métricas calculadas en tiempo real usando fórmulas correctas */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                       <div className="bg-white rounded-lg p-3 border border-gray-200">
                         <p className="text-sm text-gray-600">Cantidad de Ventas</p>
                         <p className="text-lg font-bold text-gray-900">{item.cantidad_ventas}</p>
                         <p className="text-sm text-gray-500">unidades</p>
                       </div>

                       <div className="bg-white rounded-lg p-3 border border-gray-200">
                         <p className="text-sm text-blue-600">Ingresos Totales</p>
                         <p className="text-lg font-bold text-blue-900">${item.ingresos_totales.toLocaleString()}</p>
                         <p className="text-sm text-gray-500">qty × price</p>
                       </div>

                       <div className="bg-white rounded-lg p-3 border border-gray-200">
                         <p className="text-sm text-green-600">Costos Variables</p>
                         <p className="text-lg font-bold text-green-900">${item.costos_variables.toLocaleString()}</p>
                         <p className="text-sm text-gray-500">qty × varCost</p>
                       </div>

                       <div className="bg-white rounded-lg p-3 border border-gray-200">
                         <p className="text-sm text-purple-600">Margen Contribución</p>
                         <p className="text-lg font-bold text-purple-900">${item.margen_contribucion.toLocaleString()}</p>
                         <p className="text-sm text-gray-500">revenue - varTotal</p>
                       </div>
                     </div>

                     {/* Barra de contribución usando ratio correcto */}
                     <div className="mb-3">
                       <div className="flex justify-between text-sm text-gray-600 mb-1">
                         <span>Ratio de Margen de Contribución</span>
                         <span>{(item.ratio_margen * 100).toFixed(1)}%</span>
                       </div>
                       <div className="w-full bg-gray-200 rounded-full h-3">
                         <div
                           className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                           style={{ width: `${Math.min(item.ratio_margen * 100, 100)}%` }}
                         ></div>
                       </div>
                     </div>

                     {/* Información adicional */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                       <div>
                         <span className="font-medium">Tiempo preparación:</span> {item.receta.tiempo_preparacion || 'N/A'} min
                       </div>
                       <div>
                         <span className="font-medium">Personal requerido:</span> {item.receta.personal_requerido || 'N/A'} personas
                       </div>
                       <div>
                         <span className="font-medium">Costo variable unitario:</span> ${item.receta.costo_receta.toFixed(2)}
                       </div>
                     </div>
                   </div>
                 );
               })}
             </div>
           )}
         </div>
       ) : (
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
           <div className="flex flex-col items-center gap-4">
             <ChefHat className="w-16 h-16 text-gray-400" />
             <h3 className="text-xl font-semibold text-gray-900">No hay recetas configuradas</h3>
             <p className="text-gray-600 max-w-md">
               Para comenzar a usar el análisis de punto de equilibrio, necesitas crear recetas en tu base de datos.
               Las recetas aparecerán automáticamente aquí una vez que estén disponibles.
             </p>
           </div>
         </div>
       )}

        {/* Estado del punto de equilibrio usando fórmulas correctas */}
        {recetas.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Estado del Punto de Equilibrio</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Punto de Equilibrio Clásico */}
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Punto de Equilibrio Clásico</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Ingresos necesarios:</span>
                    <span className="font-semibold text-blue-900">${BE_revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Ingresos actuales:</span>
                    <span className="font-semibold text-blue-900">${totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Brecha para equilibrio:</span>
                    <span className="font-semibold text-blue-900">${gap_BE.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Equilibrio con Meta */}
              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Equilibrio con Meta</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-green-700">Ingresos para meta:</span>
                    <span className="font-semibold text-green-900">${Target_revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Ingresos actuales:</span>
                    <span className="font-semibold text-green-900">${totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Ganancia objetivo:</span>
                    <span className="font-semibold text-green-900">${gananciaObjetivoState.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Brecha hacia meta:</span>
                    <span className="font-semibold text-green-900">${gap_Target.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recomendaciones específicas */}
        {recetas.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recomendaciones Específicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Para Alcanzar el Equilibrio</h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• Necesitas vender ${gap_BE.toLocaleString()} adicionales</li>
                  <li>• Enfócate en las recetas con mayor margen de contribución</li>
                  <li>• Considera ajustar precios si es posible</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Para Alcanzar tu Meta</h3>
                <ul className="space-y-2 text-green-800">
                  <li>• Necesitas vender ${gap_Target.toLocaleString()} adicionales</li>
                  <li>• Ajusta las cantidades usando los controles deslizantes</li>
                  <li>• Monitorea el impacto en tiempo real</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
