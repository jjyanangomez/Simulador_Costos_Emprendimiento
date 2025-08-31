import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { CreateItemInversionDto, UpdateItemInversionDto } from '../models/dto';

@Injectable()
export class ItemsInversionService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateItemInversionDto) {
    return this.prisma.itemsInversion.create({
      data: createDto,
    });
  }

  async findAll() {
    return this.prisma.itemsInversion.findMany({
      where: { activo: true },
      include: {
        Negocios: {
          select: {
            negocio_id: true,
            nombre_negocio: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const item = await this.prisma.itemsInversion.findFirst({
      where: { item_id: id, activo: true },
      include: {
        Negocios: {
          select: {
            negocio_id: true,
            nombre_negocio: true,
          },
        },
      },
    });

    if (!item) {
      throw new NotFoundException(`Item de inversión con ID ${id} no encontrado`);
    }

    return item;
  }

  async findByNegocioId(negocioId: number) {
    return this.prisma.itemsInversion.findMany({
      where: { negocio_id: negocioId, activo: true },
      orderBy: { fecha_creacion: 'desc' },
    });
  }

  async update(id: number, updateDto: UpdateItemInversionDto) {
    await this.findOne(id);

    return this.prisma.itemsInversion.update({
      where: { item_id: id },
      data: {
        ...updateDto,
        fecha_actualizacion: new Date(),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.itemsInversion.update({
      where: { item_id: id },
      data: { activo: false },
    });
  }

  async getTotalInversion(negocioId: number) {
    const items = await this.findByNegocioId(negocioId);
    
    const total = items.reduce((sum, item) => {
      // Convertir Decimal a número para operaciones aritméticas
      const precio = Number(item.precio);
      const cantidad = Number(item.cantidad);
      return sum + (precio * cantidad);
    }, 0);

    return {
      negocio_id: negocioId,
      total_inversion: total,
      cantidad_items: items.length,
      items: items,
    };
  }
}
