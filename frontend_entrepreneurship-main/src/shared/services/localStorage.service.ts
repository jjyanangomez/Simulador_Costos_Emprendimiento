// Servicio para manejar el almacenamiento local de costos fijos
export interface CostoFijo {
  name: string;
  description?: string;
  amount: number;
  frequency: 'mensual' | 'semestral' | 'anual';
  category: string;
}

export interface CostosFijosData {
  costos: CostoFijo[];
  totalMonthly: number;
  totalYearly: number;
  costBreakdown: {
    mensual: number;
    semestral: number;
    anual: number;
  };
  fechaGuardado: string;
  negocioId?: string;
}

export class LocalStorageService {
  private static readonly COSTOS_FIJOS_KEY = 'costos_fijos_data';
  private static readonly NEGOCIO_ACTUAL_KEY = 'negocio_actual_id';

  // Guardar costos fijos en localStorage
  static guardarCostosFijos(data: CostosFijosData): void {
    try {
      localStorage.setItem(this.COSTOS_FIJOS_KEY, JSON.stringify(data));
      console.log('Costos fijos guardados en localStorage:', data);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      throw new Error('No se pudieron guardar los costos fijos');
    }
  }

  // Obtener costos fijos del localStorage
  static obtenerCostosFijos(): CostosFijosData | null {
    try {
      const data = localStorage.getItem(this.COSTOS_FIJOS_KEY);
      if (!data) return null;
      
      const parsedData = JSON.parse(data) as CostosFijosData;
      console.log('Costos fijos recuperados del localStorage:', parsedData);
      return parsedData;
    } catch (error) {
      console.error('Error al recuperar del localStorage:', error);
      return null;
    }
  }

  // Verificar si existen costos fijos guardados
  static existenCostosFijos(): boolean {
    const data = this.obtenerCostosFijos();
    return data !== null && data.costos.length > 0;
  }

  // Obtener solo los costos (sin totales)
  static obtenerCostos(): CostoFijo[] {
    const data = this.obtenerCostosFijos();
    return data?.costos || [];
  }

  // Obtener totales calculados
  static obtenerTotales(): {
    totalMonthly: number;
    totalYearly: number;
    costBreakdown: { mensual: number; semestral: number; anual: number };
  } | null {
    const data = this.obtenerCostosFijos();
    if (!data) return null;
    
    return {
      totalMonthly: data.totalMonthly,
      totalYearly: data.totalYearly,
      costBreakdown: data.costBreakdown
    };
  }

  // Obtener fecha de guardado
  static obtenerFechaGuardado(): string | null {
    const data = this.obtenerCostosFijos();
    return data?.fechaGuardado || null;
  }

  // Limpiar costos fijos del localStorage
  static limpiarCostosFijos(): void {
    try {
      localStorage.removeItem(this.COSTOS_FIJOS_KEY);
      console.log('Costos fijos eliminados del localStorage');
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  }

  // Guardar ID del negocio actual
  static guardarNegocioActual(negocioId: string): void {
    try {
      localStorage.setItem(this.NEGOCIO_ACTUAL_KEY, negocioId);
      console.log('Negocio actual guardado:', negocioId);
    } catch (error) {
      console.error('Error al guardar negocio actual:', error);
    }
  }

  // Obtener ID del negocio actual
  static obtenerNegocioActual(): string | null {
    try {
      return localStorage.getItem(this.NEGOCIO_ACTUAL_KEY);
    } catch (error) {
      console.error('Error al obtener negocio actual:', error);
      return null;
    }
  }

  // Verificar si los datos están actualizados (menos de 24 horas)
  static datosEstanActualizados(): boolean {
    const data = this.obtenerCostosFijos();
    if (!data || !data.fechaGuardado) return false;
    
    const fechaGuardado = new Date(data.fechaGuardado);
    const ahora = new Date();
    const diferenciaHoras = (ahora.getTime() - fechaGuardado.getTime()) / (1000 * 60 * 60);
    
    return diferenciaHoras < 24; // Datos válidos por 24 horas
  }

  // Obtener estadísticas de uso
  static obtenerEstadisticas(): {
    totalCostos: number;
    frecuenciasUtilizadas: string[];
    categoriaMasUsada: string | null;
    montoPromedio: number;
  } {
    const costos = this.obtenerCostos();
    
    if (costos.length === 0) {
      return {
        totalCostos: 0,
        frecuenciasUtilizadas: [],
        categoriaMasUsada: null,
        montoPromedio: 0
      };
    }

    // Frecuencias utilizadas
    const frecuencias = [...new Set(costos.map(c => c.frequency))];
    
    // Categoría más usada
    const categoriasCount = costos.reduce((acc, costo) => {
      acc[costo.category] = (acc[costo.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const categoriaMasUsada = Object.entries(categoriasCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || null;
    
    // Monto promedio
    const montoPromedio = costos.reduce((sum, costo) => sum + costo.amount, 0) / costos.length;

    return {
      totalCostos: costos.length,
      frecuenciasUtilizadas: frecuencias,
      categoriaMasUsada,
      montoPromedio: Math.round(montoPromedio * 100) / 100
    };
  }

  // Exportar datos como JSON
  static exportarDatos(): string {
    const data = this.obtenerCostosFijos();
    if (!data) return '';
    
    return JSON.stringify(data, null, 2);
  }

  // Importar datos desde JSON
  static importarDatos(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as CostosFijosData;
      
      // Validar estructura básica
      if (!data.costos || !Array.isArray(data.costos)) {
        throw new Error('Formato de datos inválido');
      }
      
      // Actualizar fecha de guardado
      data.fechaGuardado = new Date().toISOString();
      
      this.guardarCostosFijos(data);
      return true;
    } catch (error) {
      console.error('Error al importar datos:', error);
      return false;
    }
  }
}
