import { Injectable } from '@nestjs/common';
import { Resultados_Costos_Omitidos as OmittedCostResultPrismaModel } from '@prisma/client';
import { OmittedCostResult } from '../entities/omitted-cost-result.entity';

@Injectable()
export class OmittedCostResultMapper {
  toDomain(prismaEntity: OmittedCostResultPrismaModel): OmittedCostResult {
    return new OmittedCostResult(
      prismaEntity.analisis_id,
      prismaEntity.costo_omitido || '',
      prismaEntity.importancia || '',
      prismaEntity.costo_omitido_id,
    );
  }
}