import { Injectable } from '@nestjs/common';
import { Aprendizaje as AprendizajePrismaModel } from '@prisma/client';
import { Aprendizaje } from '../entities/aprendizaje.entity';

@Injectable()
export class AprendizajeMapper {
    toDomain(prismaAprendizaje: AprendizajePrismaModel): Aprendizaje {
        const mappedAprendizaje = new Aprendizaje(
            prismaAprendizaje.id_aprendizaje,
            prismaAprendizaje.nombre,
            prismaAprendizaje.total_niveles || undefined
        );
        
        return mappedAprendizaje;
    }
}
