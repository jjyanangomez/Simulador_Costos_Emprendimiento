import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOmittedCostResultDto {
  @ApiProperty({ description: 'ID del análisis de IA al que pertenece el resultado', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  analysisId: number;

  @ApiProperty({ description: 'Nombre del costo que se ha omitido', example: 'Mantenimiento de software' })
  @IsString()
  @IsNotEmpty()
  omittedCost: string;

  @ApiProperty({ description: 'Nivel de importancia del costo omitido (ej. "Alta", "Media", "Baja")', example: 'Alta' })
  @IsString()
  @IsNotEmpty()
  importance: string;
}