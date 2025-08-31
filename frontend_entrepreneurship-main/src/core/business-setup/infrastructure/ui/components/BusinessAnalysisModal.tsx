
import { 
  X, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw,
  Building2
} from 'lucide-react';

interface AIAnalysis {
  isViable: boolean;
  score: number;
  recommendations: string[];
  warnings: string[];
  businessInsights: string[];
  financialHealth: 'good' | 'fair' | 'poor';
  riskLevel: 'low' | 'medium' | 'high';
}

interface BusinessAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessData: any;
  aiAnalysis: AIAnalysis | null;
  isAnalyzing: boolean;
  onContinue: () => void;
}

export function BusinessAnalysisModal({
  isOpen,
  onClose,
  businessData,
  aiAnalysis,
  isAnalyzing,
  onContinue
}: BusinessAnalysisModalProps) {
  if (!isOpen) return null;

  const totalInvestment = businessData?.investmentItems?.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0) || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full h-[95vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold">🤖</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Análisis Inteligente de Negocio</h2>
                <p className="text-blue-100">Evaluación completa de tu propuesta empresarial</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido principal - TODO EN UNA SOLA SECCIÓN ORDENADA */}
        <div className="flex-1 overflow-y-auto">
          {isAnalyzing ? (
            // Estado de carga
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <RefreshCw className="w-8 h-8 text-white animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analizando tu negocio...
              </h3>
              <p className="text-gray-600 mb-4">
                Nuestra IA está evaluando todos los aspectos de tu propuesta empresarial
              </p>
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : aiAnalysis ? (
            <div className="space-y-0">
              {/* 1. RESUMEN DEL NEGOCIO */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  📋 Resumen de tu Negocio
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-gray-600 block font-medium">Nombre:</span>
                    <p className="font-bold text-gray-800">{businessData.businessName}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-gray-600 block font-medium">Ubicación:</span>
                    <p className="font-bold text-gray-800">{businessData.sector}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-gray-600 block font-medium">Categoría:</span>
                    <p className="font-bold text-gray-800">{businessData.businessCategory}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-gray-600 block font-medium">Capacidad:</span>
                    <p className="font-bold text-gray-800">{businessData.capacity} personas</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-gray-600 block font-medium">Inversión:</span>
                    <p className="font-bold text-gray-800">${totalInvestment.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <span className="text-gray-600 block font-medium">Financiamiento:</span>
                    <p className="font-bold text-gray-800">{businessData.financingType}</p>
                  </div>
                </div>
              </div>

              {/* 2. RESULTADO DEL ANÁLISIS */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  🎯 Resultado del Análisis de IA
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Estado del Negocio - Centro */}
                  <div className="md:col-span-1 flex justify-center">
                    <div className={`p-6 rounded-xl border-2 w-full max-w-sm ${
                      aiAnalysis.isViable ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center justify-center mb-2">
                        {aiAnalysis.isViable ? (
                          <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                        ) : (
                          <AlertTriangle className="w-8 h-8 text-red-600 mr-3" />
                        )}
                        <span className={`font-black text-xl ${
                          aiAnalysis.isViable ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {aiAnalysis.isViable ? 'Negocio Viable' : 'Negocio No Viable'}
                        </span>
                      </div>
                      <p className={`text-center text-sm ${
                        aiAnalysis.isViable ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {aiAnalysis.isViable 
                          ? 'Tu propuesta cumple con los criterios de viabilidad'
                          : 'Se requieren ajustes para mejorar la viabilidad'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Indicadores de Riesgo */}
                  <div className="md:col-span-2 grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg text-center ${
                      aiAnalysis.riskLevel === 'low' ? 'bg-green-100 text-green-800 border border-green-200' :
                      aiAnalysis.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      <span className="font-bold block text-sm">Nivel de Riesgo</span>
                      <p className="text-lg font-black mt-1">
                        {aiAnalysis.riskLevel === 'low' ? '🟢 BAJO' : 
                         aiAnalysis.riskLevel === 'medium' ? '🟡 MEDIO' : '🔴 ALTO'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${
                      aiAnalysis.financialHealth === 'good' ? 'bg-green-100 text-green-800 border border-green-200' :
                      aiAnalysis.financialHealth === 'fair' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      <span className="font-bold block text-sm">Salud Financiera</span>
                      <p className="text-lg font-black mt-1">
                        {aiAnalysis.financialHealth === 'good' ? '💚 BUENA' : 
                         aiAnalysis.financialHealth === 'fair' ? '💛 REGULAR' : '❤️ MALA'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. DETALLES DEL ANÁLISIS */}
              <div className="bg-white p-6 border-b">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  📊 Detalles del Análisis
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Aspectos Positivos */}
                  {aiAnalysis.businessInsights.length > 0 && (
                    <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-400">
                      <h4 className="font-bold text-green-800 mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        ✅ Aspectos Positivos
                      </h4>
                      <ul className="space-y-2">
                        {aiAnalysis.businessInsights.map((insight, index) => (
                          <li key={index} className="text-sm text-green-700 flex items-start font-medium">
                            <span className="text-green-500 mr-2 mt-1 font-bold">•</span>
                            {insight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Advertencias */}
                  {aiAnalysis.warnings.length > 0 && (
                    <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-400">
                      <h4 className="font-bold text-yellow-800 mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        ⚠️ Advertencias
                      </h4>
                      <ul className="space-y-2">
                        {aiAnalysis.warnings.map((warning, index) => (
                          <li key={index} className="text-sm text-yellow-700 flex items-start font-medium">
                            <span className="text-yellow-500 mr-2 mt-1 font-bold">•</span>
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Recomendaciones - Ancho completo */}
                {aiAnalysis.recommendations.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400 mt-6">
                    <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      💡 Recomendaciones de Mejora
                    </h4>
                    <ul className="space-y-2">
                      {aiAnalysis.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm text-blue-700 flex items-start font-medium">
                          <span className="text-blue-500 mr-2 mt-1 font-bold">•</span>
                          {recommendation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 4. CONCLUSIÓN FINAL */}
              <div className={`p-6 ${
                aiAnalysis.isViable ? 'bg-gradient-to-r from-green-50 to-green-100' : 'bg-gradient-to-r from-red-50 to-red-100'
              }`}>
                <div className={`text-center p-6 rounded-2xl shadow-lg border-2 ${
                  aiAnalysis.isViable ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'
                }`}>
                  <h3 className={`text-3xl font-black mb-3 ${
                    aiAnalysis.isViable ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {aiAnalysis.isViable ? '🎉 ¡NEGOCIO VIABLE!' : '⚠️ NEGOCIO NO VIABLE'}
                  </h3>
                  <p className={`text-xl font-bold ${
                    aiAnalysis.isViable ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {aiAnalysis.isViable 
                      ? 'Tu propuesta de negocio es viable. ¡Continúa al siguiente paso!'
                      : 'Tu negocio necesita mejoras. Ajusta la configuración e intenta nuevamente.'
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Estado sin análisis
            <div className="text-center py-8">
              <p className="text-gray-600">No hay análisis disponible</p>
            </div>
          )}
        </div>

                 {/* FOOTER FIJO CON BOTÓN PRINCIPAL */}
         <div className="border-t bg-white p-4 flex-shrink-0">
           {aiAnalysis ? (
             <div className="flex justify-end">
               {/* Botón principal */}
               {aiAnalysis.isViable ? (
                 // 🟢 BOTÓN VERDE
                 <button
                   type="button"
                   onClick={onContinue}
                   className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center space-x-2 font-semibold text-sm shadow-lg hover:shadow-xl"
                 >
                   <CheckCircle className="w-4 h-4" />
                   <span>Continuar a Costos Fijos</span>
                   <TrendingUp className="w-4 h-4" />
                 </button>
               ) : (
                 // 🔴 BOTÓN ROJO
                 <button
                   type="button"
                   onClick={onClose}
                   className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center space-x-2 font-semibold text-sm shadow-lg hover:shadow-xl"
                 >
                   <AlertTriangle className="w-4 h-4" />
                   <span>Regresar y Ajustar</span>
                 </button>
               )}
             </div>
           ) : (
             // Estado sin análisis
             <div className="flex justify-end">
               <button
                 type="button"
                 onClick={onClose}
                 className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
               >
                 Cerrar Modal
               </button>
             </div>
           )}
         </div>
      </div>
    </div>
  );
}
