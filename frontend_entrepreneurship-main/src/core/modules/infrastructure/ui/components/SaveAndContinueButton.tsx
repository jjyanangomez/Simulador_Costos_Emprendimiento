import React from 'react';
import { useCompleteAnalysis } from '../../hooks/useCompleteAnalysis';
import { type SaveCompleteAnalysisRequest } from '../../adapters/CompleteAnalysisRepositoryApi';

interface SaveAndContinueButtonProps {
  negocioId: number;
  moduloId: number;
  analisisId: number;
  costosAnalizados: any[];
  riesgosDetectados: any[];
  planAccion: any[];
  resumenAnalisis?: any;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export const SaveAndContinueButton: React.FC<SaveAndContinueButtonProps> = ({
  negocioId,
  moduloId,
  analisisId,
  costosAnalizados,
  riesgosDetectados,
  planAccion,
  resumenAnalisis,
  onSuccess,
  onError,
  className = ''
}) => {
  const { loading, error, saveCompleteAnalysis, clearError } = useCompleteAnalysis();

  const handleSaveAndContinue = async () => {
    console.log('💾 [SAVE-BUTTON] Iniciando guardado y continuación');
    
    // Limpiar errores previos
    clearError();

    // Preparar los datos para guardar
    const saveData: SaveCompleteAnalysisRequest = {
      negocioId,
      moduloId,
      analisisId,
      costosAnalizados,
      riesgosDetectados,
      planAccion,
      resumenAnalisis
    };

    console.log('📊 [SAVE-BUTTON] Datos a guardar:', {
      negocioId,
      moduloId,
      analisisId,
      costosCount: costosAnalizados.length,
      riesgosCount: riesgosDetectados.length,
      planCount: planAccion.length
    });

    try {
      const result = await saveCompleteAnalysis(saveData);
      
      if (result) {
        console.log('✅ [SAVE-BUTTON] Guardado exitoso, ejecutando callback de éxito');
        onSuccess?.();
      } else {
        console.error('❌ [SAVE-BUTTON] Error en el guardado');
        onError?.('No se pudo guardar el análisis. Por favor, intente nuevamente.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      console.error('❌ [SAVE-BUTTON] Error durante el guardado:', errorMessage);
      onError?.(errorMessage);
    }
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* Mensaje de impacto esperado */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full max-w-md">
        <div className="flex items-start gap-3">
          <div className="text-yellow-500 text-xl">💡</div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-1">Impacto esperado:</h4>
            <p className="text-blue-700 text-sm">
              Ahorro potencial de $5-$10 mensuales en costos de seguro.
            </p>
          </div>
        </div>
      </div>

      {/* Botón de Guardar y Continuar */}
      <button
        onClick={handleSaveAndContinue}
        disabled={loading}
        className={`
          bg-green-500 hover:bg-green-600 disabled:bg-green-300
          text-white font-bold py-3 px-6 rounded-lg
          transition-all duration-200 transform hover:scale-105
          disabled:transform-none disabled:cursor-not-allowed
          flex items-center gap-2 shadow-lg
          ${loading ? 'animate-pulse' : ''}
        `}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Guardando...</span>
          </>
        ) : (
          <>
            <span>→</span>
            <span>Guardar y Continuar</span>
          </>
        )}
      </button>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 w-full max-w-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Información de estado */}
      {loading && (
        <div className="text-gray-600 text-sm">
          Guardando análisis completo en la base de datos...
        </div>
      )}
    </div>
  );
};
