import { IsNotEmpty, IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCostoVariableDto {
  @ApiProperty({ description: 'ID del negocio al que pertenece el costo' })
  @IsNotEmpty({ message: 'El ID del negocio es requerido' })
  @IsNumber({}, { message: 'El ID del negocio debe ser un número' })
  negocioId: number;

  @ApiPropertyOptional({ description: 'ID del producto asociado (opcional)' })
  @IsOptional()
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  productoId?: number;

  @ApiPropertyOptional({ description: 'ID de la receta asociada (opcional)' })
  @IsOptional()
  @IsNumber({}, { message: 'El ID de la receta debe ser un número' })
  recetaId?: number;

  @ApiProperty({ description: 'ID del tipo de costo' })
  @IsNotEmpty({ message: 'El tipo de costo es requerido' })
  @IsNumber({}, { message: 'El tipo de costo debe ser un número' })
  tipoCostoId: number;

  @ApiProperty({ description: 'Nombre del costo variable' })
  @IsNotEmpty({ message: 'El nombre del costo es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción opcional del costo' })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiProperty({ description: 'Monto por unidad del costo' })
  @IsNotEmpty({ message: 'El monto por unidad es requerido' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @IsPositive({ message: 'El monto debe ser positivo' })
  montoPorUnidad: number;

  @ApiProperty({ description: 'ID de la unidad de medida' })
  @IsNotEmpty({ message: 'La unidad de medida es requerida' })
  @IsNumber({}, { message: 'La unidad de medida debe ser un número' })
  unidadMedidaId: number;
}
