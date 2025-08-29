import type {
  IBusinessRepository,
  CreateBusinessData,
} from "../../domain/repositories/IBusinessRepository";
//import type { BusinessDTO } from "../dto/BusinessDTO";

export class CreateBusiness {
  private readonly repository: IBusinessRepository;

  constructor(repository: IBusinessRepository) {
    this.repository = repository;
  }

  async execute(data: CreateBusinessData) {
    console.log("Núcleo: Ejecutando caso de uso 'CreateBusiness'");
    if (!data.name || !data.businessType) {
      throw new Error("El nombre y el tipo de negocio son obligatorios.");
    }
    const newBusiness = await this.repository.createBusiness(data);
    console.log("Núcleo: Negocio creado con éxito", newBusiness);
    return newBusiness;
  }
}
