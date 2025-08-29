import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDetectedRiskResultDto {
  @ApiProperty({ description: 'ID del análisis de IA al que pertenece el resultado', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  analisisId: number;

  @ApiProperty({ description: 'Descripción del riesgo detectado', example: 'Fluctuación en el tipo de cambio' })
  @IsString()
  @IsNotEmpty()
  riesgo: string;

  @ApiProperty({ description: 'Causa directa del riesgo', example: 'Dependencia de proveedores internacionales' })
  @IsString()
  @IsNotEmpty()
  causaDirecta: string;

  @ApiProperty({ description: 'Impacto potencial del riesgo en el negocio', example: 'Aumento de los costos de importación y reducción de la rentabilidad' })
  @IsString()
  @IsNotEmpty()
  impactoPotencial: string;
}
