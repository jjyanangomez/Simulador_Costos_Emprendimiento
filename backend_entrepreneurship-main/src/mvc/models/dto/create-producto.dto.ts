import { IsNotEmpty, IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ description: 'ID del negocio al que pertenece el producto' })
  @IsNotEmpty({ message: 'El ID del negocio es requerido' })
  @IsNumber({}, { message: 'El ID del negocio debe ser un número' })
  negocioId: number;

  @ApiProperty({ description: 'ID de la categoría del producto' })
  @IsNotEmpty({ message: 'La categoría del producto es requerida' })
  @IsNumber({}, { message: 'La categoría debe ser un número' })
  categoriaId: number;

  @ApiProperty({ description: 'ID de la unidad de medida' })
  @IsNotEmpty({ message: 'La unidad de medida es requerida' })
  @IsNumber({}, { message: 'La unidad de medida debe ser un número' })
  unidadMedidaId: number;

  @ApiProperty({ description: 'Nombre del producto' })
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombreProducto: string;

  @ApiProperty({ description: 'Precio por unidad de medida' })
  @IsNotEmpty({ message: 'El precio por unidad es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  precioPorUnidad: number;

  @ApiProperty({ description: 'Porción requerida para el producto' })
  @IsNotEmpty({ message: 'La porción requerida es requerida' })
  @IsNumber({}, { message: 'La porción debe ser un número' })
  @IsPositive({ message: 'La porción debe ser positiva' })
  porcionRequerida: number;

  @ApiPropertyOptional({ description: 'Porción por unidad (opcional)' })
  @IsOptional()
  @IsNumber({}, { message: 'La porción por unidad debe ser un número' })
  @IsPositive({ message: 'La porción por unidad debe ser positiva' })
  porcionUnidad?: number;

  @ApiProperty({ description: 'Costo por unidad' })
  @IsNotEmpty({ message: 'El costo por unidad es requerido' })
  @IsNumber({}, { message: 'El costo debe ser un número' })
  @IsPositive({ message: 'El costo debe ser positivo' })
  costoPorUnidad: number;
}
