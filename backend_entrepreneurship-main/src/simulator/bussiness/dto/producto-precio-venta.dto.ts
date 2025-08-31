import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class ActualizarPrecioVentaDto {
  @IsNumber()
  @IsPositive()
  producto_id: number;

  @IsNumber()
  @IsPositive()
  precio_venta_cliente: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}

export class ProductoPrecioVentaResponseDto {
  producto_id: number;
  nombre_producto: string;
  costo_total_producto: number;
  precio_venta_sugerido_ia: number;
  precio_venta_cliente: number;
  margen_ganancia_ia: number;
  margen_ganancia_real: number;
  ganancia_por_unidad: number;
}

export class ResumenPreciosVentaDto {
  costo_total_productos: number;
  costo_total_adicionales: number;
  costo_total_general: number;
  precio_venta_total_sugerido: number;
  precio_venta_total_cliente: number;
  ganancia_total_sugerida: number;
  ganancia_total_real: number;
  margen_ganancia_promedio: number;
  productos: ProductoPrecioVentaResponseDto[];
}
