import React, { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { Target, TrendingUp, DollarSign, Calculator, BarChart3, ChefHat, AlertCircle, CheckCircle } from 'lucide-react';

// Datos de ejemplo para desarrollo
const mockRecipes = [
  {
    receta_id: 1,
    producto_id: 1,
    nombre_receta: "Hamburguesa Clásica",
    tiempo_preparacion: 15,
    personal_requerido: 2,
    costos_adicionales: 2.50,
    precio_venta: 8.99,
    producto: {
      nombre_producto: "Hamburguesa",
      precio_por_unidad: 8.99,
      costo_por_unidad: 3.50
    }
  },
  {
    receta_id: 2,
    producto_id: 2,
    nombre_receta: "Pizza Margherita",
    tiempo_preparacion: 25,
    personal_requerido: 3,
    costos_adicionales: 3.00,
    precio_venta: 12.99,
    producto: {
      nombre_producto: "Pizza",
      precio_por_unidad: 12.99,
      costo_por_unidad: 5.00
    }
  },
  {
    receta_id: 3,
    producto_id: 3,
    nombre_receta: "Ensalada César",
    tiempo_preparacion: 10,
    personal_requerido: 1,
    costos_adicionales: 1.50,
    precio_venta: 6.99,
    producto: {
      nombre_producto: "Ensalada",
      precio_por_unidad: 6.99,
      costo_por_unidad: 2.50
    }
  }
];

export function EquilibriumPage() {
  // Datos de ejemplo para desarrollo
  const mockCostosFijos = 5000; // $5,000 mensuales
  const gananciaObjetivo = 2000; // $2,000 de ganancia objetivo

  // Estado para las cantidades de ventas de cada receta
  const [cantidadesVentas, setCantidadesVentas] = useState<{ [key: number]: number }>({
    1: 100, // Hamburguesas
    2: 80,  // Pizzas
    3: 120  // Ensaladas
  });

  // Estado para el ganancia objetivo
  const [gananciaObjetivoState, setGananciaObjetivoState] = useState(gananciaObjetivo);

  // CÁLCULOS CORREGIDOS usando las fórmulas correctas
  const recetasEquilibrio = mockRecipes.map(receta => {
    const qty = cantidadesVentas[receta.receta_id] || 0;
    const price = receta.precio_venta;
    const varCost = receta.costos_adicionales || 0;
    
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
  });

  // CÁLCULOS TOTALES CORREGIDOS usando useMemo para optimización
  const totalRevenue = useMemo(() => 
    recetasEquilibrio.reduce((sum, item) => sum + item.ingresos_totales, 0),
    [recetasEquilibrio]
  );
  
  const totalVarCosts = useMemo(() => 
    recetasEquilibrio.reduce((sum, item) => sum + item.costos_variables, 0),
    [recetasEquilibrio]
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
    totalRevenue - totalVarCosts - mockCostosFijos,
    [totalRevenue, totalVarCosts]
  );
  
  // PUNTO DE EQUILIBRIO CLÁSICO (sin meta)
  const BE_revenue = useMemo(() => 
    totalCMR > 0 ? mockCostosFijos / totalCMR : 0,
    [totalCMR]
  );
  
  const gap_BE = useMemo(() => 
    Math.max(0, BE_revenue - totalRevenue),
    [BE_revenue, totalRevenue]
  );
  
  // EQUILIBRIO CON META (cubrir CF + CV + meta)
  const Target_revenue = useMemo(() => 
    totalCMR > 0 ? (mockCostosFijos + gananciaObjetivoState) / totalCMR : 0,
    [totalCMR, gananciaObjetivoState]
  );
  
  const gap_Target = useMemo(() => 
    Math.max(0, Target_revenue - totalRevenue),
    [Target_revenue, totalRevenue]
  );

  // Función para actualizar cantidad de ventas
  const actualizarCantidadVentas = (recetaId: number, nuevaCantidad: number) => {
    setCantidadesVentas(prev => ({
      ...prev,
      [recetaId]: Math.max(0, nuevaCantidad)
    }));
  };

  // Función para actualizar ganancia objetivo
  const actualizarGananciaObjetivo = (nuevaGanancia: number) => {
    setGananciaObjetivoState(Math.max(0, nuevaGanancia));
  };

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
                  if (isNaN(valor) || valor < 0) {
                    setGananciaObjetivoState(0);
                  }
                }}
                className="text-2xl font-bold text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                step="100"
              />
            </div>
            <div className="ml-4 text-sm text-gray-600">
              <span className="font-medium">Estado:</span> 
              <span className="ml-1 text-green-600">✓ Activo</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Los cambios en la ganancia objetivo se aplican automáticamente y actualizan todos los cálculos del punto de equilibrio en tiempo real.
            </p>
          </div>
        </div>

        {/* Resumen de costos y métricas clave */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Métricas Clave del Negocio</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <Calculator className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Costos Fijos</p>
                  <p className="text-xl font-bold text-blue-900">${mockCostosFijos.toLocaleString()}</p>
                </div>
              </div>
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

            <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-sm text-orange-600 font-medium">Ratio Margen</p>
                  <p className="text-xl font-bold text-orange-900">{(totalCMR * 100).toFixed(1)}%</p>
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recetas y Controles Interactivos</h2>
          
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
                      <p className="text-2xl font-bold text-blue-600">${item.receta.precio_venta}</p>
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
                      <span className="font-medium">Costo variable unitario:</span> ${item.costo_variable_unitario}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Estado del punto de equilibrio usando fórmulas correctas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Estado del Punto de Equilibrio</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Resumen financiero */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen Financiero</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingresos totales:</span>
                  <span className="font-semibold text-green-600">${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Costos variables totales:</span>
                  <span className="font-semibold text-red-600">${totalVarCosts.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margen de contribución:</span>
                  <span className="font-semibold text-blue-600">${totalCM.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Costos fijos:</span>
                  <span className="font-semibold text-red-600">${mockCostosFijos.toLocaleString()}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Utilidad/Pérdida:</span>
                  <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {profit >= 0 ? '+' : '-'}${Math.abs(profit).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Estado del equilibrio usando fórmulas correctas */}
            <div className={`rounded-lg p-6 border ${
              profit >= 0 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' 
                : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'
            }`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Equilibrio</h3>
              
              {profit >= 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <span className="text-green-800 font-medium">¡Punto de equilibrio alcanzado!</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Con las cantidades actuales, estás generando una utilidad de <strong>${profit.toLocaleString()}</strong>
                  </p>
                  <div className="bg-green-100 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      <strong>Recomendación:</strong> Puedes considerar reducir algunas cantidades para optimizar recursos o aumentar tu ganancia objetivo.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <span className="text-red-800 font-medium">Punto de equilibrio no alcanzado</span>
                  </div>
                  <p className="text-sm text-red-700">
                    Te falta generar <strong>${gap_BE.toLocaleString()}</strong> para alcanzar el punto de equilibrio básico
                  </p>
                  <div className="bg-red-100 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      <strong>Recomendación:</strong> Aumenta las cantidades de ventas o ajusta tu ganancia objetivo para alcanzar el equilibrio.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Análisis del punto de equilibrio usando fórmulas correctas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Análisis del Punto de Equilibrio</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Punto de equilibrio clásico */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Punto de Equilibrio Clásico</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingresos necesarios:</span>
                  <span className="font-semibold text-blue-600">${BE_revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingresos actuales:</span>
                  <span className="font-semibold text-green-600">${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ratio margen (CMR):</span>
                  <span className="font-semibold text-purple-600">{(totalCMR * 100).toFixed(1)}%</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Brecha para equilibrio:</span>
                  <span className="text-red-600">${gap_BE.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Equilibrio con meta */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equilibrio con Meta</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingresos para meta:</span>
                  <span className="font-semibold text-orange-600">${Target_revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ingresos actuales:</span>
                  <span className="font-semibold text-green-600">${totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ganancia objetivo:</span>
                  <span className="font-semibold text-blue-600">${gananciaObjetivoState.toLocaleString()}</span>
                </div>
                <hr className="border-gray-300" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Brecha hacia meta:</span>
                  <span className="text-red-600">${gap_Target.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-4 p-2 bg-yellow-100 rounded border border-yellow-200">
                <p className="text-xs text-yellow-800">
                  <strong>Actualizado en tiempo real:</strong> Este valor cambia automáticamente cuando ajustas la ganancia objetivo arriba.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendaciones específicas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recomendaciones Específicas</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recomendaciones por receta */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Por Receta</h3>
              {recetasEquilibrio.map((item) => {
                const eficiencia = item.cantidad_ventas > 0 ? 'alta' : 'baja';
                
                return (
                  <div key={item.receta.receta_id} className={`p-3 rounded-lg border ${
                    eficiencia === 'alta' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {eficiencia === 'alta' ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-600" />
                      )}
                      <span className="font-medium text-gray-900">{item.receta.nombre_receta}</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {eficiencia === 'alta' 
                        ? `Activa: ${item.cantidad_ventas} ventas, CMR: ${(item.ratio_margen * 100).toFixed(1)}%`
                        : `Inactiva: 0 ventas configuradas`
                      }
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Recomendaciones generales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Generales</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    <strong>Punto de equilibrio:</strong> Necesitas generar ${BE_revenue.toLocaleString()} en ingresos para cubrir costos fijos.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    <strong>Ratio de margen:</strong> Tu CMR actual es {(totalCMR * 100).toFixed(1)}%. Un CMR más alto significa menos ventas necesarias.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    <strong>Meta de ganancia:</strong> Para alcanzar ${gananciaObjetivoState.toLocaleString()} de ganancia, necesitas generar ${Target_revenue.toLocaleString()} en ingresos.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">
                    <strong>Actualización automática:</strong> Todos los cálculos se recalculan en tiempo real cuando cambias la ganancia objetivo o las cantidades de ventas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS para el slider personalizado */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </MainLayout>
  );
}
