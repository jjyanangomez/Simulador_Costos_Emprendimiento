import { Injectable } from '@nestjs/common';
import { Modulos as ModuloPrismaModel } from '@prisma/client';
import { Modulo } from '../entities/modulo.entity';

@Injectable()
export class ModuloMapper {
    toDomain(prismaModulo: ModuloPrismaModel): Modulo {
        const mappedModulo = new Modulo(
            prismaModulo.id_modulo,
            prismaModulo.id_aprendizaje,
            prismaModulo.nombre_modulo,
            prismaModulo.concepto,
            prismaModulo.orden_modulo || undefined,
            prismaModulo.titulo_conteido || undefined,
            prismaModulo.recurso_interactivo || undefined
        );
        
        return mappedModulo;
    }
}
