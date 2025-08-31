import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

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
  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  @Transform(({ value }) => {
    // Asegurar que el valor sea un número válido
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    return isNaN(num) ? value : num;
  })
  monto: number;

  @IsNotEmpty({ message: 'La frecuencia es requerida' })
  @IsString({ message: 'La frecuencia debe ser una cadena de texto' })
  frecuencia: string;
}
