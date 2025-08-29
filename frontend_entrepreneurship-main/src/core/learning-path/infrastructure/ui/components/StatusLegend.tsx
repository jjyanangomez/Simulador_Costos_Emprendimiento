// Fichero: src/core/learning-path/ui/components/StatusLegend.tsx
import React from 'react';

/**
 * Componente para la leyenda de estados en la parte inferior.
 */
export const StatusLegend: React.FC = () => {
  return (
    <div className="flex items-center justify-center  gap-8 space-x-6 mt-12">
      <div className="flex items-center  gap-2">
        <div className="w-4 h-4  bg-green-500 rounded shadow-sm mr-2"></div>
        <span className="text-slate-600 font-semibold text-black">Completado</span>
      </div>
      <div className="flex items-center  gap-2">
        <div className="w-4 h-4  bg-blue-500 rounded shadow-sm mr-2"></div>
        <span className="text-slate-600 font-semibold text-black">En progreso</span>
      </div>
      <div className="flex items-center  gap-2">
        <div className="w-4 h-4 bg-gray-400 rounded shadow-sm mr-2"></div>
        <span className="text-slate-600 font-semibold text-black " >Bloqueado</span>
      </div>
    </div>
  );
};