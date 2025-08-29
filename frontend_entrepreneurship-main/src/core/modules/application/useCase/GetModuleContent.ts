import type { ModuleContent } from "../../domain/entities/ModuleContent";
import type { IModuleRepository } from "../../domain/repositories/IModuleRepository";

export class GetModuleContent {
  private readonly moduleRepository: IModuleRepository;
  constructor(moduleRepository: IModuleRepository) {
    this.moduleRepository = moduleRepository;
  }

  async execute(id: number): Promise<ModuleContent> {
    const moduleContent = await this.moduleRepository.getModuleContentById(id);
    return moduleContent;
  }
}
