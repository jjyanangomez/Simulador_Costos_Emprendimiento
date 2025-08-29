import React from "react";
// Import removido - no se usa

interface Props {
  data: any; // Cambiado para manejar la nueva estructura
}

// Función helper para convertir valores a string de forma segura
const safeString = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return '[Objeto]';
    }
  }
  return String(value);
};

// Función helper para validar si un valor es renderizable
const isRenderable = (value: any): boolean => {
  return value !== null && value !== undefined && 
         (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean');
};

export const FinalAnalysisResultDisplay: React.FC<Props> = ({ data }) => {
  // Debug: Log de datos recibidos
  console.log('🔍 [FinalAnalysisResultDisplay] Datos recibidos:', data);
  console.log('🔍 [FinalAnalysisResultDisplay] Estructura de datos:', {
    validation: data.validation,
    analysis: data.analysis,
    final: data.final
  });
  
  // Extraer datos de la nueva estructura
  // const validationData = data.validation?.data || {}; // Variable no utilizada
  const analysisData = data.analysis?.data || {};
  const finalData = data.final?.data || {};
  
  // Datos de análisis detallado
  const analisisCostos = analysisData.analisis_costos || {};
  const riesgosIdentificados = analysisData.riesgos_identificados || [];
  const planAccion = finalData.plan_accion || {};

  return (
    <div className="space-y-8">
      {/* ===================== */}
      {/* Título Principal */}
      {/* ===================== */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Resultados del Análisis
        </h1>
      </div>

      {/* ===================== */}
      {/* 1. Análisis Comparativo de Mercado */}
      {/* ===================== */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📊 Análisis Comparativo de Mercado
        </h2>
        <div className="space-y-6">
          {analisisCostos && Object.keys(analisisCostos).length > 0 ? (
            Object.entries(analisisCostos).map(([nombre, detalle]: [string, any]) => (
              <div
                key={nombre}
                className="bg-white p-6 rounded-lg shadow border border-gray-200"
              >
                <h3 className="text-xl font-semibold text-blue-800 mb-4">
                  {safeString(nombre)}
                </h3>
                
                {detalle && typeof detalle === 'object' && (
                  <div className="space-y-3">
                    {detalle.valor_recibido && isRenderable(detalle.valor_recibido) && (
                      <p className="text-gray-700">
                        <strong>Valor recibido:</strong> ${safeString(detalle.valor_recibido)}
                      </p>
                    )}
                    
                    {detalle.rango_estimado_zona_especifica && isRenderable(detalle.rango_estimado_zona_especifica) ? (
                      <p className="text-gray-700">
                        <strong>Rango estimado:</strong> {safeString(detalle.rango_estimado_zona_especifica)}
                      </p>
                    ) : (
                      <p className="text-gray-700">
                        <strong>Rango estimado:</strong> undefined
                      </p>
                    )}
                    
                    {detalle.evaluacion && isRenderable(detalle.evaluacion) && (
                      <p className="text-gray-700">
                        <strong>Evaluación:</strong>{" "}
                        <span
                          className={
                            safeString(detalle.evaluacion) === "Dentro del rango"
                              ? "text-green-600 font-semibold"
                              : "text-red-600 font-semibold"
                          }
                        >
                          {safeString(detalle.evaluacion) === "Dentro del rango" ? "✅ " : "⚠️ "}
                          {safeString(detalle.evaluacion)}
                        </span>
                      </p>
                    )}
                    
                    {detalle.analisis && isRenderable(detalle.analisis) && (
                      <div className="mt-4">
                        <p className="text-gray-700">
                          <strong>Análisis:</strong> {safeString(detalle.analisis)}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-center">No hay datos de análisis comparativo disponibles</p>
            </div>
          )}
        </div>
      </div>

      {/* ===================== */}
      {/* 2. Análisis de Riesgos Operativos */}
      {/* ===================== */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          ⚠️ Análisis de Riesgos Operativos
        </h2>
        <div className="space-y-6">
          {riesgosIdentificados && riesgosIdentificados.length > 0 ? (
            riesgosIdentificados.map((riesgo: any, idx: number) => (
              <div
                key={idx}
                className="bg-red-50 border border-red-200 p-6 rounded-lg shadow"
              >
                {riesgo.nombre && isRenderable(riesgo.nombre) && (
                  <h3 className="text-xl font-semibold text-red-800 mb-4">
                    🚨 {safeString(riesgo.nombre)}
                  </h3>
                )}
                
                <div className="space-y-3">
                  {riesgo.causa && isRenderable(riesgo.causa) && (
                    <div>
                      <strong className="text-red-800">Causa:</strong>{" "}
                      <span className="text-gray-700">{safeString(riesgo.causa)}</span>
                    </div>
                  )}
                  
                  {riesgo.probabilidad && isRenderable(riesgo.probabilidad) && (
                    <div>
                      <strong className="text-red-800">Probabilidad:</strong>{" "}
                      <span className="text-gray-700">{safeString(riesgo.probabilidad)}</span>
                    </div>
                  )}
                  
                  {riesgo.impacto && isRenderable(riesgo.impacto) && (
                    <div>
                      <strong className="text-red-800">Impacto:</strong>{" "}
                      <span className="text-gray-700">{safeString(riesgo.impacto)}</span>
                    </div>
                  )}
                  
                  {riesgo.consecuencias && isRenderable(riesgo.consecuencias) && (
                    <div>
                      <strong className="text-red-800">Consecuencias:</strong>{" "}
                      <span className="text-gray-700">{safeString(riesgo.consecuencias)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-center">No se identificaron riesgos críticos</p>
            </div>
          )}
        </div>
      </div>

      {/* ===================== */}
      {/* 3. Plan de Acción y Optimización */}
      {/* ===================== */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🎯 Plan de Acción y Optimización
        </h2>
        <div className="space-y-6">
          {planAccion && Object.keys(planAccion).length > 0 ? (
            Object.entries(planAccion).map(([categoria, acciones]: [string, any], idx: number) => {
              if (!Array.isArray(acciones) || acciones.length === 0) return null;
              
              return (
                <div key={idx} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-4">
                    📌 {safeString(categoria)}
                  </h3>
                  <div className="space-y-4">
                    {acciones.map((accion: any, accionIdx: number) => (
                      <div key={accionIdx} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        {typeof accion === 'string' ? (
                          <p className="text-gray-700">{safeString(accion)}</p>
                        ) : (
                          <div className="space-y-2">
                            {accion.descripcion && isRenderable(accion.descripcion) && (
                              <p className="text-gray-700">{safeString(accion.descripcion)}</p>
                            )}
                            {accion.prioridad && isRenderable(accion.prioridad) && (
                              <p className="text-sm text-gray-600">
                                <strong>Prioridad:</strong> {safeString(accion.prioridad)}
                              </p>
                            )}
                            {accion.plazo && isRenderable(accion.plazo) && (
                              <p className="text-sm text-gray-600">
                                <strong>Plazo:</strong> {safeString(accion.plazo)}
                              </p>
                            )}
                            {accion.inversion && isRenderable(accion.inversion) && (
                              <p className="text-sm text-gray-600">
                                <strong>Inversión:</strong> {safeString(accion.inversion)}
                              </p>
                            )}
                            {accion.impacto && isRenderable(accion.impacto) && (
                              <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                                <p className="text-sm text-green-700">
                                  <strong>💡 Impacto esperado:</strong> {safeString(accion.impacto)}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <p className="text-gray-600 text-center">No hay plan de acción disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
