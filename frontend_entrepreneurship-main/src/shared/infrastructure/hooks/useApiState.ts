import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiStateReturn<T> extends ApiState<T> {
  setData: (data: T) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  execute: (asyncFunction: () => Promise<T>) => Promise<T | null>;
}

export function useApiState<T>(initialData: T | null = null): UseApiStateReturn<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const setData = useCallback((data: T) => {
    setState(prev => ({ ...prev, data, error: null }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
    });
  }, [initialData]);

  const execute = useCallback(async (asyncFunction: () => Promise<T>): Promise<T | null> => {
    try {
      console.log('🔄 [FRONTEND-HOOK] Iniciando ejecución de función async');
      setLoading(true);
      setError(null);
      
      const result = await asyncFunction();
      console.log('✅ [FRONTEND-HOOK] Función ejecutada exitosamente:', result);
      
      setData(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('💥 [FRONTEND-HOOK] Error en ejecución:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      console.log('🏁 [FRONTEND-HOOK] Finalizando ejecución, estableciendo loading en false');
      setLoading(false);
    }
  }, [setData, setError, setLoading]);

  return {
    ...state,
    setData,
    setLoading,
    setError,
    reset,
    execute,
  };
}
