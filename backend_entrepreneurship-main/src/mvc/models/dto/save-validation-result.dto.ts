import { IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveValidationResultDto {
  @ApiProperty({ description: 'ID del negocio', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  negocioId: number;

  @ApiProperty({ description: 'ID del módulo', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  moduloId: number;

  @ApiProperty({ description: 'Array de costos validados', example: [] })
  @IsArray()
  @IsOptional()
  costosValidados?: any[];

  @ApiProperty({ description: 'Array de costos faltantes', example: [] })
  @IsArray()
  @IsOptional()
  costosFaltantes?: any[];

  @ApiProperty({ description: 'Resumen de la validación', example: {} })
  @IsObject()
  @IsOptional()
  resumenValidacion?: any;

  @ApiProperty({ description: 'Puntuación global (1-10)', example: 7 })
  @IsNumber()
  @IsOptional()
  puntuacionGlobal?: number;

  @ApiProperty({ description: 'Si puede proseguir al análisis', example: true })
  @IsBoolean()
  @IsNotEmpty()
  puedeProseguirAnalisis: boolean;
}
