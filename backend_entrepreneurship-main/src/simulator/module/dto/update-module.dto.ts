import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateModuleDto {
  @ApiProperty({ description: 'Nuevo ID de la ruta de aprendizaje', required: false })
  @IsNumber()
  @IsOptional()
  learningId?: number;

  @ApiProperty({ description: 'Nuevo nombre del módulo', required: false })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  moduleName?: string;

  @ApiProperty({ description: 'Nuevo orden del módulo', required: false })
  @IsNumber()
  @IsOptional()
  moduleOrder?: number;

  @ApiProperty({ description: 'Nuevo título del contenido', required: false })
  @IsString()
  @IsOptional()
  contentTitle?: string;

  @ApiProperty({ description: 'Nuevo concepto del módulo', required: false })
  @IsString()
  @IsOptional()
  concept?: string;

  @ApiProperty({ description: 'Nueva URL del recurso interactivo', required: false })
  @IsString()
  @IsOptional()
  interactiveResource?: string;
}