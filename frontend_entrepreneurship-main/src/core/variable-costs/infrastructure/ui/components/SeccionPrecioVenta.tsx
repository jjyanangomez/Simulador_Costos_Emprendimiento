import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  Edit3, 
  Save, 
  X,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { apiService } from '../../../../../shared/infrastructure/services/api.service';
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

interface SeccionPrecioVentaProps {
  negocioId: number;
}

export function SeccionPrecioVenta({ negocioId }: SeccionPrecioVentaProps) {
  const [productos, setProductos] = useState<ProductoPrecioVenta[]>([]);
  const [resumen, setResumen] = useState<ResumenCostosGanancias | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>('');

  useEffect(() => {
    cargarDatos();
  }, [negocioId]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar análisis completo
              const response = await apiService.get(`/productos-precio-venta/${negocioId}/analisis-completo`);
      
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
        `/productos-precio-venta/${negocioId}/producto/${productoId}`,
        { precio_venta_cliente: nuevoPrecio }
      );

      if (response.data) {
        // Actualizar el producto en el estado local
        setProductos(prev => prev.map(p => 
          p.producto_id === productoId 
            ? response.data 
            : p
        ));
        
        // Recargar el resumen
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Cargando análisis de precios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
          Precio de Venta y Análisis de Rentabilidad
        </h2>
        <button
          onClick={cargarDatos}
          className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Actualizar
        </button>
      </div>

      {/* Resumen General */}
      {resumen && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Resumen General del Negocio
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {formatearMoneda(resumen.costo_total_general)}
              </p>
              <p className="text-sm text-gray-600">Costo Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {formatearMoneda(resumen.precio_venta_total_cliente)}
              </p>
              <p className="text-sm text-gray-600">Ingresos Totales</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {formatearMoneda(resumen.ganancia_total_real)}
              </p>
              <p className="text-sm text-gray-600">Ganancia Total</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {formatearPorcentaje(resumen.rentabilidad_total_negocio)}
              </p>
              <p className="text-sm text-gray-600">Rentabilidad</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Productos */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Producto</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Costo Total</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Precio Sugerido IA</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Precio Cliente</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Ganancia</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Rentabilidad</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.producto_id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="font-medium text-gray-900">{producto.nombre_producto}</div>
                </td>
                
                <td className="py-4 px-4 text-center">
                  <span className="text-red-600 font-semibold">
                    {formatearMoneda(producto.costo_total_producto)}
                  </span>
                </td>
                
                <td className="py-4 px-4 text-center">
                  <div className="text-blue-600 font-semibold">
                    {formatearMoneda(producto.precio_venta_sugerido_ia)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Margen {formatearPorcentaje(producto.margen_ganancia_ia)}
                  </div>
                </td>
                
                <td className="py-4 px-4 text-center">
                  {editingProduct === producto.producto_id ? (
                    <div className="flex items-center justify-center space-x-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingPrice}
                        onChange={(e) => setEditingPrice(e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => guardarPrecio(producto.producto_id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelarEdicion}
                        className="p-1 text-gray-600 hover:bg-gray-50 rounded"
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
                
                <td className="py-4 px-4 text-center">
                  <span className={`font-semibold ${producto.ganancia_por_unidad >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatearMoneda(producto.ganancia_por_unidad)}
                  </span>
                </td>
                
                <td className="py-4 px-4 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    {obtenerIconoRentabilidad(producto.rentabilidad_producto)}
                    <span className={`font-semibold ${obtenerColorRentabilidad(producto.rentabilidad_producto)}`}>
                      {formatearPorcentaje(producto.rentabilidad_producto)}
                    </span>
                  </div>
                </td>
                
                <td className="py-4 px-4 text-center">
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Info className="w-4 h-4 mr-2 text-blue-600" />
          Información sobre el Análisis
        </h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• <strong>Costo Total:</strong> Incluye costos variables del producto y costos adicionales del negocio</p>
          <p>• <strong>Precio Sugerido IA:</strong> Basado en un margen estándar del 20% sobre el costo total</p>
          <p>• <strong>Precio Cliente:</strong> Puedes ajustar este precio según tu estrategia de mercado</p>
          <p>• <strong>Rentabilidad:</strong> Verde (≥30%), Amarillo (20-29%), Rojo (&lt;20%)</p>
        </div>
      </div>
    </div>
  );
}
