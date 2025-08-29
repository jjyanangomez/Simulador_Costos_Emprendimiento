import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDetectedRiskResultDto {
  @ApiProperty({ description: 'Descripción del riesgo detectado', example: 'Riesgo de ciberseguridad', required: false })
  @IsString()
  @IsOptional()
  risk?: string;

  @ApiProperty({ description: 'Causa directa del riesgo', example: 'Falta de protocolos de seguridad', required: false })
  @IsString()
  @IsOptional()
  directCause?: string;

  @ApiProperty({ description: 'Impacto potencial del riesgo en el negocio', example: 'Pérdida de datos sensibles y daño a la reputación', required: false })
  @IsString()
  @IsOptional()
  potentialImpact?: string;
}