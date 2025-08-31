import { IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateItemInversionDto {
  @IsNumber()
  negocio_id: number;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  precio: number;

  @IsOptional()
  @IsNumber()
  cantidad?: number;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsEnum(['alta', 'media', 'baja'])
  prioridad?: string;

  @IsOptional()
  @IsDateString()
  fecha_compra_estimada?: string;
}
