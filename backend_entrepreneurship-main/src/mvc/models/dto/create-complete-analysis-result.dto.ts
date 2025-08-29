import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, IsOptional, IsString, IsDate } from 'class-validator';

export class CreateCompleteAnalysisResultDto {
  @ApiProperty({ description: 'ID del negocio' })
  @IsNumber()
  negocioId: number;

  @ApiProperty({ description: 'ID del módulo' })
  @IsNumber()
  moduloId: number;

  @ApiProperty({ description: 'ID del análisis de IA' })
  @IsNumber()
  analisisId: number;

  @ApiProperty({ description: 'Array de costos analizados', type: 'array' })
  @IsArray()
  costosAnalizados: any[];

  @ApiProperty({ description: 'Array de riesgos detectados', type: 'array' })
  @IsArray()
  riesgosDetectados: any[];

  @ApiProperty({ description: 'Array del plan de acción', type: 'array' })
  @IsArray()
  planAccion: any[];

  @ApiProperty({ description: 'Resumen del análisis', required: false })
  @IsOptional()
  resumenAnalisis?: any;

  @ApiProperty({ description: 'Estado del guardado', default: 'guardado' })
  @IsOptional()
  @IsString()
  estadoGuardado?: string;
}
