import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAnalisisIADto {
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID del usuario del negocio', example: 1 })
  negocioId?: number;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ description: 'Fecha que ejecuto el analisis del negocio', example: '2025-08-20T09:00:00Z', required: false })
  fechaAnalisis?: Date;
}
