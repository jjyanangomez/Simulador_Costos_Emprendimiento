// src/simulator/learning/domain/entities/learning.entity.ts


import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLearningDto {
  @ApiProperty({
    description: 'Nombre de la ruta de aprendizaje',
    example: 'Fundamentos de Finanzas para Emprendedores',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Número total de niveles o módulos en esta ruta',
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  totalLevels: number;
}

