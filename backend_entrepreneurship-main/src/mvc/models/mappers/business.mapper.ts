import { Injectable } from '@nestjs/common';
import { Negocios as BusinessPrismaModel } from '@prisma/client';
import { Business } from '../entities/business.entity';

@Injectable()
export class BusinessMapper {
    toDomain(prismaBusiness: any): Business {
        const mappedBusiness = new Business(
            prismaBusiness.usuario_id,
            prismaBusiness.nombre_negocio,
            prismaBusiness.ubicacion_exacta,
            prismaBusiness.negocio_id,
            prismaBusiness.fecha_creacion === null ? undefined : prismaBusiness.fecha_creacion,
            prismaBusiness.TamanosNegocio?.tamano_nombre || undefined,
            prismaBusiness.sector_id,
            prismaBusiness.id_tamano,
            prismaBusiness.aforo_personas || 0,
            Number(prismaBusiness.inversion_inicial) || 0,
            Number(prismaBusiness.capital_propio) || 0,
            Number(prismaBusiness.capital_prestamo) || 0,
            Number(prismaBusiness.tasa_interes) || 0
        );
        
        return mappedBusiness;
    }
}
