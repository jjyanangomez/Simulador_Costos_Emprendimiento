import type { FinancialRecord } from "../../domain/entities/FinancialRecord";
import type { IModuleRepository } from "../../domain/repositories/IModuleRepository";

export class GetAllFinancialRecords {
  private readonly moduleRepository: IModuleRepository;
  constructor(moduleRepository: IModuleRepository) {
    this.moduleRepository = moduleRepository;
  }

  async execute(businessId: number, moduleId: number): Promise<FinancialRecord[]> {
    const financialRecords = await this.moduleRepository.getAllFinancialRecords(businessId, moduleId);
    console.log(`Núcleo: Se encontraron ${financialRecords.length} registros`);
    return financialRecords;
  }
}
