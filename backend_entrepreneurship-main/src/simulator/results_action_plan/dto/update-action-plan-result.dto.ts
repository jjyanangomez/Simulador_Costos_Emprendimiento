import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateActionPlanResultDto {
  @ApiProperty({ description: 'Título del plan de acción', example: 'Expandir la presencia online', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Descripción detallada de la acción', example: 'Crear perfiles en redes sociales relevantes y publicar contenido regularmente.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Nivel de prioridad del plan de acción', example: 'Media', required: false })
  @IsString()
  @IsOptional()
  priority?: string;
}