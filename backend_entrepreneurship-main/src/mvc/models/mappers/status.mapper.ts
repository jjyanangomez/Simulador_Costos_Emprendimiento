import { Injectable } from '@nestjs/common';
import { Estados as StatusPrismaModel } from '@prisma/client';
import { Status } from '../entities/status.entity';

@Injectable()
export class StatusMapper {
    toDomain(prismaStatus: StatusPrismaModel): Status {
        return new Status(
            prismaStatus.nombre_estado,
            prismaStatus.id_estado
        );
    }
} 
