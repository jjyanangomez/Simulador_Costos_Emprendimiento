import { apiClient } from "../../../../shared/infrastructure/http/api-client";
import type { Business } from "../../domain/entities/Business";
import type {
  IBusinessRepository,
  CreateBusinessData,
} from "../../domain/repositories/IBusinessRepository";

// Interfaces para mapear entre frontend y backend
interface BusinessApiResponse {
  negocioId: number;
  usuarioId: number;
  tipoNegocio: string;
  nombreNegocio: string;
  ubicacion: string;
  idTamano: number;
  fechaCreacion: string;
}

interface CreateBusinessApiRequest {
  usuarioId: number;
  tipoNegocio: string;
  nombreNegocio: string;
  ubicacion: string;
  idTamano: number;
}

// Mapper para convertir entre entidades del frontend y backend
const mapApiToBusiness = (apiBusiness: BusinessApiResponse): Business => {
  return {
    id: apiBusiness.negocioId,
    userId: apiBusiness.usuarioId,
    businessType: apiBusiness.tipoNegocio,
    name: apiBusiness.nombreNegocio,
    location: apiBusiness.ubicacion,
    sizeId: apiBusiness.idTamano,
    createdAt: apiBusiness.fechaCreacion ? new Date(apiBusiness.fechaCreacion) : null,
    // Valores por defecto para las propiedades adicionales del frontend
    icon: getBusinessIcon(apiBusiness.tipoNegocio),
    color: getBusinessColor(apiBusiness.tipoNegocio),
    progress: 0, // Esto se calcularía con otra API
    completedModules: 0,
    totalModules: 10,
  };
};

const mapBusinessToApi = (business: CreateBusinessData): CreateBusinessApiRequest => {
  return {
    usuarioId: business.userId,
    tipoNegocio: business.businessType,
    nombreNegocio: business.name,
    ubicacion: business.location,
    idTamano: business.sizeId,
  };
};

// Funciones auxiliares para asignar iconos y colores
const getBusinessIcon = (businessType: string): string => {
  const iconMap: Record<string, string> = {
    'Restaurante': 'fas fa-utensils',
    'Cafetería': 'fas fa-coffee',
    'Tienda de Ropa': 'fas fa-tshirt',
    'Ferretería': 'fas fa-tools',
    'Farmacia': 'fas fa-pills',
    'Supermercado': 'fas fa-shopping-cart',
    'Salón de Belleza': 'fas fa-cut',
    'Gimnasio': 'fas fa-dumbbell',
    'Veterinaria': 'fas fa-paw',
    'Librería': 'fas fa-book',
  };
  return iconMap[businessType] || 'fas fa-store';
};

const getBusinessColor = (businessType: string): string => {
  const colorMap: Record<string, string> = {
    'Restaurante': 'primary-500',
    'Cafetería': 'accent-500',
    'Tienda de Ropa': 'secondary-500',
    'Ferretería': 'neutral-700',
    'Farmacia': 'green-500',
    'Supermercado': 'blue-500',
    'Salón de Belleza': 'pink-500',
    'Gimnasio': 'orange-500',
    'Veterinaria': 'purple-500',
    'Librería': 'indigo-500',
  };
  return colorMap[businessType] || 'gray-500';
};

export class BusinessRepositoryApi implements IBusinessRepository {
  async createBusiness(data: CreateBusinessData): Promise<Business> {
    try {
      console.log('🏢 [FRONTEND] Creando negocio con datos:', data);
      
      const apiData = mapBusinessToApi(data);
      console.log('🔄 [FRONTEND] Datos mapeados para API:', apiData);
      console.log('🔍 [FRONTEND] Verificación de tipos:');
      console.log('  - usuarioId:', typeof apiData.usuarioId, 'valor:', apiData.usuarioId);
      console.log('  - tipoNegocio:', typeof apiData.tipoNegocio, 'valor:', apiData.tipoNegocio);
      console.log('  - nombreNegocio:', typeof apiData.nombreNegocio, 'valor:', apiData.nombreNegocio);
      console.log('  - ubicacion:', typeof apiData.ubicacion, 'valor:', apiData.ubicacion);
      console.log('  - idTamano:', typeof apiData.idTamano, 'valor:', apiData.idTamano);
      
      const response = await apiClient.post<BusinessApiResponse>('/negocios', apiData);
      
      console.log('📋 [FRONTEND] Respuesta del backend para crear negocio:', response);
      
      // El backend devuelve directamente el objeto, no una respuesta envuelta
      const mappedBusiness = mapApiToBusiness(response);
      console.log('✅ [FRONTEND] Negocio mapeado y creado:', mappedBusiness);
      
      return mappedBusiness;
    } catch (error) {
      console.error('💥 [FRONTEND] Error en BusinessRepositoryApi.createBusiness:', error);
      
      // Mejorar el mensaje de error con más detalles
      if (error instanceof Error) {
        console.error('💥 [FRONTEND] Detalles del error:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        
        if (error.message.includes('500')) {
          throw new Error('Error interno del servidor. Verifica que la base de datos esté configurada correctamente.');
        } else if (error.message.includes('404')) {
          throw new Error('Endpoint no encontrado. Verifica que el backend esté corriendo.');
        } else if (error.message.includes('400')) {
          // Intentar extraer más información del error
          if (error.message.includes('Validation failed')) {
            throw new Error('Datos inválidos: Verifica que todos los campos estén completos y en el formato correcto.');
          } else {
            throw new Error('Datos inválidos. Verifica que todos los campos estén completos.');
          }
        }
      }
      
      throw new Error('No se pudo crear el negocio. Inténtalo de nuevo.');
    }
  }

  async getAll(): Promise<Business[]> {
    try {
      console.log('📋 [FRONTEND] Solicitando todos los negocios...');
      
      const response = await apiClient.get<BusinessApiResponse[]>('/negocios');
      
      console.log('📥 [FRONTEND] Respuesta del backend para obtener negocios:', response);
      
      // El backend devuelve directamente el array, no una respuesta envuelta
      const mappedBusinesses = response.map(mapApiToBusiness);
      console.log('✅ [FRONTEND] Negocios mapeados:', mappedBusinesses);
      
      return mappedBusinesses;
    } catch (error) {
      console.error('💥 [FRONTEND] Error en BusinessRepositoryApi.getAll:', error);
      throw new Error('No se pudieron cargar los negocios. Inténtalo de nuevo.');
    }
  }

  async getById(id: number): Promise<Business | null> {
    try {
      console.log(`🔍 [FRONTEND] Buscando negocio con ID: ${id}`);
      
      const response = await apiClient.get<BusinessApiResponse>(`/negocios/${id}`);
      
      console.log(`📥 [FRONTEND] Respuesta del backend para negocio ID ${id}:`, response);
      
      // El backend devuelve directamente el objeto, no una respuesta envuelta
      const mappedBusiness = mapApiToBusiness(response);
      console.log(`✅ [FRONTEND] Negocio encontrado y mapeado:`, mappedBusiness);
      
      return mappedBusiness;
    } catch (error) {
      console.error(`💥 [FRONTEND] Error en BusinessRepositoryApi.getById para ID ${id}:`, error);
      return null;
    }
  }

  async getByUserId(userId: number): Promise<Business[]> {
    try {
      console.log(`👤 [FRONTEND] Buscando negocios del usuario ID: ${userId}`);
      
      const response = await apiClient.get<BusinessApiResponse[]>(`/negocios/usuario/${userId}`);
      
      console.log(`📥 [FRONTEND] Respuesta del backend para negocios del usuario ${userId}:`, response);
      
      // El backend devuelve directamente el array, no una respuesta envuelta
      const mappedBusinesses = response.map(mapApiToBusiness);
      console.log(`✅ [FRONTEND] Negocios del usuario mapeados:`, mappedBusinesses);
      
      return mappedBusinesses;
    } catch (error) {
      console.error(`💥 [FRONTEND] Error en BusinessRepositoryApi.getByUserId para usuario ${userId}:`, error);
      throw new Error('No se pudieron cargar los negocios del usuario. Inténtalo de nuevo.');
    }
  }
}
