import { CategoriaActivoFijo } from '../entities/categoria-activo-fijo.entity';

export class CategoriaActivoFijoMapper {
  /**
   * Mapear datos de Prisma a la entidad
   */
  static toEntity(prismaData: any): CategoriaActivoFijo {
    return {
      categoria_id: prismaData.categoria_id,
      nombre: prismaData.nombre,
      descripcion: prismaData.descripcion || undefined,
      icono: prismaData.icono || undefined,
      color: prismaData.color || undefined,
      activo: prismaData.activo,
      fecha_creacion: prismaData.fecha_creacion || new Date(),
    };
  }

  /**
   * Mapear array de datos de Prisma a entidades
   */
  static toEntityArray(prismaDataArray: any[]): CategoriaActivoFijo[] {
    return prismaDataArray.map(this.toEntity);
  }

  /**
   * Mapear para respuesta de API con costos fijos
   */
  static toEntityWithCostosFijos(prismaData: any): any {
    const categoria = this.toEntity(prismaData);
    
    if (prismaData.CostosFijos) {
      return {
        ...categoria,
        costos_fijos: prismaData.CostosFijos.map((costo: any) => ({
          costo_fijo_id: costo.costo_fijo_id,
          nombre: costo.nombre,
          monto: costo.monto,
          negocio_id: costo.negocio_id,
        })),
        total_costos: prismaData.CostosFijos.length,
      };
    }

    return categoria;
  }

  /**
   * Mapear para respuesta de API con estadísticas
   */
  static toEntityWithStats(prismaData: any): any {
    return {
      categoria_id: prismaData.categoria_id,
      nombre: prismaData.nombre,
      icono: prismaData.icono,
      color: prismaData.color,
      total_costos: prismaData._count?.CostosFijos || 0,
    };
  }

  /**
   * Mapear para creación/actualización
   */
  static toCreateDto(entity: Partial<CategoriaActivoFijo>): any {
    return {
      nombre: entity.nombre,
      descripcion: entity.descripcion,
      icono: entity.icono,
      color: entity.color,
      activo: entity.activo,
    };
  }

  /**
   * Mapear para respuesta de búsqueda
   */
  static toSearchResult(prismaData: any): any {
    return {
      categoria_id: prismaData.categoria_id,
      nombre: prismaData.nombre,
      descripcion: prismaData.descripcion || undefined,
      icono: prismaData.icono || undefined,
      color: prismaData.color || undefined,
      activo: prismaData.activo,
      fecha_creacion: prismaData.fecha_creacion || new Date(),
      relevancia: this.calculateRelevance(prismaData),
    };
  }

  /**
   * Calcular relevancia para búsquedas
   */
  private static calculateRelevance(data: any): number {
    let relevancia = 0;
    
    // Prioridad alta para coincidencias en nombre
    if (data.nombre) relevancia += 10;
    
    // Prioridad media para coincidencias en descripción
    if (data.descripcion) relevancia += 5;
    
    // Bonus para categorías activas
    if (data.activo) relevancia += 2;
    
    return relevancia;
  }
}
