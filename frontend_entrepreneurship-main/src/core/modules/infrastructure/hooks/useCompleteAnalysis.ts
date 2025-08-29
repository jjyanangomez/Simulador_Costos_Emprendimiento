import { useState, useCallback } from 'react';
import { CompleteAnalysisRepositoryApi, type CompleteAnalysisResult, type SaveCompleteAnalysisRequest } from '../adapters/CompleteAnalysisRepositoryApi';
import { SaveCompleteAnalysisResults } from '../../application/useCase/SaveCompleteAnalysisResults';
import { GetCompleteAnalysisResults } from '../../application/useCase/GetCompleteAnalysisResults';

export const useCompleteAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveCompleteAnalysis = useCallback(async (data: SaveCompleteAnalysisRequest): Promise<CompleteAnalysisResult | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('💾 [FRONTEND-HOOK] Iniciando guardado de análisis completo');
      
      const repository = new CompleteAnalysisRepositoryApi();
      const saveUseCase = new SaveCompleteAnalysisResults(repository);
      
      const result = await saveUseCase.execute(data);
      
      console.log('✅ [FRONTEND-HOOK] Análisis guardado exitosamente:', result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al guardar el análisis';
      console.error('❌ [FRONTEND-HOOK] Error al guardar análisis:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCompleteAnalysis = useCallback(async (negocioId: number, moduloId: number): Promise<CompleteAnalysisResult | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 [FRONTEND-HOOK] Obteniendo análisis para negocio ${negocioId} y módulo ${moduloId}`);
      
      const repository = new CompleteAnalysisRepositoryApi();
      const getUseCase = new GetCompleteAnalysisResults(repository);
      
      const result = await getUseCase.execute(negocioId, moduloId);
      
      if (result) {
        console.log('✅ [FRONTEND-HOOK] Análisis obtenido exitosamente:', result);
      } else {
        console.log('❌ [FRONTEND-HOOK] No se encontraron resultados');
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener el análisis';
      console.error('❌ [FRONTEND-HOOK] Error al obtener análisis:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    saveCompleteAnalysis,
    getCompleteAnalysis,
    clearError,
  };
};
