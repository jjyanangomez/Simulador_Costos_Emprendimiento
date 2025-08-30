import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCostoFijoDto {
  @ApiProperty({ description: 'ID del negocio al que pertenece el costo' })
  @IsNotEmpty({ message: 'El ID del negocio es requerido' })
  @IsNumber({}, { message: 'El ID del negocio debe ser un número' })
  negocioId: number;

  @ApiProperty({ description: 'ID del tipo de costo' })
  @IsNotEmpty({ message: 'El tipo de costo es requerido' })
  @IsNumber({}, { message: 'El tipo de costo debe ser un número' })
  tipoCostoId: number;

  @ApiProperty({ description: 'Nombre del costo fijo' })
  @IsNotEmpty({ message: 'El nombre del costo es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción opcional del costo' })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @ApiProperty({ description: 'Monto del costo' })
  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  monto: number;

  @ApiProperty({ 
    description: 'Frecuencia del pago',
    enum: ['mensual', 'semestral', 'anual']
  })
  @IsNotEmpty({ message: 'La frecuencia es requerida' })
  @IsEnum(['mensual', 'semestral', 'anual'], { 
    message: 'La frecuencia debe ser: mensual, semestral o anual' 
  })
  frecuencia: string;

  @ApiPropertyOptional({ description: 'Fecha de inicio del costo' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener un formato válido' })
  fechaInicio?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin del costo (opcional)' })
  @IsOptional()
  @IsDateString({}, { message: 'La fecha debe tener un formato válido' })
  fechaFin?: string;

  @ApiPropertyOptional({ description: 'Indica si el costo está activo', default: true })
  @IsOptional()
  activo?: boolean;
}
