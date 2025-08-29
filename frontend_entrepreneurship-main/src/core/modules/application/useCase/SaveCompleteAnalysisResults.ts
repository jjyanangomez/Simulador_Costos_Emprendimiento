import { CompleteAnalysisRepositoryApi, type CompleteAnalysisResult, type SaveCompleteAnalysisRequest } from '../../infrastructure/adapters/CompleteAnalysisRepositoryApi';

export class SaveCompleteAnalysisResults {
  private readonly repository: CompleteAnalysisRepositoryApi;

  constructor(repository: CompleteAnalysisRepositoryApi) {
    this.repository = repository;
  }

  async execute(data: SaveCompleteAnalysisRequest): Promise<CompleteAnalysisResult> {
    console.log('💾 [FRONTEND-USE-CASE] Ejecutando guardado de análisis completo');
    
    try {
      // Intentar primero con el endpoint principal
      const result = await this.repository.saveCompleteAnalysis(data);
      console.log('✅ [FRONTEND-USE-CASE] Análisis guardado exitosamente');
      return result;
    } catch (error) {
      console.log('⚠️ [FRONTEND-USE-CASE] Error con endpoint principal, intentando alternativo:', error);
      
      try {
        // Si falla, intentar con el endpoint alternativo
        const result = await this.repository.saveCompleteAnalysisAlternative(data);
        console.log('✅ [FRONTEND-USE-CASE] Análisis guardado exitosamente (endpoint alternativo)');
        return result;
      } catch (alternativeError) {
        console.error('❌ [FRONTEND-USE-CASE] Error con ambos endpoints:', alternativeError);
        throw new Error('No se pudo guardar el análisis completo. Por favor, intente nuevamente.');
      }
    }
  }
}
