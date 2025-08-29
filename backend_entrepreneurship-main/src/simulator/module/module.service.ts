import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { ModuleMapper } from './mappers/module.mapper';
import { CreateModuleDto } from './dto/create-module.dto';
import { Module } from './entities/module.entity';
import { UpdateModuleDto } from './dto/update-module.dto';


@Injectable()
export class ModuleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ModuleMapper,
  ) {}

  async create(createDto: CreateModuleDto): Promise<Module> {
    const modulePrisma = await this.prisma.modulos.create({
      data: {
        id_aprendizaje: createDto.learningId,
        nombre_modulo: createDto.moduleName,
        orden_modulo: createDto.moduleOrder,
        titulo_conteido: createDto.contentTitle,
        concepto: createDto.concept ??'',
        recurso_interactivo: createDto.interactiveResource,
      },
    });
    return this.mapper.toDomain(modulePrisma);
  }

  async findAll(): Promise<Module[]> {
    const modulesPrisma = await this.prisma.modulos.findMany();
    return modulesPrisma.map(this.mapper.toDomain);
  }

  async findById(id: number): Promise<Module> {
    const modulePrisma = await this.prisma.modulos.findUnique({
      where: { id_modulo: id },
    });

    if (!modulePrisma) {
      throw new NotFoundException(`Module with ID ${id} not found.`);
    }
    return this.mapper.toDomain(modulePrisma);
  }

  async update(id: number, updateDto: UpdateModuleDto): Promise<Module> {
    await this.findById(id); // Verifica que el módulo exista

    const updatedModulePrisma = await this.prisma.modulos.update({
      where: { id_modulo: id },
      data: {
        id_aprendizaje: updateDto.learningId,
        nombre_modulo: updateDto.moduleName,
        orden_modulo: updateDto.moduleOrder,
        titulo_conteido: updateDto.contentTitle,
        concepto: updateDto.concept,
        recurso_interactivo: updateDto.interactiveResource,
      },
    });
    return this.mapper.toDomain(updatedModulePrisma);
  }

  async delete(id: number): Promise<void> {
    await this.findById(id); // Verifica que el módulo exista

    await this.prisma.modulos.delete({
      where: { id_modulo: id },
    });
  }
}