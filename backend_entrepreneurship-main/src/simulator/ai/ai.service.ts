import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('API_KEY no está configurada.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async analyzePrompt(prompt: string, timeoutMs: number = 30000): Promise<string> {
    try {
      console.log(`🤖 [AI-SERVICE] Iniciando análisis con timeout de ${timeoutMs}ms`);
      
      // Crear una promesa con timeout
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La IA tardó demasiado en responder')), timeoutMs);
      });
      
      // Promesa para la llamada a la IA
      const aiPromise = this.model.generateContent(prompt).then(result => result.response.text());
      
      // Competir entre timeout y respuesta de IA
      const response = await Promise.race([aiPromise, timeoutPromise]) as string;
      
      console.log(`✅ [AI-SERVICE] Respuesta recibida en tiempo`);
      return response;
    } catch (error) {
      console.error('❌ [AI-SERVICE] Error al generar contenido:', error);
      throw new InternalServerErrorException(`Error interno al generar contenido: ${error.message}`);
    }
  }
}