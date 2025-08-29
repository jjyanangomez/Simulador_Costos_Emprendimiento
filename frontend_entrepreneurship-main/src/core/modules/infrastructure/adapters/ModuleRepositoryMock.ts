// import type { BaseResponseApi } from "../../../../shared/domain/entities/BaseResponseApi";
// import type { BusinessDTO } from "../../application/dto/BusinessDTO";
import type { FinancialRecord } from "../../domain/entities/FinancialRecord";
import type { ModuleContent } from "../../domain/entities/ModuleContent";
import type { IModuleRepository } from "../../domain/repositories/IModuleRepository";

// Datos de prueba
const mockModuleContent: ModuleContent = {
  id: 1,
  title: "Costos Fijos",
  concept: "Lorem ipsum...",
  resourceUrl: "https://www.youtube.com/embed/NVzQ860WLGo"
};

export class ModuleRepositoryMock implements IModuleRepository {
  async getModuleContentById(id: number): Promise<ModuleContent> {
    console.log(`Adaptador de Salida (Mock): Obteniendo contenido del modulo ${id}`);

    // Simulamos una demora de red
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockModuleContent);
      }, 200);
    });
  }

  async getAllFinancialRecords(_businessId: number, _moduleId: number): Promise<FinancialRecord[]> {
    throw new Error("Method not implemented");
  }
}
