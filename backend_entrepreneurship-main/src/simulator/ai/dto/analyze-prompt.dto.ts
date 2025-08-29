import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzePromptDto {
  @ApiProperty({
    description: 'El texto del prompt para la IA',
    example: 'Analiza mis gastos de marketing y sugiere mejoras.',
  })
  @IsString()
  @IsNotEmpty()
  prompt: string;
}