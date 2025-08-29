import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActionPlanResultDto {
  @ApiProperty({ description: 'ID del análisis de IA al que pertenece el resultado', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  analisisId: number;

  @ApiProperty({ description: 'Título del plan de acción', example: 'Optimizar gastos de marketing' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ description: 'Descripción detallada de la acción a seguir', example: 'Revisar las campañas publicitarias de bajo rendimiento y reasignar el presupuesto a canales más efectivos.' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ description: 'Nivel de prioridad del plan de acción (ej. "Alta", "Media", "Baja")', example: 'Alta' })
  @IsString()
  @IsNotEmpty()
  prioridad: string;
}