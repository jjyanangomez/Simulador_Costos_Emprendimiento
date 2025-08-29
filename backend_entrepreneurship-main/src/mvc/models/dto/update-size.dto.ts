import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateSizeDto {
  @ApiProperty({
    description: 'El nuevo nombre para el tamaño del negocio',
    example: 'Mediano (11-50 empleados)',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sizeName: string;
}