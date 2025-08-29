import { Injectable } from '@nestjs/common';
import { Resultados_Plan_Accion as ActionPlanResultPrismaModel } from '@prisma/client';
import { ActionPlanResult } from '../entities/action-plan-result.entity';

@Injectable()
export class ActionPlanResultMapper {
  toDomain(prismaEntity: ActionPlanResultPrismaModel): ActionPlanResult {
    return new ActionPlanResult(
      prismaEntity.analisis_id,
      prismaEntity.titulo  || '',
      prismaEntity.descripcion || '',
      prismaEntity.prioridad || '',
      prismaEntity.plan_id,
    );
  }
}