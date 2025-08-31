import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Calculator, TrendingUp, Calendar, DollarSign } from 'lucide-react';

export const CostosFijosSummary: React.FC = () => {
  const {
    costosFijos,
    isLoading,
    totalCostos,
    totalMonthly,
    totalYearly,
    fechaGuardado,
    obtenerEstadisticas,
    limpiarCostosFijos
  } = useLocalStorage();

  const estadisticas = obtenerEstadisticas();

  if (isLoading) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!costosFijos || totalCostos === 0) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
        <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay costos fijos guardados
        </h3>
        <p className="text-gray-600 text-sm">
          Los costos fijos se mostrarán aquí una vez que los guardes
        </p>
      </div>
    );
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Calculator className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Resumen de Costos Fijos
          </h2>
        </div>
        <div className="text-xs text-gray-500">
          Guardado: {fechaGuardado ? formatearFecha(fechaGuardado) : 'N/A'}
        </div>
      </div>

      {/* Totales principales */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">
            ${totalMonthly.toFixed(2)}
          </div>
          <div className="text-sm text-blue-800">Total Mensual</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">
            ${totalYearly.toFixed(2)}
          </div>
          <div className="text-sm text-green-800">Total Anual</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">
            {totalCostos}
          </div>
          <div className="text-sm text-purple-800">Costos Registrados</div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Estadísticas</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Frecuencias utilizadas:</span>
            <span className="ml-2 font-medium text-gray-900">
              {estadisticas.frecuenciasUtilizadas.join(', ') || 'Ninguna'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Categoría más usada:</span>
            <span className="ml-2 font-medium text-gray-900">
              {estadisticas.categoriaMasUsada || 'Ninguna'}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Monto promedio:</span>
            <span className="ml-2 font-medium text-gray-900">
              ${estadisticas.montoPromedio.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={limpiarCostosFijos}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
        >
          Limpiar Datos
        </button>
      </div>
    </div>
  );
};
