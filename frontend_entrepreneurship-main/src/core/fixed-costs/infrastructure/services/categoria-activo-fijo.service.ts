import { buildApiUrl, API_CONFIG } from '../../../../config/api.config';

export interface CategoriaActivoFijo {
  categoria_id: number;
  nombre: string;
  descripcion?: string | null;
  icono?: string | null;
  color?: string | null;
  activo: boolean;
  fecha_creacion: Date | null;
}

export interface CategoriaActivoFijoResponse {
  message: string;
  data: CategoriaActivoFijo[];
  total: number;
}

class CategoriaActivoFijoService {
  private baseUrl = API_CONFIG.BACKEND_URL; // URL del backend desde configuración

  /**
   * Obtener todas las categorías activas
   */
  async getCategoriasActivas(): Promise<CategoriaActivoFijo[]> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.CATEGORIAS.ACTIVAS));
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result: CategoriaActivoFijoResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al obtener categorías activas:', error);
      // Retornar categorías por defecto en caso de error
      return this.getCategoriasPorDefecto();
    }
  }

  /**
   * Obtener categorías por negocio específico
   */
  async getCategoriasPorNegocio(negocioId: number): Promise<CategoriaActivoFijo[]> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.CATEGORIAS.POR_NEGOCIO(negocioId)));
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result: CategoriaActivoFijoResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al obtener categorías por negocio:', error);
      return this.getCategoriasPorDefecto();
    }
  }

  /**
   * Buscar categorías por término
   */
  async buscarCategorias(termino: string): Promise<CategoriaActivoFijo[]> {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.CATEGORIAS.BUSCAR(termino)));
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const result: CategoriaActivoFijoResponse = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error al buscar categorías:', error);
      return this.getCategoriasPorDefecto();
    }
  }

  /**
   * Categorías por defecto en caso de error de conexión
   */
  private getCategoriasPorDefecto(): CategoriaActivoFijo[] {
    return [
      {
        categoria_id: 1,
        nombre: 'Equipos de Cocina',
        descripcion: 'Equipos para preparar alimentos',
        icono: '🍳',
        color: '#FF6B6B',
        activo: true,
        fecha_creacion: new Date()
      },
      {
        categoria_id: 2,
        nombre: 'Mobiliario',
        descripcion: 'Muebles y elementos de decoración',
        icono: '🪑',
        color: '#4ECDC4',
        activo: true,
        fecha_creacion: new Date()
      },
      {
        categoria_id: 3,
        nombre: 'Equipos de Computación',
        descripcion: 'Computadoras, impresoras y equipos tecnológicos',
        icono: '💻',
        color: '#45B7D1',
        activo: true,
        fecha_creacion: new Date()
      },
      {
        categoria_id: 4,
        nombre: 'Equipos de Refrigeración',
        descripcion: 'Refrigeradores, congeladores y equipos de frío',
        icono: '❄️',
        color: '#96CEB4',
        activo: true,
        fecha_creacion: new Date()
      },
      {
        categoria_id: 5,
        nombre: 'Equipos de Seguridad',
        descripcion: 'Cámaras, alarmas y sistemas de seguridad',
        icono: '🔒',
        color: '#FFEAA7',
        activo: true,
        fecha_creacion: new Date()
      },
      {
        categoria_id: 6,
        nombre: 'Equipos de Limpieza',
        descripcion: 'Aspiradoras, escobas y productos de limpieza',
        icono: '🧹',
        color: '#DDA0DD',
        activo: true,
        fecha_creacion: new Date()
      },
      {
        categoria_id: 7,
        nombre: 'Equipos de Oficina',
        descripcion: 'Escritorios, sillas y elementos de oficina',
        icono: '📁',
        color: '#98D8C8',
        activo: true,
        fecha_creacion: new Date()
      },
      {
        categoria_id: 8,
        nombre: 'Otros Equipos',
        descripcion: 'Equipos diversos no categorizados',
        icono: '📦',
        color: '#F7DC6F',
        activo: true,
        fecha_creacion: new Date()
      }
    ];
  }
}

export const categoriaActivoFijoService = new CategoriaActivoFijoService();
