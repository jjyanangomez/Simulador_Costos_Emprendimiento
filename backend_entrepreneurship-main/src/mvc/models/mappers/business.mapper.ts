import { Injectable } from '@nestjs/common';
import { Negocios as BusinessPrismaModel } from '@prisma/client';
import { Business } from '../entities/business.entity';

@Injectable()
export class BusinessMapper {
    toDomain(prismaBusiness: any): Business {
        const mappedBusiness = new Business(
            prismaBusiness.usuario_id,
            prismaBusiness.tipo_negocio,
            prismaBusiness.nombre_negocio,
            prismaBusiness.ubicacion,
            prismaBusiness.id_tamano,
            prismaBusiness.negocio_id,
            prismaBusiness.fecha_creacion === null ? undefined : prismaBusiness.fecha_creacion,
            prismaBusiness.tamano_negocio?.nombre_tamano || undefined
        );
        
        return mappedBusiness;
    }
}
