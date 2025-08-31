import { IsOptional, IsString, IsNumber, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCostoVariableDto {
  @ApiPropertyOptional({ description: 'Nombre del costo variable' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @ApiPropertyOptional({ description: 'Descripción opcional del costo' })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiPropertyOptional({ description: 'Monto por unidad del costo' })
  @IsOptional()
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @IsPositive({ message: 'El monto debe ser positivo' })
  montoPorUnidad?: number;

  @ApiPropertyOptional({ description: 'ID de la unidad de medida' })
  @IsOptional()
  @IsNumber({}, { message: 'La unidad de medida debe ser un número' })
  unidadMedidaId?: number;
}
