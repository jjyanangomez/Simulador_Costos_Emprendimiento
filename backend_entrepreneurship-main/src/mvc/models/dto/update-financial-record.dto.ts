import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFinancialRecordDto {
  @ApiProperty({ description: 'ID del negocio al que pertenece este registro', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  businessId: number;

  @ApiProperty({ description: 'ID del módulo asociado a este registro', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  moduleId: number;
  
  @ApiProperty({ description: 'El nuevo nombre o concepto del registro', example: 'Compra de insumos y materia prima' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({ description: 'El nuevo monto del registro', example: 600.50 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;
}