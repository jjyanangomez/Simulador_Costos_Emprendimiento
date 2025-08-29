// src/simulator/bussiness/domain/mappers/business.mapper.ts
import { Injectable } from '@nestjs/common';
import { Negocios as BusinessPrismaModel } from '@prisma/client';
import { Business } from '../entities/bussines.entity';

@Injectable()
export class BusinessMapper {
    toDomain(prismaBusiness: BusinessPrismaModel): Business {
        return new Business(
            prismaBusiness.usuario_id,
            prismaBusiness.tipo_negocio,
            prismaBusiness.nombre_negocio,
            prismaBusiness.ubicacion,
            prismaBusiness.id_tamano,
            prismaBusiness.negocio_id,
            prismaBusiness.fecha_creacion === null ? undefined : prismaBusiness.fecha_creacion);
    }
}