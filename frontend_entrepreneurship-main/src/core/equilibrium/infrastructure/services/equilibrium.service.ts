import { apiService } from '../../../../shared/infrastructure/services/api.service';
import { Recipe, EquilibriumCalculation } from '../../domain/models/Recipe';

export class EquilibriumService {
  async getRecipes(): Promise<Recipe[]> {
    try {
      const response = await apiService.get('/recetas/all');
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener recetas:', error);
      throw new Error('No se pudieron obtener las recetas');
    }
  }

  async getFixedCosts(): Promise<number> {
    try {
      // Por ahora usamos un negocioId hardcodeado, en el futuro esto debería venir del contexto del usuario
      const negocioId = 1; // TODO: Obtener del contexto del usuario
      const response = await apiService.get(`/costos-fijos/total?negocioId=${negocioId}`);
      return response.data?.total || 0;
    } catch (error) {
      console.error('Error al obtener costos fijos:', error);
      return 0;
    }
  }

  async getVariableCosts(): Promise<number> {
    try {
      // Por ahora usamos un negocioId hardcodeado, en el futuro esto debería venir del contexto del usuario
      const negocioId = 1; // TODO: Obtener del contexto del usuario
      const response = await apiService.get(`/costos-variables/total?negocioId=${negocioId}`);
      return response.data?.total || 0;
    } catch (error) {
      console.error('Error al obtener costos variables:', error);
      return 0;
    }
  }

  calculateEquilibrium(
    recetas: Recipe[],
    costosFijos: number,
    gananciaObjetivo: number = 0
  ): EquilibriumCalculation {
    const costosFijosTotales = costosFijos;
    const costosVariablesTotales = recetas.reduce((total, receta) => {
      return total + (receta.costos_adicionales || 0);
    }, 0);

    // Calcular el punto de equilibrio total
    const costosTotales = costosFijosTotales + costosVariablesTotales;
    const ingresosNecesarios = costosTotales + gananciaObjetivo;

    // Distribuir las ventas necesarias entre las recetas
    const recetasEquilibrio = recetas.map(receta => {
      const precioVenta = receta.precio_venta;
      const costoVariable = receta.costos_adicionales || 0;
      const margenContribucion = precioVenta - costoVariable;
      
      // Calcular cantidad de ventas necesarias para contribuir al equilibrio
      const cantidadVentas = Math.ceil(ingresosNecesarios / recetas.length / margenContribucion);
      const ingresosTotales = cantidadVentas * precioVenta;
      const costosTotales = cantidadVentas * costoVariable;
      const ganancia = ingresosTotales - costosTotales;
      const porcentajeContribucion = (ganancia / ingresosNecesarios) * 100;

      return {
        receta,
        cantidad_ventas: cantidadVentas,
        ingresos_totales: ingresosTotales,
        costos_totales: costosTotales,
        ganancia,
        porcentaje_contribucion: porcentajeContribucion
      };
    });

    // Calcular recomendaciones
    const recomendaciones = this.generateRecommendations(recetasEquilibrio, costosFijosTotales);

    return {
      costos_fijos_totales: costosFijosTotales,
      costos_variables_totales: costosVariablesTotales,
      recetas_equilibrio: recetasEquilibrio,
      punto_equilibrio_total: costosTotales,
      ganancia_objetivo: gananciaObjetivo,
      recomendaciones
    };
  }

  private generateRecommendations(
    recetasEquilibrio: any[],
    costosFijos: number
  ): string[] {
    const recomendaciones: string[] = [];

    // Analizar la distribución de ventas
    const totalVentas = recetasEquilibrio.reduce((sum, item) => sum + item.cantidad_ventas, 0);
    
    if (totalVentas > 1000) {
      recomendaciones.push('Considera optimizar procesos para reducir costos variables');
    }

    if (costosFijos > 50000) {
      recomendaciones.push('Evalúa la posibilidad de reducir costos fijos para mejorar la rentabilidad');
    }

    // Recomendaciones específicas por receta
    recetasEquilibrio.forEach(item => {
      if (item.cantidad_ventas > 500) {
        recomendaciones.push(`La receta "${item.receta.nombre_receta}" requiere muchas ventas. Considera aumentar el precio o reducir costos.`);
      }
    });

    if (recomendaciones.length === 0) {
      recomendaciones.push('Tu modelo de negocio está bien balanceado. Mantén la estrategia actual.');
    }

    return recomendaciones;
  }
}

export const equilibriumService = new EquilibriumService();
