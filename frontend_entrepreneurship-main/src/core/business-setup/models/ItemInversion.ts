export interface ItemInversion {
  item_id?: number;
  negocio_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad: number;
  categoria?: string;
  prioridad?: 'alta' | 'media' | 'baja';
  fecha_compra_estimada?: string;
  activo?: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

export interface CreateItemInversionDto {
  negocio_id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  cantidad?: number;
  categoria?: string;
  prioridad?: 'alta' | 'media' | 'baja';
  fecha_compra_estimada?: string;
}

export interface UpdateItemInversionDto extends Partial<CreateItemInversionDto> {}

export interface TotalInversionResponse {
  negocio_id: number;
  total_inversion: number;
  cantidad_items: number;
  items: ItemInversion[];
}
