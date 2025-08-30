import React, { useState } from 'react';
import { ProductoPrecioVenta, ProductoPrecioVentaService } from '../../services/producto-precio-venta.service';
import { CheckCircle, AlertTriangle, DollarSign, Edit3, Save, X } from 'lucide-react';

interface TablaPreciosVentaProps {
  productos: ProductoPrecioVenta[];
  negocioId: number;
  onPrecioActualizado: (producto: ProductoPrecioVenta) => void;
}

export function TablaPreciosVenta({ productos, negocioId, onPrecioActualizado }: TablaPreciosVentaProps) {
  const [editandoProductoId, setEditandoProductoId] = useState<number | null>(null);
  const [precioEditado, setPrecioEditado] = useState<number>(0);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEditarPrecio = (producto: ProductoPrecioVenta) => {
    setEditandoProductoId(producto.producto_id);
    setPrecioEditado(producto.precio_venta_cliente);
    setError(null);
  };

  const handleCancelarEdicion = () => {
    setEditandoProductoId(null);
    setPrecioEditado(0);
    setError(null);
  };

  const handleGuardarPrecio = async (producto: ProductoPrecioVenta) => {
    if (precioEditado <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }

    if (precioEditado < producto.costo_total_producto) {
      setError('El precio de venta no puede ser menor al costo total');
      return;
    }

    setGuardando(true);
    setError(null);

    try {
      const productoActualizado = await ProductoPrecioVentaService.actualizarPrecioVentaCliente({
        producto_id: producto.producto_id,
        precio_venta_cliente: precioEditado,
        negocioId,
      });

      onPrecioActualizado(productoActualizado);
      setEditandoProductoId(null);
      setPrecioEditado(0);
    } catch (error) {
      setError('Error al actualizar el precio. Inténtalo de nuevo.');
      console.error('Error al actualizar precio:', error);
    } finally {
      setGuardando(false);
    }
  };

  const getMargenColor = (margen: number) => {
    if (margen >= 30) return 'text-green-600';
    if (margen >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMargenIcon = (margen: number) => {
    if (margen >= 30) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (margen >= 15) return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-primary-600" />
          Lista de Productos con Precios y Ganancias
        </h3>
      </div>

      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Producto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Costo Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Sugerido IA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ganancia/Unidad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Margen
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productos.map((producto) => (
              <tr key={producto.producto_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {producto.nombre_producto}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(producto.costo_total_producto)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-blue-600 font-medium">
                    {formatCurrency(producto.precio_venta_sugerido_ia)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editandoProductoId === producto.producto_id ? (
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={precioEditado}
                      onChange={(e) => setPrecioEditado(Number(e.target.value))}
                      className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-900 font-medium">
                      {formatCurrency(producto.precio_venta_cliente)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    producto.ganancia_por_unidad >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(producto.ganancia_por_unidad)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {getMargenIcon(producto.margen_ganancia_real)}
                    <span className={`text-sm font-medium ${getMargenColor(producto.margen_ganancia_real)}`}>
                      {formatPercentage(producto.margen_ganancia_real)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editandoProductoId === producto.producto_id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleGuardarPrecio(producto)}
                        disabled={guardando}
                        className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        {guardando ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1" />
                        ) : (
                          <Save className="w-3 h-3 mr-1" />
                        )}
                        Guardar
                      </button>
                      <button
                        onClick={handleCancelarEdicion}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditarPrecio(producto)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productos.length === 0 && (
        <div className="px-6 py-8 text-center">
          <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay productos</h3>
          <p className="mt-1 text-sm text-gray-500">
            Agrega productos en la sección de costos variables para ver sus precios de venta.
          </p>
        </div>
      )}
    </div>
  );
}
