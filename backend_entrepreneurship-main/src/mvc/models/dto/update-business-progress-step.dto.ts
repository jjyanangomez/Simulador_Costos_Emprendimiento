import { IsNotEmpty, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBusinessProgressStepDto {
  @ApiProperty({ description: 'ID del estado actualizado del progreso', example: 2, required: false })
  @IsNumber()
  @IsOptional()
  statusId?: number;

  @ApiProperty({ description: 'Fecha de inicio del módulo (formato ISO 8601)', example: '2025-08-20T09:00:00Z', required: false })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ description: 'Fecha de finalización del módulo (formato ISO 8601)', example: '2025-08-25T17:30:00Z', required: false })
  @IsDateString()
  @IsOptional()
  completionDate?: string;
}