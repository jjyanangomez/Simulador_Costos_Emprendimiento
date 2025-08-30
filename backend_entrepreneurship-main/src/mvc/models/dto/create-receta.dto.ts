import { IsNotEmpty, IsString, IsNumber, IsOptional, IsPositive, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRecetaDto {
  @ApiProperty({ description: 'ID del producto al que pertenece la receta' })
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsNumber({}, { message: 'El ID del producto debe ser un número' })
  productoId: number;

  @ApiProperty({ description: 'Nombre de la receta' })
  @IsNotEmpty({ message: 'El nombre de la receta es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombreReceta: string;

  @ApiPropertyOptional({ description: 'Tiempo de preparación en minutos' })
  @IsOptional()
  @IsInt({ message: 'El tiempo debe ser un número entero' })
  @Min(1, { message: 'El tiempo debe ser mayor a 0' })
  @Max(480, { message: 'El tiempo no puede exceder 8 horas' })
  tiempoPreparacion?: number;

  @ApiPropertyOptional({ description: 'Cantidad de personal requerido' })
  @IsOptional()
  @IsInt({ message: 'El personal requerido debe ser un número entero' })
  @Min(1, { message: 'Se requiere al menos 1 persona' })
  @Max(20, { message: 'El personal requerido no puede exceder 20 personas' })
  personalRequerido?: number;

  @ApiPropertyOptional({ description: 'Costos adicionales de la receta' })
  @IsOptional()
  @IsNumber({}, { message: 'Los costos adicionales deben ser un número' })
  @IsPositive({ message: 'Los costos adicionales deben ser positivos' })
  costosAdicionales?: number;

  @ApiProperty({ description: 'Precio de venta de la receta' })
  @IsNotEmpty({ message: 'El precio de venta es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  precioVenta: number;
}
