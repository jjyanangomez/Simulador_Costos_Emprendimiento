import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFinancialRecordDto {
  @ApiProperty({ description: 'ID del negocio al que pertenece este registro', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  businessId: number;

  @ApiProperty({ description: 'ID del módulo de aprendizaje asociado a este registro', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  moduleId: number;

  @ApiProperty({ description: 'Nombre o concepto del registro financiero', example: 'Compra de materia prima' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ description: 'Monto del registro. No puede ser negativo.', example: 549.99 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;
}

