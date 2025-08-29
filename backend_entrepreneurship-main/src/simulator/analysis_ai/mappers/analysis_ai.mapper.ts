import { Injectable } from '@nestjs/common';
import { AnalisisIA } from '../entities/analysis_ai';
import { Analisis_IA as AnalisisIAPrismaModel } from '@prisma/client';

@Injectable()
export class AnalisisIAMapper {
  // Convierte desde el modelo de Prisma al modelo de Dominio
  toDomain(prismaAnalisis: AnalisisIAPrismaModel): AnalisisIA {
    return new AnalisisIA(
      prismaAnalisis.negocio_id,
      prismaAnalisis.fecha_analisis === null ? undefined : prismaAnalisis.fecha_analisis
    );
  }
}
