// import type { BaseResponseApi } from "../../../../shared/domain/entities/BaseResponseApi";
//import type { Repository } from "../../../../shared/domain/repositories/repository";
// import type { BusinessDTO } from "../../application/dto/BusinessDTO";
import type { Business } from "../entities/Business";

export type CreateBusinessData = Omit<
  Business,
  "id" | "createdAt" | "progress" | "completedModules" | "totalModules"
>;

export interface IBusinessRepository {
  createBusiness: (data: CreateBusinessData) => Promise<Business>;
  getAll(): Promise<Business[]>;
  getById(id: number): Promise<Business | null>;
  getByUserId(userId: number): Promise<Business[]>;
}
