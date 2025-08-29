import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AiService } from '../services/ai.service';
import { AnalyzePromptDto } from '../models/dto/analyze-prompt.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analizar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analiza un prompt con la IA de Gemini' })
  @ApiResponse({ status: 200, description: 'Respuesta de la IA generada con éxito.', type: String })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async analyzePrompt(@Body() { prompt }: AnalyzePromptDto) {
    const responseText = await this.aiService.analyzePrompt(prompt);
    return { respuesta: responseText };
  }
}

