import { Injectable } from '@nestjs/common';
import { Resultados_Riesgos_Detectados as DetectedRiskResultPrismaModel } from '@prisma/client';
import { DetectedRiskResult } from '../entities/detected-risk-result.entity';

@Injectable()
export class DetectedRiskResultMapper {
  toDomain(prismaEntity: DetectedRiskResultPrismaModel): DetectedRiskResult {
    return new DetectedRiskResult(
      prismaEntity.analisis_id,
      prismaEntity.riesgo || '',
      prismaEntity.causa_directa || '',
      prismaEntity.impacto_potencial || '',
      prismaEntity.riesgo_id,
    );
  }
}