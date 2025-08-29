import { apiClient } from "../../../../shared/infrastructure/http/api-client";
import type { ModuleContent } from "../../domain/entities/ModuleContent";
import type { FinancialRecord } from "../../domain/entities/FinancialRecord";
import type { IModuleRepository } from "../../domain/repositories/IModuleRepository";

// Interfaces para mapear entre frontend y backend
interface ModuloApiResponse {
  idModulo: number;
  idAprendizaje: number;
  ordenModulo?: number;
  nombreModulo: string;
  tituloContenido?: string;
  concepto: string;
  recursoInteractivo?: string;
}

// Mapper para convertir entre entidades del frontend y backend
const mapApiToModuleContent = (apiModulo: ModuloApiResponse): ModuleContent => {
  // Usar una URL de video que permita embedding
  const defaultVideoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"; // Rick Roll como ejemplo
  
  const mappedContent = {
    id: apiModulo.idModulo,
    title: apiModulo.nombreModulo,
    concept: apiModulo.concepto,
    resourceUrl: apiModulo.recursoInteractivo || defaultVideoUrl,
  };
  
  return mappedContent;
};

export class ModuleRepositoryApi implements IModuleRepository {
  async getModuleContentById(id: number): Promise<ModuleContent> {
    try {
      const response = await apiClient.get<ModuloApiResponse>(`/modulos/${id}`);
      const mappedModuleContent = mapApiToModuleContent(response);
      return mappedModuleContent;
    } catch (error) {
      throw new Error('No se pudo cargar el contenido del módulo. Inténtalo de nuevo.');
    }
  }

  async getAllFinancialRecords(businessId: number, moduleId: number): Promise<FinancialRecord[]> {
    try {
      const response = await apiClient.get<FinancialRecord[]>(`/financial-records/business/${businessId}/module/${moduleId}`);
      return response;
    } catch (error) {
      // Por ahora, retornar un array vacío si no hay registros
      return [];
    }
  }
}
