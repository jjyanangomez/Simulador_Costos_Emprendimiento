import { Injectable } from '@nestjs/common';
import { Registros_financieros as FinancialRecordPrismaModel } from '@prisma/client';
import { FinancialRecord } from '../entities/financial-record.entity';

@Injectable()
export class FinancialRecordMapper {
  toDomain(prismaEntity: FinancialRecordPrismaModel): FinancialRecord {
    return new FinancialRecord(
      prismaEntity.negocio_id,
      prismaEntity.modulo_id,
      prismaEntity.nombre,
      Number(prismaEntity.monto), // Prisma maneja Decimal, lo convertimos a number
      prismaEntity.registro_id,
      prismaEntity.fecha_registro || undefined,
    );
  }
}