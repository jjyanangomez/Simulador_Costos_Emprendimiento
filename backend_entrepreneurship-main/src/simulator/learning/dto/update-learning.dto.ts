import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateLearningDto {
  @ApiProperty({
    description: 'El nuevo nombre para la ruta de aprendizaje',
    example: 'Finanzas Avanzadas para Emprendedores',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'El nuevo número total de niveles en la ruta',
    example: 7,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  totalLevels?: number;
}