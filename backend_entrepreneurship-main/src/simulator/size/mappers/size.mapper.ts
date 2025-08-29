import { Injectable } from '@nestjs/common';
import { tamano_negocio as SizePrismaModel } from '@prisma/client';
import { Size } from '../entities/size.entity';

@Injectable()
export class SizeMapper {
  toDomain(prismaEntity: SizePrismaModel): Size {
    return new Size(
      prismaEntity.tamano_nombre,
      prismaEntity.id_tamano,
    );
  }
}