import type { Business } from "../../domain/entities/Business";
import type { IBusinessRepository } from "../../domain/repositories/IBusinessRepository";

export class GetAllBusinesses {
  private readonly businessRepository: IBusinessRepository;
  constructor(businessRepository: IBusinessRepository) {
    this.businessRepository = businessRepository;
  }

  async execute(): Promise<Business[]> {
    console.log("Núcleo: Ejecutando caso de uso 'GetAllBusinesses'");
    const businesses = await this.businessRepository.getAll();
    console.log(`Núcleo: Se encontraron ${businesses.length} negocios.`);
    return businesses;
  }
}
