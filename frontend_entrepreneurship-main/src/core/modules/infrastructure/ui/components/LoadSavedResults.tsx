import React, { useEffect, useState } from 'react';
import { useCompleteAnalysis } from '../../hooks/useCompleteAnalysis';
import { type CompleteAnalysisResult } from '../../adapters/CompleteAnalysisRepositoryApi';

interface LoadSavedResultsProps {
  negocioId: number;
  moduloId: number;
  onResultsLoaded?: (results: CompleteAnalysisResult) => void;
  onNoResults?: () => void;
  className?: string;
}

export const LoadSavedResults: React.FC<LoadSavedResultsProps> = ({
  negocioId,
  moduloId,
  onResultsLoaded,
  onNoResults,
  className = ''
}) => {
  const { loading, error, getCompleteAnalysis } = useCompleteAnalysis();
  const [results, setResults] = useState<CompleteAnalysisResult | null>(null);

  useEffect(() => {
    const loadResults = async () => {
      console.log(`🔍 [LOAD-RESULTS] Cargando resultados para negocio ${negocioId} y módulo ${moduloId}`);
      
      const savedResults = await getCompleteAnalysis(negocioId, moduloId);
      
      if (savedResults) {
        console.log('✅ [LOAD-RESULTS] Resultados cargados exitosamente:', savedResults);
        setResults(savedResults);
        onResultsLoaded?.(savedResults);
      } else {
        console.log('❌ [LOAD-RESULTS] No se encontraron resultados guardados');
        onNoResults?.();
      }
    };

    loadResults();
  }, [negocioId, moduloId, getCompleteAnalysis, onResultsLoaded, onNoResults]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Cargando resultados guardados...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <h3 className="text-red-800 font-semibold mb-2">Error al cargar resultados</h3>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (!results) {
    return (
      <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 ${className}`}>
        <h3 className="text-yellow-800 font-semibold mb-2">No hay resultados guardados</h3>
        <p className="text-yellow-700 text-sm">
          No se encontraron resultados de análisis guardados para este negocio y módulo.
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-green-800 font-semibold mb-2">✅ Resultados Cargados</h3>
      <div className="space-y-2 text-sm">
        <p className="text-green-700">
          <strong>Fecha de análisis:</strong> {new Date(results.fechaAnalisis).toLocaleDateString()}
        </p>
        <p className="text-green-700">
          <strong>Costos analizados:</strong> {results.costosAnalizados.length} elementos
        </p>
        <p className="text-green-700">
          <strong>Riesgos detectados:</strong> {results.riesgosDetectados.length} elementos
        </p>
        <p className="text-green-700">
          <strong>Plan de acción:</strong> {results.planAccion.length} elementos
        </p>
        <p className="text-green-700">
          <strong>Estado:</strong> {results.estadoGuardado}
        </p>
      </div>
      
      {/* Mostrar algunos datos de ejemplo */}
      <div className="mt-4 space-y-3">
        {results.costosAnalizados.length > 0 && (
          <div>
            <h4 className="font-medium text-green-800 mb-1">Costos Analizados:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              {results.costosAnalizados.slice(0, 3).map((costo, index) => (
                <li key={index}>• {costo.nombre_costo || 'Costo sin nombre'}</li>
              ))}
              {results.costosAnalizados.length > 3 && (
                <li className="text-green-600">... y {results.costosAnalizados.length - 3} más</li>
              )}
            </ul>
          </div>
        )}

        {results.riesgosDetectados.length > 0 && (
          <div>
            <h4 className="font-medium text-green-800 mb-1">Riesgos Detectados:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              {results.riesgosDetectados.slice(0, 2).map((riesgo, index) => (
                <li key={index}>• {riesgo.riesgo || 'Riesgo sin descripción'}</li>
              ))}
              {results.riesgosDetectados.length > 2 && (
                <li className="text-green-600">... y {results.riesgosDetectados.length - 2} más</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
