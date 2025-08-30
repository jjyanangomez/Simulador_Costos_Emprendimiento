import React, { useState, useEffect } from 'react';
import { TablaPreciosVenta } from './TablaPreciosVenta';
import { ProductoPrecioVenta, ResumenPreciosVenta, ProductoPrecioVentaService } from '../../services/producto-precio-venta.service';
import { DollarSign, TrendingUp, TrendingDown, Calculator, RefreshCw } from 'lucide-react';

interface SeccionPrecioVentaProps {
  negocioId: number;
}

export function SeccionPrecioVenta({ negocioId }: SeccionPrecioVentaProps) {
  const [resumen, setResumen] = useState<ResumenPreciosVenta | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actualizando, setActualizando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    setError(null);

    try {
      const datos = await ProductoPrecioVentaService.obtenerProductosPreciosVenta(negocioId);
      setResumen(datos);
    } catch (error) {
      setError('Error al cargar los datos de precios de venta. Inténtalo de nuevo.');
      console.error('Error al cargar datos:', error);
    } finally {
      setCargando(false);
    }
  };

  const generarResumen = async () => {
    setActualizando(true);
    setError(null);

    try {
      await ProductoPrecioVentaService.generarResumenCostosGanancias(negocioId);
      await cargarDatos(); // Recargar datos después de generar resumen
    } catch (error) {
      setError('Error al generar el resumen. Inténtalo de nuevo.');
      console.error('Error al generar resumen:', error);
    } finally {
      setActualizando(false);
    }
  };

  const handlePrecioActualizado = (productoActualizado: ProductoPrecioVenta) => {
    if (resumen) {
      const productosActualizados = resumen.productos.map(p => 
        p.producto_id === productoActualizado.producto_id ? productoActualizado : p
      );

      // Recalcular totales
      const costoTotalProductos = productosActualizados.reduce((sum, p) => sum + p.costo_total_producto, 0);
      const precioVentaTotalCliente = productosActualizados.reduce((sum, p) => sum + p.precio_venta_cliente, 0);
      const gananciaTotalReal = productosActualizados.reduce((sum, p) => sum + p.ganancia_por_unidad, 0);
      const margenGananciaPromedio = productosActualizados.length > 0 
        ? productosActualizados.reduce((sum, p) => sum + p.margen_ganancia_real, 0) / productosActualizados.length 
        : 0;

      setResumen({
        ...resumen,
        productos: productosActualizados,
        costo_total_productos: costoTotalProductos,
        precio_venta_total_cliente: precioVentaTotalCliente,
        ganancia_total_real: gananciaTotalReal,
        margen_ganancia_promedio: margenGananciaPromedio,
      });
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [negocioId]);

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

  if (cargando) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-600">Cargando precios de venta...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-red-400 mb-4">
            <TrendingDown className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error al cargar datos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={cargarDatos}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!resumen || resumen.productos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <DollarSign className="h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos para analizar</h3>
          <p className="text-gray-600">
            Agrega productos en la sección de costos variables para ver sus precios de venta y análisis de rentabilidad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen de Costos Totales */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center flex items-center justify-center">
          <Calculator className="w-5 h-5 mr-2 text-blue-600" />
          Resumen de Costos Totales
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Costos por Productos</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(resumen.costo_total_productos)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Costos Adicionales</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(resumen.costo_total_adicionales)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Total General</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(resumen.costo_total_general)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de Productos */}
      <TablaPreciosVenta
        productos={resumen.productos}
        negocioId={negocioId}
        onPrecioActualizado={handlePrecioActualizado}
      />

      {/* Resumen General de Ganancias */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center flex items-center justify-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
          Resumen General de Ganancias
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Ganancia Total</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(resumen.ganancia_total_real)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Ingresos Totales</p>
            <p className="text-xl font-bold text-blue-600">
              {formatCurrency(resumen.precio_venta_total_cliente)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">Margen Promedio</p>
            <p className="text-xl font-bold text-purple-600">
              {formatPercentage(resumen.margen_ganancia_promedio)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-1">ROI Estimado</p>
            <p className="text-xl font-bold text-emerald-600">
              {formatPercentage((resumen.ganancia_total_real / resumen.costo_total_general) * 100)}
            </p>
          </div>
        </div>
      </div>

      {/* Botón para Generar Resumen */}
      <div className="flex justify-center">
        <button
          onClick={generarResumen}
          disabled={actualizando}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {actualizando ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generando Resumen...
            </>
          ) : (
            <>
              <Calculator className="w-5 h-5 mr-2" />
              Generar Resumen Completo
            </>
          )}
        </button>
      </div>
    </div>
  );
}
