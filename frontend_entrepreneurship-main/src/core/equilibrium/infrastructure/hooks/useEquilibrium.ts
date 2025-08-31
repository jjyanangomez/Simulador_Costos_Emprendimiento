import { useState, useEffect, useCallback } from 'react';
import { Recipe, EquilibriumCalculation } from '../../domain/models/Recipe';
import { equilibriumService } from '../services/equilibrium.service';

export function useEquilibrium() {
  const [recetas, setRecetas] = useState<Recipe[]>([]);
  const [costosFijos, setCostosFijos] = useState<number>(0);
  const [costosVariables, setCostosVariables] = useState<number>(0);
  const [gananciaObjetivo, setGananciaObjetivo] = useState<number>(0);
  const [equilibriumData, setEquilibriumData] = useState<EquilibriumCalculation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [recetasData, costosFijosData, costosVariablesData] = await Promise.all([
        equilibriumService.getRecipes(),
        equilibriumService.getFixedCosts(),
        equilibriumService.getVariableCosts()
      ]);

      setRecetas(recetasData);
      setCostosFijos(costosFijosData);
      setCostosVariables(costosVariablesData);

      // Calcular equilibrio inicial
      const equilibrio = equilibriumService.calculateEquilibrium(
        recetasData,
        costosFijosData,
        gananciaObjetivo
      );
      setEquilibriumData(equilibrio);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, [gananciaObjetivo]);

  // Recalcular equilibrio cuando cambie la ganancia objetivo
  const updateGananciaObjetivo = useCallback((nuevaGanancia: number) => {
    setGananciaObjetivo(nuevaGanancia);
    
    if (recetas.length > 0) {
      const equilibrio = equilibriumService.calculateEquilibrium(
        recetas,
        costosFijos,
        nuevaGanancia
      );
      setEquilibriumData(equilibrio);
    }
  }, [recetas, costosFijos]);

  // Actualizar cantidad de ventas de una receta específica
  const updateRecetaVentas = useCallback((recetaId: number, cantidadVentas: number) => {
    if (!equilibriumData) return;

    const recetasActualizadas = equilibriumData.recetas_equilibrio.map(item => {
      if (item.receta.receta_id === recetaId) {
        const precioVenta = item.receta.precio_venta;
        const costoVariable = item.receta.costos_adicionales || 0;
        const ingresosTotales = cantidadVentas * precioVenta;
        const costosTotales = cantidadVentas * costoVariable;
        const ganancia = ingresosTotales - costosTotales;
        const porcentajeContribucion = (ganancia / (costosFijos + costosVariables + gananciaObjetivo)) * 100;

        return {
          ...item,
          cantidad_ventas: cantidadVentas,
          ingresos_totales: ingresosTotales,
          costos_totales: costosTotales,
          ganancia,
          porcentaje_contribucion: porcentajeContribucion
        };
      }
      return item;
    });

    // Recalcular totales
    const ingresosTotales = recetasActualizadas.reduce((sum, item) => sum + item.ingresos_totales, 0);
    const costosTotales = costosFijos + costosVariables;
    const gananciaTotal = ingresosTotales - costosTotales;

    setEquilibriumData({
      ...equilibriumData,
      recetas_equilibrio: recetasActualizadas,
      punto_equilibrio_total: costosTotales,
      ganancia_objetivo: gananciaObjetivo
    });
  }, [equilibriumData, costosFijos, costosVariables, gananciaObjetivo]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    // Estado
    recetas,
    costosFijos,
    costosVariables,
    gananciaObjetivo,
    equilibriumData,
    loading,
    error,
    
    // Acciones
    updateGananciaObjetivo,
    updateRecetaVentas,
    reloadData: loadData
  };
}
