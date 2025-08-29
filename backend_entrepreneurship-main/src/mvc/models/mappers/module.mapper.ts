import { Injectable } from '@nestjs/common';
import { Modulos as ModulePrismaModel } from '@prisma/client';
import { Module } from '../entities/module.entity';

@Injectable()
export class ModuleMapper {
  toDomain(prismaEntity: ModulePrismaModel): Module {
    return new Module(
      prismaEntity.id_aprendizaje,
      prismaEntity.nombre_modulo,
      prismaEntity.id_modulo,
      // Manejamos los posibles nulos de la base de datos
      prismaEntity.orden_modulo === null ? undefined : prismaEntity.orden_modulo,
      prismaEntity.titulo_conteido === null ? undefined : prismaEntity.titulo_conteido,
      prismaEntity.concepto === null ? undefined : prismaEntity.concepto,
      prismaEntity.recurso_interactivo === null ? undefined : prismaEntity.recurso_interactivo,
    );
  }
}
