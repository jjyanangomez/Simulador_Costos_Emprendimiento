import { Injectable } from '@nestjs/common';
import { tamano_negocio as SizePrismaModel } from '@prisma/client';
import { Size } from '../entities/size.entity';

@Injectable()
export class SizeMapper {
  toDomain(prismaSize: SizePrismaModel): Size {
    return new Size(
      prismaSize.tamano_nombre,
      prismaSize.id_tamano
    );
  }
}