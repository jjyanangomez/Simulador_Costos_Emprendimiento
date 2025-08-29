import { Injectable } from '@nestjs/common';
import { Estados as StatusPrismaModel } from '@prisma/client';
import { Status } from '../entities/status.entity';

@Injectable()
export class StatusMapper {
  toDomain(prismaEntity: StatusPrismaModel): Status {
    return new Status(
      prismaEntity.nombre_estado,
      prismaEntity.id_estado,
    );
  }
}