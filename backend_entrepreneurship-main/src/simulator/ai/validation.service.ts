import { Injectable } from '@nestjs/common';
import { AiService } from './ai.service';
import { PromptService } from './prompt.service';

@Injectable()
export class ValidationService {
  constructor(
    private readonly aiService: AiService,
    private readonly promptService: PromptService,
  ) {}

  /**
   * Valida los costos de forma rápida (2-3 segundos)
   */
  async validateCosts(
    costs: Array<{ name: string; amount: string }>,
    businessInfo: { tipoNegocio: string; tamano: string; ubicacion: string }
  ) {
    try {
      console.log('🔍 [VALIDATION-SERVICE] Iniciando validación...');
      
      // Generar prompt optimizado para validación rápida
      const prompt = this.promptService.generateValidationPrompt(costs, businessInfo);
      
      console.log('📝 [VALIDATION-SERVICE] Prompt generado: ', prompt, ' llamando a IA...');
      
      // Llamar a la IA con timeout más corto para validación rápida
      const response = await this.aiService.analyzePrompt(prompt, 30000); // 30 segundos timeout
      
      console.log('✅ [VALIDATION-SERVICE] Respuesta de IA recibida');
      
      // Parsear la respuesta JSON
      const parsedResponse = this.parseAiResponse(response);
      
      console.log('🔄 [VALIDATION-SERVICE] Respuesta parseada:', parsedResponse);
      
      return {
        success: true,
        data: parsedResponse,
        timestamp: new Date().toISOString(),
        duration: 'rapid_validation'
      };
      
    } catch (error) {
      console.error('💥 [VALIDATION-SERVICE] Error en validación:', error);
      
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        duration: 'rapid_validation_failed'
      };
    }
  }

  /**
   * Parsea la respuesta de la IA para extraer el JSON
   */
  private parseAiResponse(response: string): any {
    try {
      // Intentar extraer JSON del response
      const jsonMatch = response.match(/```(?:json)?([\s\S]*?)```/);
      const jsonString = jsonMatch ? jsonMatch[1] : response;
      
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('💥 [VALIDATION-SERVICE] Error parseando respuesta:', error);
      throw new Error('Respuesta de IA no válida');
    }
  }

  /**
   * Valida si los costos pasan la validación básica
   */
  isValidationSuccessful(validationResult: any): boolean {
    try {
      return validationResult?.resumen_validacion?.puede_proseguir_analisis === true;
    } catch (error) {
      console.error('💥 [VALIDATION-SERVICE] Error validando resultado:', error);
      return false;
    }
  }
}
