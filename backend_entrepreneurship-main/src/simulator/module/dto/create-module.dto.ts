import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModuleDto {
  @ApiProperty({ description: 'ID de la ruta de aprendizaje a la que pertenece este módulo', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  learningId: number;

  @ApiProperty({ description: 'Nombre del módulo', example: 'Introducción a las Finanzas', maxLength: 150 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  moduleName: string;

  @ApiProperty({ description: 'El orden numérico del módulo en la ruta de aprendizaje', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  moduleOrder?: number;

  @ApiProperty({ description: 'Título principal del contenido del módulo', example: '¿Qué son los costos fijos?', required: false })
  @IsString()
  @IsOptional()
  contentTitle?: string;

  @ApiProperty({ description: 'El concepto o teoría principal del módulo', required: false })
  @IsString()
  @IsOptional()
  concept?: string;

  @ApiProperty({ description: 'URL a un recurso interactivo (video, PDF, etc.)', required: false })
  @IsString()
  @IsOptional()
  interactiveResource?: string;
}

