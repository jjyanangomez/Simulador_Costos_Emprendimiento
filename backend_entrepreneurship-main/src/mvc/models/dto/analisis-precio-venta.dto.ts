import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductoPrecioDto {
  @ApiProperty({ description: 'ID del producto' })
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsNumber({}, { message: 'El ID debe ser un número' })
  id: number;

  @ApiProperty({ description: 'Nombre del producto' })
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @ApiProperty({ description: 'Costo total del producto' })
  @IsNotEmpty({ message: 'El costo total es requerido' })
  @IsNumber({}, { message: 'El costo debe ser un número' })
  @IsPositive({ message: 'El costo debe ser positivo' })
  costoTotal: number;

  @ApiProperty({ description: 'Precio de venta actual' })
  @IsNotEmpty({ message: 'El precio de venta es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  precioVenta: number;

  @ApiProperty({ description: 'Volumen de ventas estimado' })
  @IsNotEmpty({ message: 'El volumen de ventas es requerido' })
  @IsNumber({}, { message: 'El volumen debe ser un número' })
  @IsPositive({ message: 'El volumen debe ser positivo' })
  volumenVentas: number;
}

export class AnalisisPrecioVentaDto {
  @ApiProperty({ description: 'ID del negocio a analizar' })
  @IsNotEmpty({ message: 'El ID del negocio es requerido' })
  @IsNumber({}, { message: 'El ID debe ser un número' })
  negocioId: number;

  @ApiProperty({ description: 'ID del módulo de análisis' })
  @IsNotEmpty({ message: 'El ID del módulo es requerido' })
  @IsNumber({}, { message: 'El ID debe ser un número' })
  moduloId: number;

  @ApiProperty({ description: 'ID del sector del negocio' })
  @IsNotEmpty({ message: 'El ID del sector es requerido' })
  @IsNumber({}, { message: 'El ID debe ser un número' })
  sectorId: number;

  @ApiProperty({ description: 'Array de productos para análisis de precios' })
  @IsArray({ message: 'Los productos deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => ProductoPrecioDto)
  productos: ProductoPrecioDto[];

  @ApiPropertyOptional({ description: 'Margen de beneficio objetivo (%)' })
  @IsOptional()
  @IsNumber({}, { message: 'El margen debe ser un número' })
  @IsPositive({ message: 'El margen debe ser positivo' })
  margenObjetivo?: number;

  @ApiPropertyOptional({ description: 'Análisis de competencia del sector' })
  @IsOptional()
  @IsString({ message: 'El análisis de competencia debe ser una cadena de texto' })
  analisisCompetencia?: string;

  @ApiPropertyOptional({ description: 'Estrategia de precios del negocio' })
  @IsOptional()
  @IsString({ message: 'La estrategia de precios debe ser una cadena de texto' })
  estrategiaPrecios?: string;
}
