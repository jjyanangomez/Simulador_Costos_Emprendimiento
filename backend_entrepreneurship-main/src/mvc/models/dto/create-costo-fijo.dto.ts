import { IsNotEmpty, IsNumber, IsString, IsOptional, IsDecimal, Min } from 'class-validator';

export class CreateCostoFijoDto {
  @IsNotEmpty({ message: 'El ID del negocio es requerido' })
  @IsNumber({}, { message: 'El ID del negocio debe ser un número' })
  negocioId: number;

  @IsNotEmpty({ message: 'El ID del tipo de costo es requerido' })
  @IsNumber({}, { message: 'El ID del tipo de costo debe ser un número' })
  tipoCostoId: number;

  @IsNotEmpty({ message: 'El nombre del costo es requerido' })
  @IsString({ message: 'El nombre del costo debe ser una cadena de texto' })
  nombre: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsDecimal({}, { message: 'El monto debe ser un número decimal válido' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  monto: number;

  @IsNotEmpty({ message: 'La frecuencia es requerida' })
  @IsString({ message: 'La frecuencia debe ser una cadena de texto' })
  frecuencia: string;
}
