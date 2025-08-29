import type { FinancialRecord } from "../entities/FinancialRecord";
import type { ModuleContent } from "../entities/ModuleContent";

export interface IModuleRepository {
  getModuleContentById(id: number): Promise<ModuleContent>;
  getAllFinancialRecords(businessId: number, moduleId: number): Promise<FinancialRecord[]>
}
