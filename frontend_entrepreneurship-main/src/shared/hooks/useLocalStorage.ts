import { useState, useEffect, useCallback } from 'react';
import { LocalStorageService, type CostosFijosData, type CostoFijo } from '../services/localStorage.service';

export const useLocalStorage = () => {
  const [costosFijos, setCostosFijos] = useState<CostosFijosData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos del localStorage
  const cargarCostosFijos = useCallback(() => {
    setIsLoading(true);
    try {
      const data = LocalStorageService.obtenerCostosFijos();
      setCostosFijos(data);
    } catch (error) {
      console.error('Error al cargar costos fijos:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Guardar costos fijos
  const guardarCostosFijos = useCallback(async (data: CostosFijosData): Promise<boolean> => {
    try {
      LocalStorageService.guardarCostosFijos(data);
      setCostosFijos(data);
      return true;
    } catch (error) {
      console.error('Error al guardar costos fijos:', error);
      return false;
    }
  }, []);

  // Limpiar costos fijos
  const limpiarCostosFijos = useCallback(() => {
    try {
      LocalStorageService.limpiarCostosFijos();
      setCostosFijos(null);
    } catch (error) {
      console.error('Error al limpiar costos fijos:', error);
    }
  }, []);

  // Verificar si existen costos fijos
  const existenCostosFijos = useCallback(() => {
    return LocalStorageService.existenCostosFijos();
  }, []);

  // Obtener solo los costos
  const obtenerCostos = useCallback((): CostoFijo[] => {
    return LocalStorageService.obtenerCostos();
  }, []);

  // Obtener totales
  const obtenerTotales = useCallback(() => {
    return LocalStorageService.obtenerTotales();
  }, []);

  // Obtener estadísticas
  const obtenerEstadisticas = useCallback(() => {
    return LocalStorageService.obtenerEstadisticas();
  }, []);

  // Verificar si los datos están actualizados
  const datosEstanActualizados = useCallback(() => {
    return LocalStorageService.datosEstanActualizados();
  }, []);

  // Exportar datos
  const exportarDatos = useCallback((): string => {
    return LocalStorageService.exportarDatos();
  }, []);

  // Importar datos
  const importarDatos = useCallback((jsonData: string): boolean => {
    const success = LocalStorageService.importarDatos(jsonData);
    if (success) {
      cargarCostosFijos(); // Recargar datos después de importar
    }
    return success;
  }, [cargarCostosFijos]);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarCostosFijos();
  }, [cargarCostosFijos]);

  return {
    // Estado
    costosFijos,
    isLoading,
    
    // Métodos
    cargarCostosFijos,
    guardarCostosFijos,
    limpiarCostosFijos,
    existenCostosFijos,
    obtenerCostos,
    obtenerTotales,
    obtenerEstadisticas,
    datosEstanActualizados,
    exportarDatos,
    importarDatos,
    
    // Utilidades
    totalCostos: costosFijos?.costos.length || 0,
    totalMonthly: costosFijos?.totalMonthly || 0,
    totalYearly: costosFijos?.totalYearly || 0,
    fechaGuardado: costosFijos?.fechaGuardado || null,
    negocioId: costosFijos?.negocioId || null
  };
};
