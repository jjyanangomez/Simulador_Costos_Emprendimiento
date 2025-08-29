import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateCompleteAnalysisResultDto {
  @ApiProperty({ description: 'ID del negocio', required: false })
  @IsOptional()
  @IsNumber()
  negocioId?: number;

  @ApiProperty({ description: 'ID del módulo', required: false })
  @IsOptional()
  @IsNumber()
  moduloId?: number;

  @ApiProperty({ description: 'ID del análisis de IA', required: false })
  @IsOptional()
  @IsNumber()
  analisisId?: number;

  @ApiProperty({ description: 'Array de costos analizados', type: 'array', required: false })
  @IsOptional()
  @IsArray()
  costosAnalizados?: any[];

  @ApiProperty({ description: 'Array de riesgos detectados', type: 'array', required: false })
  @IsOptional()
  @IsArray()
  riesgosDetectados?: any[];

  @ApiProperty({ description: 'Array del plan de acción', type: 'array', required: false })
  @IsOptional()
  @IsArray()
  planAccion?: any[];

  @ApiProperty({ description: 'Resumen del análisis', required: false })
  @IsOptional()
  resumenAnalisis?: any;

  @ApiProperty({ description: 'Estado del guardado', required: false })
  @IsOptional()
  @IsString()
  estadoGuardado?: string;
}
