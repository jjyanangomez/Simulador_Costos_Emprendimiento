import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnalyzedCostResultDto {
  @ApiProperty({ description: 'Nombre del costo analizado', example: 'Costo de Marketing Digital', required: false })
  @IsString()
  @IsOptional()
  costName?: string;

  @ApiProperty({ description: 'Valor del costo reportado por el usuario', example: '$550', required: false })
  @IsString()
  @IsOptional()
  receivedValue?: string;

  @ApiProperty({ description: 'Rango estimado de valor para el costo', example: '$500 - $700', required: false })
  @IsString()
  @IsOptional()
  estimatedRange?: string;

  @ApiProperty({ description: 'Evaluación del valor del costo', example: 'En rango', required: false })
  @IsString()
  @IsOptional()
  evaluation?: string;

  @ApiProperty({ description: 'Comentario o recomendación sobre el costo', example: 'Se recomienda monitorear este costo trimestralmente.', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}