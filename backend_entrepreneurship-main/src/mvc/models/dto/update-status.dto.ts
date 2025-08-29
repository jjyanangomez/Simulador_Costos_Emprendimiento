import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateStatusDto {
  @ApiProperty({
    description: 'El nuevo nombre para el estado de progreso',
    example: 'Completado',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  statusName: string;
}