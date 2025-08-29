import { IsNotEmpty, IsNumber  } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBusinessProgressStepDto {
  @ApiProperty({ description: 'ID del negocio al que se le asigna el progreso', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  businessId: number;

  @ApiProperty({ description: 'ID del módulo que se está registrando', example: 5 })
  @IsNumber()
  @IsNotEmpty()
  moduleId: number;

  @ApiProperty({ description: 'ID del estado inicial del progreso (ej. 1: "No Iniciado")', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  statusId: number;
}

