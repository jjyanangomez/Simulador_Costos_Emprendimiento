// 🖥️ EJEMPLO: Cómo usar las funciones de impresión en consola
// Muestra todas las formas de imprimir datos del análisis de IA

import React from 'react';
import { 
  printAIAnalysisToConsole,
  printBusinessDataToConsole,
  printAIResultsToConsole,
  printCostSuggestionsToConsole,
  printBusinessMetricsToConsole,
  printDebugInfoToConsole,
  printAllDataToConsole,
  printDataAsJSON,
  showAIData
} from '../shared/utils/consoleLogger';
import { Terminal, FileText, Database, Calculator, BarChart3, Bug, Download } from 'lucide-react';

export function ConsoleLoggerExample() {
  
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🖥️ Imprimir Datos en Consola
        </h1>
        <p className="text-gray-600">
          Funciones para mostrar toda la información del análisis de IA en la consola del navegador
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Abre las DevTools (F12) → Console para ver los resultados
          </p>
        </div>
      </div>

      {/* Botones para funciones específicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <button
          onClick={showAIData}
          className="flex items-center justify-center p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Terminal className="w-5 h-5 mr-2" />
          <span className="font-medium">Análisis Completo</span>
        </button>

        <button
          onClick={printBusinessDataToConsole}
          className="flex items-center justify-center p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FileText className="w-5 h-5 mr-2" />
          <span className="font-medium">Solo Datos Negocio</span>
        </button>

        <button
          onClick={printAIResultsToConsole}
          className="flex items-center justify-center p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Database className="w-5 h-5 mr-2" />
          <span className="font-medium">Solo Análisis IA</span>
        </button>

        <button
          onClick={printCostSuggestionsToConsole}
          className="flex items-center justify-center p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Calculator className="w-5 h-5 mr-2" />
          <span className="font-medium">Sugerencias Costos</span>
        </button>

        <button
          onClick={printBusinessMetricsToConsole}
          className="flex items-center justify-center p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <BarChart3 className="w-5 h-5 mr-2" />
          <span className="font-medium">Métricas Negocio</span>
        </button>

        <button
          onClick={printDebugInfoToConsole}
          className="flex items-center justify-center p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Bug className="w-5 h-5 mr-2" />
          <span className="font-medium">Info Debug</span>
        </button>

        <button
          onClick={printDataAsJSON}
          className="flex items-center justify-center p-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          <span className="font-medium">Datos como JSON</span>
        </button>

        <button
          onClick={printAllDataToConsole}
          className="flex items-center justify-center p-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors md:col-span-2"
        >
          <Terminal className="w-5 h-5 mr-2" />
          <span className="font-medium">TODOS LOS DATOS</span>
        </button>
      </div>

      {/* Instrucciones */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📋 Instrucciones de Uso
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
            <div>
              <p className="font-medium text-gray-900">Abre las DevTools</p>
              <p className="text-sm text-gray-600">Presiona F12 o Ctrl+Shift+I (Cmd+Opt+I en Mac)</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
            <div>
              <p className="font-medium text-gray-900">Ve a la pestaña Console</p>
              <p className="text-sm text-gray-600">Haz clic en la pestaña "Console" en las DevTools</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
            <div>
              <p className="font-medium text-gray-900">Haz clic en cualquier botón</p>
              <p className="text-sm text-gray-600">Los datos se mostrarán organizados en la consola</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funciones disponibles desde consola */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🎯 Funciones Disponibles desde la Consola
        </h2>
        
        <p className="text-gray-600 mb-4">
          También puedes ejecutar estas funciones directamente desde la consola del navegador:
        </p>
        
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm space-y-1">
          <div><span className="text-yellow-400">// Análisis completo</span></div>
          <div>showAIData()</div>
          <div className="mt-3"><span className="text-yellow-400">// Datos específicos</span></div>
          <div>printBusinessData()</div>
          <div>printAIResults()</div>
          <div>printCostSuggestions()</div>
          <div>printBusinessMetrics()</div>
          <div className="mt-3"><span className="text-yellow-400">// Utilidades</span></div>
          <div>printDebugInfo()</div>
          <div>printDataAsJSON()</div>
          <div>printAllData()</div>
        </div>
      </div>

      {/* Qué se muestra en cada función */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📊 Qué Muestra Cada Función
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold text-blue-800 mb-2">🤖 Análisis Completo</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Datos básicos del negocio</li>
              <li>• Items de inversión</li>
              <li>• Resultado del análisis (viable/no viable)</li>
              <li>• Aspectos positivos</li>
              <li>• Advertencias y recomendaciones</li>
              <li>• Criterios de viabilidad</li>
              <li>• Resumen ejecutivo</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold text-green-800 mb-2">🏢 Solo Datos Negocio</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Nombre y categoría</li>
              <li>• Ubicación y sector</li>
              <li>• Capacidad y tamaño</li>
              <li>• Datos financieros</li>
              <li>• Tipo de financiamiento</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold text-purple-800 mb-2">🎯 Solo Análisis IA</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Resultado de viabilidad</li>
              <li>• Puntuación obtenida</li>
              <li>• Nivel de riesgo</li>
              <li>• Salud financiera</li>
              <li>• Recomendaciones específicas</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold text-orange-800 mb-2">💰 Sugerencias Costos</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Alquiler sugerido</li>
              <li>• Costo de personal estimado</li>
              <li>• Servicios básicos</li>
              <li>• Seguros</li>
              <li>• Total mensual</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold text-indigo-800 mb-2">📈 Métricas Negocio</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Estado de viabilidad actual</li>
              <li>• Días desde el análisis</li>
              <li>• Si necesita actualización</li>
              <li>• Resumen de puntuación</li>
            </ul>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-3">
            <h3 className="font-semibold text-red-800 mb-2">🔧 Info Debug</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Estado del almacenamiento</li>
              <li>• Tamaño de los datos</li>
              <li>• Claves de localStorage</li>
              <li>• Información técnica</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Ejemplo de salida */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          📄 Ejemplo de Salida en Consola
        </h2>
        
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto">
          <div className="text-yellow-400">🤖 ================== ANÁLISIS DE IA GENERADO ==================</div>
          <div className="text-blue-400">📊 DATOS DEL NEGOCIO:</div>
          <div className="ml-4">
            <div>Nombre del Negocio: "Mi Cafetería"</div>
            <div>Categoría: "cafeteria"</div>
            <div>Sector/Ubicación: "La Mariscal"</div>
            <div>Capacidad: "50 personas"</div>
            <div>Inversión Total: "$15,000"</div>
            <div>...</div>
          </div>
          <div className="text-blue-400 mt-2">🎯 RESULTADO DEL ANÁLISIS DE IA:</div>
          <div className="ml-4">
            <div>✅ Es Viable: SÍ</div>
            <div>📊 Puntuación: 85/100 puntos</div>
            <div>⚠️ Nivel de Riesgo: LOW</div>
            <div>💚 Salud Financiera: GOOD</div>
          </div>
          <div className="text-yellow-400 mt-2">================== FIN DEL ANÁLISIS DE IA ==================</div>
        </div>
      </div>
    </div>
  );
}
