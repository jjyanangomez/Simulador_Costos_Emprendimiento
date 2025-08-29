import { Injectable } from '@nestjs/common';
import { Resultados_Costos_Analizados as AnalyzedCostResultPrismaModel } from '@prisma/client';
import { ResultadosCostosAnalizados } from '../entities/results_costs_analyzed';

@Injectable()
export class AnalyzedCostResultMapper {
  toDomain(prismaEntity: AnalyzedCostResultPrismaModel): ResultadosCostosAnalizados {
    return new ResultadosCostosAnalizados(
      prismaEntity.analisis_id,
      prismaEntity.nombre_costo || '',
      prismaEntity.valor_recibido || '',
      prismaEntity.rango_estimado || '',
      prismaEntity.evaluacion || '',
      prismaEntity.comentario || '',
    );
  }
}