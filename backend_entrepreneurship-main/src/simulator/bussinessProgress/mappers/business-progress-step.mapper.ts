import { Injectable } from '@nestjs/common';
import { NegocioProgresoPaso as BusinessProgressStepPrismaModel } from '@prisma/client';
import { BusinessProgressStep } from '../entities/business-progress-step.entity';

@Injectable()
export class BusinessProgressStepMapper {
  toDomain(prismaEntity: BusinessProgressStepPrismaModel): BusinessProgressStep {
    return new BusinessProgressStep(
      prismaEntity.negocio_id,
      prismaEntity.modulo_id,
      prismaEntity.id_estado,
      prismaEntity.id,
      prismaEntity.fecha_inicio === null ? undefined : prismaEntity.fecha_inicio,
      prismaEntity.fecha_completado === null ? undefined : prismaEntity.fecha_completado,
    );
  }
}