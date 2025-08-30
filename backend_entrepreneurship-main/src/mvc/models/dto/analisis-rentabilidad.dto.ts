import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CostoFijoAnalisisDto {
  @ApiProperty({ description: 'ID del costo fijo' })
  @IsNotEmpty({ message: 'El ID del costo fijo es requerido' })
  @IsNumber({}, { message: 'El ID debe ser un número' })
  id: number;

  @ApiProperty({ description: 'Monto mensual del costo fijo' })
  @IsNotEmpty({ message: 'El monto es requerido' })
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @IsPositive({ message: 'El monto debe ser positivo' })
  montoMensual: number;

  @ApiProperty({ description: 'Nombre del costo fijo' })
  nombre: string;
}

export class ProductoAnalisisDto {
  @ApiProperty({ description: 'ID del producto' })
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsNumber({}, { message: 'El ID debe ser un número' })
  id: number;

  @ApiProperty({ description: 'Nombre del producto' })
  nombre: string;

  @ApiProperty({ description: 'Costo variable por unidad' })
  @IsNotEmpty({ message: 'El costo variable es requerido' })
  @IsNumber({}, { message: 'El costo debe ser un número' })
  @IsPositive({ message: 'El costo debe ser positivo' })
  costoVariable: number;

  @ApiProperty({ description: 'Precio de venta por unidad' })
  @IsNotEmpty({ message: 'El precio de venta es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  precioVenta: number;

  @ApiProperty({ description: 'Volumen estimado de ventas mensual' })
  @IsNotEmpty({ message: 'El volumen de ventas es requerido' })
  @IsNumber({}, { message: 'El volumen debe ser un número' })
  @IsPositive({ message: 'El volumen debe ser positivo' })
  volumenVentas: number;
}

export class AnalisisRentabilidadDto {
  @ApiProperty({ description: 'ID del negocio a analizar' })
  @IsNotEmpty({ message: 'El ID del negocio es requerido' })
  @IsNumber({}, { message: 'El ID debe ser un número' })
  negocioId: number;

  @ApiProperty({ description: 'ID del módulo de análisis' })
  @IsNotEmpty({ message: 'El ID del módulo es requerido' })
  @IsNumber({}, { message: 'El ID debe ser un número' })
  moduloId: number;

  @ApiProperty({ description: 'Array de costos fijos para el análisis' })
  @IsArray({ message: 'Los costos fijos deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => CostoFijoAnalisisDto)
  costosFijos: CostoFijoAnalisisDto[];

  @ApiProperty({ description: 'Array de productos para el análisis' })
  @IsArray({ message: 'Los productos deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => ProductoAnalisisDto)
  productos: ProductoAnalisisDto[];

  @ApiPropertyOptional({ description: 'Capacidad mensual del negocio' })
  @IsOptional()
  @IsNumber({}, { message: 'La capacidad debe ser un número' })
  @IsPositive({ message: 'La capacidad debe ser positiva' })
  capacidadMensual?: number;

  @ApiPropertyOptional({ description: 'Inversión inicial del negocio' })
  @IsOptional()
  @IsNumber({}, { message: 'La inversión debe ser un número' })
  @IsPositive({ message: 'La inversión debe ser positiva' })
  inversionInicial?: number;

  @ApiPropertyOptional({ description: 'Margen de beneficio objetivo (%)' })
  @IsOptional()
  @IsNumber({}, { message: 'El margen debe ser un número' })
  @IsPositive({ message: 'El margen debe ser positivo' })
  margenObjetivo?: number;
}
