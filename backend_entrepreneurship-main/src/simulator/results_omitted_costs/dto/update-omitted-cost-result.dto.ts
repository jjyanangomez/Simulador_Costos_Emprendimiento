import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOmittedCostResultDto {
  @ApiProperty({ description: 'Nombre del costo que se ha omitido', example: 'Licencias de software', required: false })
  @IsString()
  @IsOptional()
  omittedCost?: string;

  @ApiProperty({ description: 'Nivel de importancia del costo omitido', example: 'Media', required: false })
  @IsString()
  @IsOptional()
  importance?: string;
}