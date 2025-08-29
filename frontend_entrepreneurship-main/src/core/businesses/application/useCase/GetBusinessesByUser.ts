import type { Business } from "../../domain/entities/Business";
import type { IBusinessRepository } from "../../domain/repositories/IBusinessRepository";

export class GetBusinessesByUser {
  private readonly businessRepository: IBusinessRepository;
  
  constructor(businessRepository: IBusinessRepository) {
    this.businessRepository = businessRepository;
  }

  async execute(userId: number): Promise<Business[]> {
    console.log(`🔍 [USECASE] Ejecutando caso de uso 'GetBusinessesByUser' para usuario ${userId}`);
    
    const businesses = await this.businessRepository.getByUserId(userId);
    
    console.log(`✅ [USECASE] Se encontraron ${businesses.length} negocios para el usuario ${userId}`);
    
    return businesses;
  }
}
