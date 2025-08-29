import { apiClient } from "../../../../shared/infrastructure/http/api-client";

export interface Size {
  sizeId: number;
  sizeName: string;
}

export interface ISizeRepository {
  getAll(): Promise<Size[]>;
}

export class SizeRepositoryApi implements ISizeRepository {
  async getAll(): Promise<Size[]> {
    try {
      console.log('📏 [FRONTEND] Solicitando tamaños de negocio...');
      
      const response = await apiClient.get<Size[]>('/sizes');
      
      console.log('📥 [FRONTEND] Respuesta del backend para tamaños:', response);
      
      return response;
    } catch (error) {
      console.error('💥 [FRONTEND] Error en SizeRepositoryApi.getAll:', error);
      throw new Error('No se pudieron cargar los tamaños de negocio. Inténtalo de nuevo.');
    }
  }
}
