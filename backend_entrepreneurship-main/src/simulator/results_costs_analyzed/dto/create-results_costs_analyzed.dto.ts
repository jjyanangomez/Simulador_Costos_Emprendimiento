import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnalyzedCostResultDto {
  @ApiProperty({ description: 'ID del análisis de IA al que pertenece el resultado', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  analysisId: number;

  @ApiProperty({ description: 'Nombre del costo analizado', example: 'Costo de Marketing Digital' })
  @IsString()
  @IsNotEmpty()
  costName: string;

  @ApiProperty({ description: 'Valor del costo reportado por el usuario', example: '$500' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  receivedValue?: string;

  @ApiProperty({ description: 'Rango estimado de valor para el costo', example: '$450 - $600' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  estimatedRange?: string;

  @ApiProperty({ description: 'Evaluación del valor del costo (ej. "En rango", "Alto", "Bajo")', example: 'En rango' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  evaluation?: string;

  @ApiProperty({ description: 'Comentario o recomendación sobre el costo', example: 'Tu gasto en marketing digital es competitivo para el mercado.' })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  comment?: string;
}