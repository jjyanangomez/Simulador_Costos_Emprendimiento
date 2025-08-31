/**
 * Servicio para manejar el almacenamiento local de costos fijos del negocio
 * Proporciona funcionalidades para guardar, cargar y gestionar datos persistentes
 * con validación de negocio y expiración automática
 */
export class LocalStorageService {
  private static readonly STORAGE_KEYS = {
    FIXED_COSTS: 'simulador_emprendimiento_fixed_costs',
    FIXED_COSTS_TIMESTAMP: 'simulador_emprendimiento_fixed_costs_timestamp',
    FIXED_COSTS_BUSINESS_ID: 'simulador_emprendimiento_fixed_costs_business_id'
  } as const;

  /**
   * Guarda los costos fijos en localStorage con timestamp y validación de negocio
   * @param costs - Array de costos fijos a guardar
   * @param businessId - Identificador único del negocio
   */
  static saveFixedCosts(costs: any[], businessId: string): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.FIXED_COSTS, JSON.stringify(costs));
      localStorage.setItem(this.STORAGE_KEYS.FIXED_COSTS_TIMESTAMP, Date.now().toString());
      localStorage.setItem(this.STORAGE_KEYS.FIXED_COSTS_BUSINESS_ID, businessId);
    } catch (error) {
      console.error('Error al guardar costos fijos en localStorage:', error);
    }
  }

  /**
   * Carga los costos fijos desde localStorage con validaciones de negocio y expiración
   * @param businessId - Identificador único del negocio
   * @returns Array de costos fijos o null si no hay datos válidos
   */
  static loadFixedCosts(businessId: string): any[] | null {
    try {
      const storedCosts = localStorage.getItem(this.STORAGE_KEYS.FIXED_COSTS);
      const storedTimestamp = localStorage.getItem(this.STORAGE_KEYS.FIXED_COSTS_TIMESTAMP);
      const storedBusinessId = localStorage.getItem(this.STORAGE_KEYS.FIXED_COSTS_BUSINESS_ID);
      
      // Verificar si hay datos almacenados
      if (!storedCosts || !storedTimestamp || !storedBusinessId) {
        return null;
      }
      
      // Verificar si los datos son del mismo negocio
      if (storedBusinessId !== businessId) {
        return null;
      }
      
      // Verificar si los datos no son muy antiguos (30 días)
      const timestamp = parseInt(storedTimestamp);
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      
      if (timestamp < thirtyDaysAgo) {
        this.clearFixedCosts();
        return null;
      }
      
      const costs = JSON.parse(storedCosts);
      return costs;
    } catch (error) {
      console.error('Error al cargar costos fijos desde localStorage:', error);
      this.clearFixedCosts();
      return null;
    }
  }

  /**
   * Limpia todos los datos de costos fijos del localStorage
   * Útil para limpieza de datos corruptos o expirados
   */
  static clearFixedCosts(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.FIXED_COSTS);
      localStorage.removeItem(this.STORAGE_KEYS.FIXED_COSTS_TIMESTAMP);
      localStorage.removeItem(this.STORAGE_KEYS.FIXED_COSTS_BUSINESS_ID);
    } catch (error) {
      console.error('Error al eliminar costos fijos de localStorage:', error);
    }
  }

  /**
   * Verifica si existen costos fijos válidos para un negocio específico
   * @param businessId - Identificador único del negocio
   * @returns true si hay datos válidos, false en caso contrario
   */
  static hasFixedCosts(businessId: string): boolean {
    try {
      const storedCosts = localStorage.getItem(this.STORAGE_KEYS.FIXED_COSTS);
      const storedTimestamp = localStorage.getItem(this.STORAGE_KEYS.FIXED_COSTS_TIMESTAMP);
      const storedBusinessId = localStorage.getItem(this.STORAGE_KEYS.FIXED_COSTS_BUSINESS_ID);
      
      if (!storedCosts || !storedTimestamp || !storedBusinessId) {
        return false;
      }
      
      if (storedBusinessId !== businessId) {
        return false;
      }
      
      const timestamp = parseInt(storedTimestamp);
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      
      return timestamp > thirtyDaysAgo;
    } catch (error) {
      return false;
    }
  }
}
