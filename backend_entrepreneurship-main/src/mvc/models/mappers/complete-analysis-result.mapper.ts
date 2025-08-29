import { CompleteAnalysisResult } from '../entities/complete-analysis-result.entity';

export class CompleteAnalysisResultMapper {
  static toEntity(prismaResult: any): CompleteAnalysisResult {
    return new CompleteAnalysisResult(
      prismaResult.resultado_id,
      prismaResult.negocio_id,
      prismaResult.modulo_id,
      prismaResult.analisis_id,
      prismaResult.fecha_analisis,
      prismaResult.costos_analizados || [],
      prismaResult.riesgos_detectados || [],
      prismaResult.plan_accion || [],
      prismaResult.resumen_analisis || {},
      prismaResult.estado_guardado
    );
  }

  static toEntityList(prismaResults: any[]): CompleteAnalysisResult[] {
    return prismaResults.map(result => this.toEntity(result));
  }

  static toPrisma(entity: CompleteAnalysisResult): any {
    return {
      resultado_id: entity.resultadoId,
      negocio_id: entity.negocioId,
      modulo_id: entity.moduloId,
      analisis_id: entity.analisisId,
      fecha_analisis: entity.fechaAnalisis,
      costos_analizados: entity.costosAnalizados,
      riesgos_detectados: entity.riesgosDetectados,
      plan_accion: entity.planAccion,
      resumen_analisis: entity.resumenAnalisis,
      estado_guardado: entity.estadoGuardado
    };
  }

  static toPrismaCreate(dto: any): any {
    return {
      negocio_id: dto.negocioId,
      modulo_id: dto.moduloId,
      analisis_id: dto.analisisId,
      costos_analizados: dto.costosAnalizados,
      riesgos_detectados: dto.riesgosDetectados,
      plan_accion: dto.planAccion,
      resumen_analisis: dto.resumenAnalisis,
      estado_guardado: dto.estadoGuardado || 'guardado'
    };
  }

  static toPrismaUpdate(dto: any): any {
    const updateData: any = {};
    
    if (dto.negocioId !== undefined) updateData.negocio_id = dto.negocioId;
    if (dto.moduloId !== undefined) updateData.modulo_id = dto.moduloId;
    if (dto.analisisId !== undefined) updateData.analisis_id = dto.analisisId;
    if (dto.costosAnalizados !== undefined) updateData.costos_analizados = dto.costosAnalizados;
    if (dto.riesgosDetectados !== undefined) updateData.riesgos_detectados = dto.riesgosDetectados;
    if (dto.planAccion !== undefined) updateData.plan_accion = dto.planAccion;
    if (dto.resumenAnalisis !== undefined) updateData.resumen_analisis = dto.resumenAnalisis;
    if (dto.estadoGuardado !== undefined) updateData.estado_guardado = dto.estadoGuardado;

    return updateData;
  }
}
