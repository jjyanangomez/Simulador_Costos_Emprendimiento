import { CompleteAnalysisRepositoryApi, type CompleteAnalysisResult } from '../../infrastructure/adapters/CompleteAnalysisRepositoryApi';

export class GetCompleteAnalysisResults {
  private readonly repository: CompleteAnalysisRepositoryApi;

  constructor(repository: CompleteAnalysisRepositoryApi) {
    this.repository = repository;
  }

  async execute(negocioId: number, moduloId: number): Promise<CompleteAnalysisResult | null> {
    console.log(`🔍 [FRONTEND-USE-CASE] Obteniendo análisis completo para negocio ${negocioId} y módulo ${moduloId}`);
    
    try {
      // Intentar primero con el endpoint principal
      const result = await this.repository.getCompleteAnalysis(negocioId, moduloId);
      
      if (result) {
        console.log('✅ [FRONTEND-USE-CASE] Análisis obtenido exitosamente');
        return result;
      }
      
      console.log('⚠️ [FRONTEND-USE-CASE] No se encontró resultado con endpoint principal, intentando alternativo');
      
      // Si no encuentra, intentar con el endpoint alternativo
      const alternativeResult = await this.repository.getCompleteAnalysisAlternative(negocioId, moduloId);
      
      if (alternativeResult) {
        console.log('✅ [FRONTEND-USE-CASE] Análisis obtenido exitosamente (endpoint alternativo)');
        return alternativeResult;
      }
      
      console.log('❌ [FRONTEND-USE-CASE] No se encontraron resultados en ningún endpoint');
      return null;
      
    } catch (error) {
      console.error('❌ [FRONTEND-USE-CASE] Error al obtener análisis:', error);
      throw new Error('No se pudo obtener el análisis completo. Por favor, intente nuevamente.');
    }
  }
}
