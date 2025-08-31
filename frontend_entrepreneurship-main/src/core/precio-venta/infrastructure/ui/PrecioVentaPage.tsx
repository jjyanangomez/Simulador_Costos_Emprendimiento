import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../../shared/infrastructure/components/MainLayout';
import { 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  Edit3, 
  Save, 
  X,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Package
} from 'lucide-react';
import { apiService } from '../../../../shared/infrastructure/services/api.service';
import toast from 'react-hot-toast';

interface ProductoPrecioVenta {
  producto_id: number;
  nombre_producto: string;
  costo_total_producto: number;
  precio_venta_sugerido_ia: number;
  precio_venta_cliente: number;
  margen_ganancia_ia: number;
  margen_ganancia_real: number;
  ganancia_por_unidad: number;
  rentabilidad_producto: number;
}

interface ResumenCostosGanancias {
  negocio_id: number;
  costo_total_productos: number;
  costo_total_adicionales: number;
  costo_total_general: number;
  precio_venta_total_sugerido: number;
  precio_venta_total_cliente: number;
  ganancia_total_sugerida: number;
  ganancia_total_real: number;
  margen_ganancia_promedio: number;
  rentabilidad_total_negocio: number;
  roi_estimado: number;
}

export function PrecioVentaPage() {
  // ID del negocio (en un caso real esto vendría del contexto o props)
  const negocioId = 1; // Temporal - debería venir del contexto de autenticación
  const navigate = useNavigate();
  
  const [productos, setProductos] = useState<ProductoPrecioVenta[]>([]);
  const [resumen, setResumen] = useState<ResumenCostosGanancias | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');

  useEffect(() => {
    // Ahora siempre cargamos datos ya que tenemos negocioId
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.get(`/api/v1/productos-precio-venta/${negocioId}/analisis-completo`);
      
      if (response.data) {
        setProductos(response.data.productos);
        setResumen(response.data.resumen);
      } else {
        setError(response.message || 'Error al cargar datos');
      }
    } catch (err) {
      setError('Error de conexión al cargar datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const iniciarEdicion = (producto: ProductoPrecioVenta) => {
    setEditingProduct(producto.producto_id);
    setEditingPrice(producto.precio_venta_cliente.toString());
  };

  const cancelarEdicion = () => {
    setEditingProduct(null);
    setEditingPrice('');
  };

  const guardarPrecio = async (productoId: number) => {
    try {
      const nuevoPrecio = parseFloat(editingPrice);
      
      if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
        toast.error('El precio debe ser un número mayor a 0');
        return;
      }

      const response = await apiService.put(
        `/api/v1/productos-precio-venta/${negocioId}/producto/${productoId}`,
        { precio_venta_cliente: nuevoPrecio }
      );

      if (response.data) {
        setProductos(prev => prev.map(p => 
          p.producto_id === productoId 
            ? response.data 
            : p
        ));
        
        await cargarDatos();
        
        toast.success('Precio actualizado exitosamente');
        setEditingProduct(null);
        setEditingPrice('');
      } else {
        toast.error(response.message || 'Error al actualizar precio');
      }
    } catch (err) {
      toast.error('Error de conexión al actualizar precio');
      console.error('Error:', err);
    }
  };

  const formatearMoneda = (valor: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(valor);
  };

  const formatearPorcentaje = (valor: number): string => {
    return `${valor.toFixed(1)}%`;
  };

  const obtenerColorRentabilidad = (rentabilidad: number): string => {
    if (rentabilidad >= 30) return 'text-green-600';
    if (rentabilidad >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const obtenerIconoRentabilidad = (rentabilidad: number) => {
    if (rentabilidad >= 30) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (rentabilidad >= 20) return <Info className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
          <span className="ml-3 text-gray-700">Cargando análisis de precios...</span>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={cargarDatos}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Reintentar
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
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Precio de Venta</h1>
                <p className="text-gray-600">Análisis de costos, precios y rentabilidad de productos</p>
              </div>
              <button
                onClick={cargarDatos}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </button>
            </div>
          </div>

          {/* Resumen General */}
          {resumen && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mb-8 border border-blue-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Resumen General del Negocio
              </h2>
              
              {/* Resumen de Costos */}
              <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Desglose de Costos</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {formatearMoneda(resumen.costo_total_productos)}
                    </p>
                    <p className="text-sm text-gray-600">Costos de Productos</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">
                      {formatearMoneda(resumen.costo_total_adicionales)}
                    </p>
                    <p className="text-sm text-gray-600">Costos Adicionales</p>
                  </div>
                  <div className="p-4 bg-red-100 rounded-lg">
                    <p className="text-2xl font-bold text-red-700">
                      {formatearMoneda(resumen.costo_total_general)}
                    </p>
                    <p className="text-sm text-gray-600">Costo Total General</p>
                  </div>
                </div>
              </div>

              {/* Resumen de Precios y Ganancia */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-3xl font-bold text-blue-600">
                    {formatearMoneda(resumen.precio_venta_total_sugerido)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Precio Total Sugerido</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-3xl font-bold text-purple-600">
                    {formatearMoneda(resumen.precio_venta_total_cliente)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Ingresos Totales Cliente</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-3xl font-bold text-green-600">
                    {formatearMoneda(resumen.ganancia_total_real)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Ganancia Total</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-3xl font-bold text-orange-600">
                    {formatearPorcentaje(resumen.rentabilidad_total_negocio)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Rentabilidad Total</p>
                </div>
              </div>

              {/* Información adicional del resumen */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-lg font-semibold text-gray-900">
                    Margen Promedio: {formatearPorcentaje(resumen.margen_ganancia_promedio)}
                  </p>
                  <p className="text-sm text-gray-600">Sobre el costo total</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-lg font-semibold text-gray-900">
                    ROI Estimado: {formatearPorcentaje(resumen.roi_estimado)}
                  </p>
                  <p className="text-sm text-gray-600">Retorno de inversión</p>
                </div>
              </div>
            </div>
          )}

          {/* Tabla de Productos */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
                Análisis de Productos
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900">Producto</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Costo Total</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Precio Sugerido IA</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Precio Cliente</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Ganancia</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Rentabilidad</th>
                    <th className="text-center py-4 px-6 font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <Package className="w-16 h-16 text-gray-300" />
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">No hay productos configurados</h4>
                            <p className="text-gray-500">Para ver el análisis de precios, primero debes agregar productos en la sección "Costos Variables"</p>
                          </div>
                          <button
                            onClick={() => navigate('/variable-costs')}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                          >
                            Ir a Costos Variables
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    productos.map((producto) => (
                      <tr key={producto.producto_id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-6 px-6">
                          <div className="font-medium text-gray-900">{producto.nombre_producto}</div>
                        </td>
                        
                        <td className="py-6 px-6 text-center">
                          <span className="text-red-600 font-semibold">
                            {formatearMoneda(producto.costo_total_producto)}
                          </span>
                        </td>
                        
                        <td className="py-6 px-6 text-center">
                          <div className="text-blue-600 font-semibold">
                            {formatearMoneda(producto.precio_venta_sugerido_ia)}
                          </div>
                          <div className="text-xs text-gray-500">
                            Margen {formatearPorcentaje(producto.margen_ganancia_ia)}
                          </div>
                        </td>
                        
                        <td className="py-6 px-6 text-center">
                          {editingProduct === producto.producto_id ? (
                            <div className="flex items-center justify-center space-x-2">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={editingPrice}
                                onChange={(e) => setEditingPrice(e.target.value)}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                              <button
                                onClick={() => guardarPrecio(producto.producto_id)}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Guardar"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelarEdicion}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                title="Cancelar"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-green-600 font-semibold">
                              {formatearMoneda(producto.precio_venta_cliente)}
                            </div>
                          )}
                        </td>
                        
                        <td className="py-6 px-6 text-center">
                          <span className={`font-semibold ${producto.ganancia_por_unidad >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatearMoneda(producto.ganancia_por_unidad)}
                          </span>
                        </td>
                        
                        <td className="py-6 px-6 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {obtenerIconoRentabilidad(producto.rentabilidad_producto)}
                            <span className={`font-semibold ${obtenerColorRentabilidad(producto.rentabilidad_producto)}`}>
                              {formatearPorcentaje(producto.rentabilidad_producto)}
                            </span>
                          </div>
                        </td>
                        
                        <td className="py-6 px-6 text-center">
                          {editingProduct !== producto.producto_id && (
                            <button
                              onClick={() => iniciarEdicion(producto)}
                              className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar precio"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-blue-600" />
              Información sobre el Análisis
            </h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• <strong>Costo Total:</strong> Incluye costos variables del producto y costos adicionales del negocio</p>
              <p>• <strong>Precio Sugerido IA:</strong> Basado en un margen estándar del 20% sobre el costo total</p>
              <p>• <strong>Precio Cliente:</strong> Puedes ajustar este precio según tu estrategia de mercado</p>
              <p>• <strong>Rentabilidad:</strong> Verde (≥30%), Amarillo (20-29%), Rojo (&lt;20%)</p>
            </div>
          </div>

          {/* Botones de navegación */}
          <div className="flex justify-between items-center pt-6">
            <button
              type="button"
              onClick={() => navigate('/variable-costs')}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Paso Anterior</span>
            </button>
            
            <button
              onClick={() => navigate('/profitability-analysis')}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <span>Guardar y Analizar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
