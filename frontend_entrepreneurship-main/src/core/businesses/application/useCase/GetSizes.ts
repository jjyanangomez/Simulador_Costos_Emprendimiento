import type { Size } from "../../infrastructure/adapters/SizeRepositoryApi";
import type { ISizeRepository } from "../../infrastructure/adapters/SizeRepositoryApi";

export class GetSizes {
  private readonly sizeRepository: ISizeRepository;
  
  constructor(sizeRepository: ISizeRepository) {
    this.sizeRepository = sizeRepository;
  }

  async execute(): Promise<Size[]> {
    console.log('📏 [USECASE] Ejecutando caso de uso GetSizes');
    
    const sizes = await this.sizeRepository.getAll();
    
    console.log(`✅ [USECASE] Se obtuvieron ${sizes.length} tamaños de negocio`);
    
    return sizes;
  }
}
