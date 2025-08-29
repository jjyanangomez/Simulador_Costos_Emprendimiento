import { FaChartLine, FaCheckCircle, FaSpinner, FaArrowRight } from "react-icons/fa";
import type { ModuleContent } from "../../../domain/entities/ModuleContent";
import { FinalAnalysisResultDisplay } from "./FinalAnalysisResultDisplay";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiAnalysisService, type BusinessInfo, type CostRecord } from "../../adapters/AiAnalysisService";
import { BusinessProgressRepositoryApi } from "../../adapters/BusinessProgressRepositoryApi";
import { AnalyzedCostResultRepositoryApi, type CreateAnalyzedCostResultRequest } from "../../adapters/AnalyzedCostResultRepositoryApi";
import { RiskDetectionRepositoryApi, type CreateRiskDetectionRequest } from "../../adapters/RiskDetectionRepositoryApi";
import { ActionPlanRepositoryApi, type CreateActionPlanRequest } from "../../adapters/ActionPlanRepositoryApi";
import { CostValidationRepositoryApi, type CreateCostValidationRequest } from "../../adapters/CostValidationRepositoryApi";
import { CompleteAnalysisRepositoryApi } from "../../adapters/CompleteAnalysisRepositoryApi";

interface ResultsSectionProps {
    moduleContent: ModuleContent;
}

// Hook personalizado para verificar si el módulo está completado y cargar datos guardados
const useModuleCompletionStatus = (businessId: string | undefined, moduleId: string | undefined) => {
    const [isModuleCompleted, setIsModuleCompleted] = useState(false);
    const [isLoadingCompletion, setIsLoadingCompletion] = useState(true);
    const [completionError, setCompletionError] = useState<string | null>(null);

    useEffect(() => {
        if (!businessId || !moduleId) {
            setIsLoadingCompletion(false);
            return;
        }

        const checkModuleCompletion = async () => {
            try {
                console.log('🔍 [RESULTS] Verificando estado de completado del módulo...');
                console.log('📊 [RESULTS] businessId:', businessId, 'moduleId:', moduleId);
                const progressRepository = new BusinessProgressRepositoryApi();
                const progress = await progressRepository.getProgress(parseInt(businessId), parseInt(moduleId));
                
                console.log('📊 [RESULTS] Progreso del módulo:', progress);
                console.log('📊 [RESULTS] progress.id_estado:', progress?.id_estado);
                
                // Verificar si el módulo está completado (estado 3 o 13 = completado)
                const completed = progress && (progress.id_estado === 3 || progress.id_estado === 13);
                console.log('📊 [RESULTS] completed calculado:', completed);
                setIsModuleCompleted(completed || false);
                
                console.log('✅ [RESULTS] Módulo completado:', completed);
            } catch (error) {
                console.error('❌ [RESULTS] Error al verificar completado del módulo:', error);
                setCompletionError(error instanceof Error ? error.message : 'Error desconocido');
                setIsModuleCompleted(false);
            } finally {
                setIsLoadingCompletion(false);
            }
        };

        checkModuleCompletion();
    }, [businessId, moduleId]);

    return { isModuleCompleted, isLoadingCompletion, completionError };
};

// Hook personalizado para cargar datos guardados del análisis completo
const useSavedAnalysisData = (businessId: string | undefined, moduleId: string | undefined) => {
    const [savedAnalysisData, setSavedAnalysisData] = useState<any>(null);
    const [isLoadingSavedData, setIsLoadingSavedData] = useState(false);
    const [savedDataError, setSavedDataError] = useState<string | null>(null);

    useEffect(() => {
        if (!businessId || !moduleId) {
            return;
        }

        const loadSavedData = async () => {
            try {
                setIsLoadingSavedData(true);
                setSavedDataError(null);
                
                console.log('🔍 [RESULTS] Cargando datos guardados del análisis completo...');
                console.log('📊 [RESULTS] businessId:', businessId, 'moduleId:', moduleId);
                
                // 1. Intentar cargar análisis completo
                try {
                    const completeAnalysisRepository = new CompleteAnalysisRepositoryApi();
                    const savedData = await completeAnalysisRepository.getCompleteAnalysis(
                        parseInt(businessId),
                        parseInt(moduleId)
                    );
                    
                    if (savedData) {
                        console.log('✅ [RESULTS] Análisis completo encontrado:', savedData);
                        setSavedAnalysisData(savedData);
                        return;
                    }
                } catch (completeError) {
                    console.log('⚠️ [RESULTS] No se encontró análisis completo:', completeError);
                }
                
                // 2. Si no hay análisis completo, intentar con el endpoint alternativo
                try {
                    const completeAnalysisRepository = new CompleteAnalysisRepositoryApi();
                    const savedData = await completeAnalysisRepository.getCompleteAnalysisAlternative(
                        parseInt(businessId),
                        parseInt(moduleId)
                    );
                    
                    if (savedData) {
                        console.log('✅ [RESULTS] Análisis completo encontrado (alternativo):', savedData);
                        setSavedAnalysisData(savedData);
                        return;
                    }
                } catch (completeError) {
                    console.log('⚠️ [RESULTS] No se encontró análisis completo (alternativo):', completeError);
                }
                
                // 3. Si no hay análisis completo, cargar datos individuales
                console.log('🔍 [RESULTS] Cargando datos individuales del análisis...');
                
                const analysisData: any = {
                    costosAnalizados: [],
                    riesgosDetectados: [],
                    planAccion: [],
                    validacionCostos: null
                };
                
                // Cargar análisis de costos (usando el análisis ID del negocio)
                try {
                    const analyzedCosts = await AnalyzedCostResultRepositoryApi.getAnalyzedCostResultsByAnalysisId(
                        parseInt(businessId)
                    );
                    if (analyzedCosts && analyzedCosts.length > 0) {
                        console.log('✅ [RESULTS] Costos analizados cargados:', analyzedCosts.length, 'elementos');
                        analysisData.costosAnalizados = analyzedCosts;
                    }
                } catch (costsError) {
                    console.log('⚠️ [RESULTS] No se encontraron costos analizados:', costsError);
                }
                
                // Verificar si se encontraron datos
                const hasData = analysisData.costosAnalizados.length > 0;
                
                if (hasData) {
                    console.log('✅ [RESULTS] Datos guardados cargados exitosamente:', analysisData);
                    setSavedAnalysisData(analysisData);
                } else {
                    console.log('⚠️ [RESULTS] No se encontraron datos guardados');
                    setSavedDataError('No se encontraron datos guardados para este módulo');
                }
                
            } catch (error) {
                console.error('❌ [RESULTS] Error al cargar datos guardados:', error);
                setSavedDataError(error instanceof Error ? error.message : 'Error al cargar datos guardados');
            } finally {
                setIsLoadingSavedData(false);
            }
        };

        loadSavedData();
    }, [businessId, moduleId]);

    return { savedAnalysisData, isLoadingSavedData, savedDataError };
};

// Hook personalizado para obtener información del negocio
const useBusinessInfo = (businessId: string | undefined) => {
    const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!businessId) {
            setIsLoading(false);
            return;
        }

        const fetchBusinessInfo = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/negocios/${businessId}`);
                if (!response.ok) {
                    throw new Error('Error al obtener información del negocio');
                }
                const data = await response.json();
                                 console.log('🏢 [RESULTS] Datos del negocio recibidos:', data);
                 setBusinessInfo({
                     tipoNegocio: data.tipoNegocio || 'No especificado',
                     tamano: data.tamano || 'No especificado',
                     ubicacion: data.ubicacion || 'No especificado'
                 });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error desconocido');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusinessInfo();
    }, [businessId]);

    return { businessInfo, isLoading, error };
};

// Hook personalizado para obtener registros financieros
const useFinancialRecords = (businessId: string | undefined, moduleId: string | undefined) => {
    const [records, setRecords] = useState<CostRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!businessId || !moduleId) {
            console.log('⚠️ [RESULTS] BusinessId o ModuleId no disponibles:', { businessId, moduleId });
            setIsLoading(false);
            return;
        }

        const fetchRecords = async () => {
            try {
                console.log('🔍 [RESULTS] Buscando registros para:', { businessId, moduleId });
                const response = await fetch(`http://localhost:3000/api/v1/financial-records/business/${businessId}/module/${moduleId}`);
                
                console.log('📊 [RESULTS] Response status:', response.status);
                
                if (!response.ok) {
                    if (response.status === 404) {
                        console.log('⚠️ [RESULTS] No se encontraron registros (404)');
                        setRecords([]);
                        setError(null);
                    } else {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }
                } else {
                    const data = await response.json();
                    console.log('📊 [RESULTS] Datos recibidos:', data);
                    console.log('📊 [RESULTS] Tipo de datos:', typeof data);
                    console.log('📊 [RESULTS] Es array:', Array.isArray(data));
                    
                    if (Array.isArray(data) && data.length > 0) {
                        console.log('📊 [RESULTS] Primer registro:', data[0]);
                        console.log('📊 [RESULTS] Campos del primer registro:', Object.keys(data[0]));
                    }
                    
                    const costRecords: CostRecord[] = data.map((record: any) => {
                        console.log('🔍 [RESULTS] Procesando registro:', record);
                        return {
                            name: record.name,
                            amount: record.amount.toString()
                        };
                    });
                    
                    console.log('📊 [RESULTS] Records procesados:', costRecords);
                    setRecords(costRecords);
                    setError(null);
                }
            } catch (err) {
                console.error('❌ [RESULTS] Error al obtener registros:', err);
                setError(err instanceof Error ? err.message : 'Error desconocido');
                setRecords([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecords();
    }, [businessId, moduleId]);

    return { records, isLoading, error };
};

// Función para generar datos mock del análisis
const generateMockAnalysisResult = (records: CostRecord[], businessInfo: BusinessInfo) => {
    // Crear análisis de costos basado en los registros reales
    const analisisCostos: any = {};
    records.forEach(record => {
        const valor = parseInt(record.amount);
        analisisCostos[record.name] = {
            valor_recibido: `$${record.amount}`,
            rango_estimado_zona_especifica: `$${Math.max(0, valor - 20)}-$${valor + 30}`,
            evaluacion: valor < 50 ? "✅ Dentro del rango" : "⚠️ Fuera del rango",
            analisis: `El costo de ${record.name} de $${record.amount} mensuales es ${valor < 50 ? 'favorable' : 'elevado'} para un ${businessInfo?.tipoNegocio || 'negocio'} en ${businessInfo?.ubicacion || 'la zona'}.`
        };
    });

    return {
        success: true,
        data: {
            validacion_de_costos: {
                costos_omitidos: [],
                puntuacion_global: 85,
                puede_proceder: true,
                razones_no_proceder: []
            },
            analisis_costos: analisisCostos,
            riesgos_identificados: [
                {
                    nombre: "Costos Operativos Elevados",
                    causa: "Algunos costos están por encima del promedio del mercado",
                    probabilidad: "Media",
                    impacto: "Reducción del margen operativo",
                    consecuencias: "Pérdida de rentabilidad estimada de $100-$200 mensuales"
                },
                {
                    nombre: "Falta de Optimización de Servicios",
                    causa: "Posibles oportunidades de ahorro en contratación de servicios",
                    probabilidad: "Alta",
                    impacto: "Costos innecesarios",
                    consecuencias: "Ahorro potencial de $50-$150 mensuales"
                }
            ],
            plan_accion: {
                "Optimización Inmediata": [
                    {
                        descripcion: "Revisar y renegociar contratos de servicios",
                        prioridad: "Alta",
                        plazo: "1-2 meses",
                        inversion: "$0",
                        impacto: "Ahorro potencial de $50-$100 mensuales"
                    }
                ],
                "Análisis de Mercado": [
                    {
                        descripcion: "Comparar precios con otros proveedores",
                        prioridad: "Media",
                        plazo: "2-3 meses",
                        inversion: "$0-$100",
                        impacto: "Reducción de costos operativos"
                    }
                ]
            }
        },
        timestamp: new Date().toISOString(),
        duration: "mock_analysis"
    };
};

// Componente para la sección de Resultados
export function ResultsSection({ moduleContent: _moduleContent }: ResultsSectionProps) {
    const { businessId, moduleId } = useParams<{ businessId: string; moduleId: string }>();
    const navigate = useNavigate();
    const { businessInfo, isLoading: isLoadingBusiness } = useBusinessInfo(businessId);
    const { records, isLoading: isLoadingRecords } = useFinancialRecords(businessId, moduleId);
    const { isModuleCompleted } = useModuleCompletionStatus(businessId, moduleId);
    const { savedAnalysisData, isLoadingSavedData } = useSavedAnalysisData(businessId, moduleId);
    
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [usingMockData, setUsingMockData] = useState(false);
    const [hasExecutedAnalysis, setHasExecutedAnalysis] = useState(false);
    const [isCompletingModule, setIsCompletingModule] = useState(false);
    const [moduleCompleted, setModuleCompleted] = useState(false);

    // Actualizar moduleCompleted cuando se detecte que el módulo ya está completado
    useEffect(() => {
        if (isModuleCompleted) {
            setModuleCompleted(true);
        }
    }, [isModuleCompleted]);

    // Ejecutar análisis cuando se carguen los datos (solo si no hay datos guardados)
    useEffect(() => {
        console.log('🔍 [RESULTS] useEffect de análisis - Condiciones:');
        console.log('📊 [RESULTS] businessInfo:', !!businessInfo);
        console.log('📊 [RESULTS] records.length:', records.length);
        console.log('📊 [RESULTS] !hasExecutedAnalysis:', !hasExecutedAnalysis);
        console.log('📊 [RESULTS] !isLoadingAnalysis:', !isLoadingAnalysis);
        console.log('📊 [RESULTS] !savedAnalysisData:', !savedAnalysisData);
        console.log('📊 [RESULTS] !isLoadingSavedData:', !isLoadingSavedData);
        
        if (businessInfo && records.length > 0 && !hasExecutedAnalysis && !isLoadingAnalysis && !savedAnalysisData && !isLoadingSavedData) {
            const executeAnalysis = async () => {
                try {
                    setIsLoadingAnalysis(true);
                    setError(null);
                    
                    console.log('🚀 [RESULTS] Ejecutando análisis completo...');
                    console.log('📊 [RESULTS] Records:', records);
                    console.log('📊 [RESULTS] Records JSON:', JSON.stringify(records, null, 2));
                    console.log('🏢 [RESULTS] Business Info:', businessInfo);
                                         console.log('🏢 [RESULTS] Business Info JSON:', JSON.stringify(businessInfo, null, 2));
                     console.log('🏢 [RESULTS] Business Info campos:', businessInfo ? Object.keys(businessInfo) : 'No disponible');
                    
                                         // Validar que businessInfo tenga todos los campos requeridos
                     if (!businessInfo.tipoNegocio || !businessInfo.tamano || !businessInfo.ubicacion) {
                         console.log('⚠️ [RESULTS] BusinessInfo incompleto, usando datos mock');
                         const mockResult = generateMockAnalysisResult(records, businessInfo);
                         setAnalysisResult(mockResult);
                         setUsingMockData(true);
                         return;
                     }
                     
                     // Intentar análisis real primero
                     try {
                         const aiService = new AiAnalysisService();
                         const result = await aiService.completeAnalysis(records, businessInfo);
                        
                        if (result.success) {
                            console.log('✅ [RESULTS] Análisis completado exitosamente');
                            setAnalysisResult(result);
                            setUsingMockData(false);
                        } else {
                            console.log('❌ [RESULTS] Análisis falló:', result);
                            setError((result as any).error || "Error en el análisis");
                        }
                                         } catch (apiError: any) {
                         console.log('⚠️ [RESULTS] Error en API, usando datos mock:', apiError.message);
                         
                         // Usar datos mock para cualquier error de API
                         const mockResult = generateMockAnalysisResult(records, businessInfo);
                         setAnalysisResult(mockResult);
                         setUsingMockData(true);
                     }
                } catch (err: any) {
                    console.error('💥 [RESULTS] Error en análisis:', err);
                    setError(err.message || "Ocurrió un error al procesar el análisis");
                } finally {
                    setIsLoadingAnalysis(false);
                    setHasExecutedAnalysis(true);
                }
            };

            executeAnalysis();
        }
    }, [businessInfo, records, hasExecutedAnalysis, isModuleCompleted]); // Agregada isModuleCompleted para control

    // Usar datos guardados cuando estén disponibles
    useEffect(() => {
        if (savedAnalysisData && !analysisResult && !isLoadingSavedData) {
            console.log('🔄 [RESULTS] Usando datos guardados del análisis');
            console.log('📊 [RESULTS] Datos guardados recibidos:', savedAnalysisData);
            
            // Convertir los datos guardados al formato esperado por el componente
            const convertedData = {
                success: true,
                data: {
                    analysis: {
                        data: {
                            analisis_costos: savedAnalysisData.costosAnalizados || []
                        }
                    },
                    final: {
                        data: {
                            plan_accion: []
                        }
                    },
                    validation: {
                        data: {
                            validacion_de_costos: [],
                            costos_obligatorios_faltantes: []
                        }
                    }
                }
            };
            
            console.log('🔄 [RESULTS] Datos convertidos:', convertedData);
            
            setAnalysisResult(convertedData);
            setUsingMockData(false);
            setHasExecutedAnalysis(true);
            console.log('✅ [RESULTS] Datos guardados cargados exitosamente');
        }
    }, [savedAnalysisData, analysisResult, isLoadingSavedData]);

    // Debug logs - Solo cuando cambien los valores importantes
    useEffect(() => {
        console.log('🔍 [RESULTS] Estado actual:', {
            businessId,
            moduleId,
            businessInfo: businessInfo ? 'Cargado' : 'No cargado',
            records: records.length,
            isLoadingBusiness,
            isLoadingRecords,
            analysisResult: analysisResult ? 'Disponible' : 'No disponible',
            isLoadingAnalysis,
            error,
            usingMockData,
            hasExecutedAnalysis
        });
    }, [businessId, moduleId, businessInfo, records.length, isLoadingBusiness, isLoadingRecords, analysisResult, isLoadingAnalysis, error, usingMockData, hasExecutedAnalysis]);

    // Función para marcar módulo como completado
    const handleCompleteModule = async () => {
        if (!businessId || !moduleId) {
            console.error('❌ [RESULTS] BusinessId o ModuleId no disponibles');
            return;
        }

        try {
            setIsCompletingModule(true);
            console.log('🎯 [RESULTS] Iniciando proceso de completar módulo...');
            
            // 0. VERIFICAR/CREAR ANÁLISIS DE IA
            console.log('🔍 [RESULTS] Verificando análisis de IA...');
            let analisisId = parseInt(businessId); // Fallback
            
            try {
                const analisisResponse = await fetch(`http://localhost:3000/api/v1/analisis-ia/verify-or-create/${businessId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                if (!analisisResponse.ok) {
                    throw new Error(`Error al verificar/crear análisis: ${analisisResponse.status}`);
                }
                
                const analisisData = await analisisResponse.json();
                console.log('✅ [RESULTS] Análisis de IA verificado/creado:', analisisData);
                
                // Usar el ID del análisis real
                analisisId = analisisData.analisisId || analisisData.analisis_id || parseInt(businessId);
                console.log('📊 [RESULTS] Usando análisis ID:', analisisId);
                
            } catch (analisisError) {
                console.error('❌ [RESULTS] Error al verificar/crear análisis de IA:', analisisError);
                console.log('📊 [RESULTS] Usando businessId como análisis ID:', analisisId);
            }
            
            // 1. CAPTURAR Y GUARDAR TODOS LOS DATOS DEL ANÁLISIS DE IA
            console.log('🎯 [RESULTS] ===== CAPTURANDO TODOS LOS DATOS DEL ANÁLISIS =====');
            console.log('📊 [RESULTS] AnalysisResult completo:', analysisResult);
            console.log('📊 [RESULTS] AnalysisResult JSON:', JSON.stringify(analysisResult, null, 2));
            
            // Capturar datos de análisis de costos
            if (analysisResult && analysisResult.analysis && analysisResult.analysis.data && analysisResult.analysis.data.analisis_costos) {
                console.log('💾 [RESULTS] Guardando datos de comparación del mercado...');
                
                const analisisCostos = analysisResult.analysis.data.analisis_costos;
                console.log('📊 [RESULTS] Datos de análisis de costos capturados:', analisisCostos);
                
                const analyzedCostsData: CreateAnalyzedCostResultRequest[] = Object.entries(analisisCostos).map(([costName, costData]: [string, any]) => {
                    const costDataToSave = {
                        analysisId: analisisId, // Usar el análisis ID real
                        costName: costName || 'Costo sin nombre',
                        receivedValue: costData.valor_recibido || costData.valor || '',
                        estimatedRange: costData.rango_estimado_zona_especifica || costData.rango_estimado || '',
                        evaluation: costData.evaluacion || 'Sin evaluar',
                        comment: costData.analisis || costData.comentario || ''
                    };
                    console.log(`📊 [RESULTS] Costo a guardar: ${costName}`, costDataToSave);
                    return costDataToSave;
                });
                
                console.log('📊 [RESULTS] Datos de comparación del mercado a guardar:', analyzedCostsData);
                console.log('📊 [RESULTS] Cantidad de costos a guardar:', analyzedCostsData.length);
                console.log('📊 [RESULTS] Primer registro de ejemplo:', analyzedCostsData[0]);
                
                if (analyzedCostsData.length > 0) {
                    try {
                        console.log('🚀 [RESULTS] Llamando a createMultipleAnalyzedCostResults...');
                        const result = await AnalyzedCostResultRepositoryApi.createMultipleAnalyzedCostResults(analyzedCostsData);
                        console.log('✅ [RESULTS] Datos de comparación del mercado guardados exitosamente:', result);
                    } catch (saveError) {
                        console.error('⚠️ [RESULTS] Error al guardar datos de comparación del mercado:', saveError);
                        console.error('⚠️ [RESULTS] Error completo:', JSON.stringify(saveError, null, 2));
                        // No bloqueamos el flujo si falla el guardado de comparación
                    }
                } else {
                    console.log('⚠️ [RESULTS] No hay datos de costos para guardar');
                }
            } else {
                console.log('ℹ️ [RESULTS] No hay datos de comparación del mercado para guardar');
                console.log('ℹ️ [RESULTS] Estructura de analysisResult:', {
                    hasAnalysisResult: !!analysisResult,
                    hasAnalysis: analysisResult?.analysis ? 'Sí' : 'No',
                    hasAnalysisData: analysisResult?.analysis?.data ? 'Sí' : 'No',
                    hasAnalisisCostos: analysisResult?.analysis?.data?.analisis_costos ? 'Sí' : 'No',
                    analysisDataKeys: analysisResult?.analysis?.data ? Object.keys(analysisResult.analysis.data) : 'No data'
                });
            }
            
            // 2. GUARDAR RIESGOS DETECTADOS
            if (analysisResult && analysisResult.analysis && analysisResult.analysis.data && analysisResult.analysis.data.riesgos_identificados) {
                console.log('💾 [RESULTS] Guardando riesgos detectados...');
                
                const riesgos = analysisResult.analysis.data.riesgos_identificados;
                console.log('📊 [RESULTS] Datos de riesgos detectados:', riesgos);
                
                const riesgosData: CreateRiskDetectionRequest[] = riesgos.map((riesgo: any) => ({
                    analisisId: analisisId,
                    riesgo: riesgo.nombre || riesgo.riesgo || 'Riesgo sin nombre',
                    causaDirecta: riesgo.causa || riesgo.causa_directa || 'Causa no especificada',
                    impactoPotencial: riesgo.consecuencias || riesgo.impacto_potencial || 'Impacto no especificado'
                }));
                
                console.log('📊 [RESULTS] Riesgos a guardar:', riesgosData);
                
                if (riesgosData.length > 0) {
                    try {
                        console.log('🚀 [RESULTS] Llamando a createMultipleRiskDetections...');
                        const result = await RiskDetectionRepositoryApi.createMultipleRiskDetections(riesgosData);
                        console.log('✅ [RESULTS] Riesgos detectados guardados exitosamente:', result);
                    } catch (saveError) {
                        console.error('⚠️ [RESULTS] Error al guardar riesgos detectados:', saveError);
                        console.error('⚠️ [RESULTS] Error completo:', JSON.stringify(saveError, null, 2));
                    }
                }
            }
            
            // 3. GUARDAR PLAN DE ACCIÓN
            if (analysisResult && analysisResult.final && analysisResult.final.data && analysisResult.final.data.plan_accion) {
                console.log('💾 [RESULTS] Guardando plan de acción...');
                
                const planAccion = analysisResult.final.data.plan_accion;
                console.log('📊 [RESULTS] Datos del plan de acción:', planAccion);
                
                const planAccionData: CreateActionPlanRequest[] = [];
                
                // Procesar cada categoría del plan de acción
                Object.entries(planAccion).forEach(([categoria, acciones]: [string, any]) => {
                    if (Array.isArray(acciones)) {
                        acciones.forEach((accion: any) => {
                            planAccionData.push({
                                analisisId: analisisId,
                                titulo: categoria || 'Acción sin categoría',
                                descripcion: accion.descripcion || accion.accion || 'Descripción no disponible',
                                prioridad: accion.prioridad || 'Media'
                            });
                        });
                    }
                });
                
                console.log('📊 [RESULTS] Plan de acción a guardar:', planAccionData);
                
                if (planAccionData.length > 0) {
                    try {
                        console.log('🚀 [RESULTS] Llamando a createMultipleActionPlans...');
                        const result = await ActionPlanRepositoryApi.createMultipleActionPlans(planAccionData);
                        console.log('✅ [RESULTS] Plan de acción guardado exitosamente:', result);
                    } catch (saveError) {
                        console.error('⚠️ [RESULTS] Error al guardar plan de acción:', saveError);
                        console.error('⚠️ [RESULTS] Error completo:', JSON.stringify(saveError, null, 2));
                    }
                }
            }
            
            // 4. GUARDAR VALIDACIÓN DE COSTOS
            if (analysisResult && analysisResult.validation && analysisResult.validation.data && analysisResult.validation.data.validacion_de_costos) {
                console.log('💾 [RESULTS] Guardando validación de costos...');
                
                const validacion = analysisResult.validation.data.validacion_de_costos;
                console.log('📊 [RESULTS] Datos de validación de costos:', validacion);
                
                const validacionData: CreateCostValidationRequest = {
                    negocioId: parseInt(businessId),
                    moduloId: parseInt(moduleId),
                    costosValidados: validacion || [],
                    costosFaltantes: analysisResult.validation.data.costos_obligatorios_faltantes || [],
                    resumenValidacion: analysisResult.validation.data.resumen_validacion || {},
                    puntuacionGlobal: analysisResult.validation.data.resumen_validacion?.puntuacion_global || 0,
                    puedeProseguirAnalisis: analysisResult.validation.data.resumen_validacion?.puede_proseguir_analisis || false
                };
                
                console.log('📊 [RESULTS] Validación de costos a guardar:', validacionData);
                
                try {
                    console.log('🚀 [RESULTS] Llamando a createCostValidation...');
                    const result = await CostValidationRepositoryApi.createCostValidation(validacionData);
                    console.log('✅ [RESULTS] Validación de costos guardada exitosamente:', result);
                } catch (saveError) {
                    console.error('⚠️ [RESULTS] Error al guardar validación de costos:', saveError);
                    console.error('⚠️ [RESULTS] Error completo:', JSON.stringify(saveError, null, 2));
                }
            }
            
            // Log de resumen de datos capturados
            console.log('📊 [RESULTS] ===== RESUMEN DE DATOS CAPTURADOS =====');
            if (analysisResult) {
                console.log('📊 [RESULTS] Datos de análisis de costos:', analysisResult.analysis?.data?.analisis_costos);
                console.log('📊 [RESULTS] Datos de riesgos detectados:', analysisResult.analysis?.data?.riesgos_identificados);
                console.log('📊 [RESULTS] Datos del plan de acción:', analysisResult.final?.data?.plan_accion);
                console.log('📊 [RESULTS] Datos de validación de costos:', analysisResult.validation?.data?.validacion_de_costos);
            }

            // 5. GUARDAR ANÁLISIS COMPLETO
            if (analysisResult) {
                console.log('💾 [RESULTS] Guardando análisis completo...');
                
                try {
                    const completeAnalysisData = {
                        negocioId: parseInt(businessId),
                        moduloId: parseInt(moduleId),
                        analisisId: analisisId,
                        costosAnalizados: analysisResult.analysis?.data?.analisis_costos || [],
                        riesgosDetectados: analysisResult.analysis?.data?.riesgos_identificados || [],
                        planAccion: analysisResult.final?.data?.plan_accion || [],
                        resumenAnalisis: {
                            puntuacion_global: 7,
                            recomendaciones: ["Implementar seguros", "Optimizar costos"]
                        }
                    };
                    
                    console.log('📊 [RESULTS] Datos completos a guardar:', completeAnalysisData);
                    
                    // Usar el repositorio directamente
                    const completeAnalysisRepository = new CompleteAnalysisRepositoryApi();
                    const savedResult = await completeAnalysisRepository.saveCompleteAnalysis(completeAnalysisData);
                    console.log('✅ [RESULTS] Análisis completo guardado exitosamente:', savedResult);
                } catch (saveError) {
                    console.error('⚠️ [RESULTS] Error al guardar análisis completo:', saveError);
                    console.error('⚠️ [RESULTS] Error completo:', JSON.stringify(saveError, null, 2));
                }
            }
            
            // 2. Marcar módulo como completado
            console.log('🎯 [RESULTS] Marcando módulo como completado...');
            
            const progressRepository = new BusinessProgressRepositoryApi();
            const result = await progressRepository.completeModule(
                parseInt(businessId),
                parseInt(moduleId)
            );
            
            console.log('✅ [RESULTS] Módulo marcado como completado:', result);
            setModuleCompleted(true);
            
            // Mostrar mensaje de éxito
            alert('¡Módulo completado exitosamente! Los datos de comparación del mercado han sido guardados. Redirigiendo al Learning Path...');
            
            // Redirigir al Learning Path
            navigate(`/businesses/${businessId}/learning-path`);
            console.log('🔄 [RESULTS] Navegación al learning path habilitada');
            
        } catch (error) {
            console.error('💥 [RESULTS] Error al completar módulo:', error);
            alert('Error al marcar el módulo como completado. Inténtalo de nuevo.');
        } finally {
            setIsCompletingModule(false);
        }
    };

    // Estados de carga
    if (isLoadingBusiness || isLoadingRecords || isLoadingSavedData) {
        return (
            <div className="text-center p-8">
                <FaSpinner className="text-4xl text-blue-600 mx-auto mb-4 animate-spin" />
                <p className="text-lg text-gray-600">
                    {isLoadingSavedData ? 'Cargando datos guardados...' : 'Cargando datos del análisis...'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    {isLoadingBusiness ? 'Cargando información del negocio...' : 
                     isLoadingRecords ? 'Cargando registros financieros...' :
                     isLoadingSavedData ? 'Recuperando análisis previo...' : 'Preparando análisis...'}
                </p>
            </div>
        );
    }

    // Error en carga de datos
    if (error) {
        return (
            <div className="text-center p-8">
                <div className="text-red-500 mb-4">
                    <p className="text-xl font-bold">Error al Cargar Datos</p>
                    <p className="text-sm">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    // Sin datos para analizar
    if (!businessInfo || records.length === 0) {
        return (
            <div className="text-center p-8">
                <div className="text-gray-500 mb-4">
                    <p className="text-xl font-bold">No Hay Datos para Analizar</p>
                    <p className="text-sm mb-4">Completa la simulación primero para ver los resultados</p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left">
                        <h4 className="font-bold text-blue-800 mb-2">🔍 Información de Debug:</h4>
                        <div className="text-sm text-blue-700 space-y-1">
                            <p><strong>Business ID:</strong> {businessId || 'No disponible'}</p>
                            <p><strong>Module ID:</strong> {moduleId || 'No disponible'}</p>
                            <p><strong>Business Info:</strong> {businessInfo ? 'Cargado' : 'No cargado'}</p>
                            <p><strong>Records:</strong> {records.length} registros encontrados</p>
                            <p><strong>Error:</strong> {error || 'Ninguno'}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4 space-x-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Recargar Página
                        </button>
                        
                        <button
                            onClick={() => {
                                const mockResult = generateMockAnalysisResult([], businessInfo || { tipoNegocio: 'Test', tamano: 'Test', ubicacion: 'Test' });
                                setAnalysisResult(mockResult);
                                setUsingMockData(true);
                                setHasExecutedAnalysis(true);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Usar Datos Mock (Prueba)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-8">
            <h3 className="text-3xl font-bold text-neutral-800 mb-6 flex items-center gap-3">
                <FaChartLine className="text-blue-600" />
                <span>Resultados del Análisis</span>
            </h3>

            {/* Aviso de datos mock */}
            {usingMockData && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-yellow-600">⚠️</span>
                        <div>
                            <h4 className="font-bold text-yellow-800">Datos de Demostración</h4>
                            <p className="text-yellow-700 text-sm">
                                Se están mostrando datos de ejemplo porque la cuota de la API de Gemini se ha excedido. 
                                Para ver análisis reales, actualiza tu plan o espera hasta mañana.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Aviso de datos guardados */}
            {savedAnalysisData && !usingMockData && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-green-600">💾</span>
                        <div>
                            <h4 className="font-bold text-green-800">Datos Guardados Cargados</h4>
                            <p className="text-green-700 text-sm">
                                Se están mostrando los resultados guardados de tu análisis previo. 
                                No se realizaron nuevas llamadas a la IA.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Estado de carga del análisis */}
            {isLoadingAnalysis && (
                <div className="text-center p-8 bg-blue-50 rounded-lg border border-blue-200">
                    <FaSpinner className="text-4xl text-blue-600 mx-auto mb-4 animate-spin" />
                    <p className="text-lg text-blue-700">Ejecutando análisis completo...</p>
                    <p className="text-sm text-blue-600 mt-2">Esto puede tomar unos segundos</p>
                </div>
            )}

            {/* Error en el análisis */}
            {error && !isLoadingAnalysis && (
                <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-red-500 mb-4">
                        <p className="text-xl font-bold">Error en el Análisis</p>
                        <p className="text-sm">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            {/* Resultados del análisis */}
            {analysisResult && !isLoadingAnalysis && (
                <div className="bg-green-50 rounded-lg border border-green-200 p-6 mb-6">
                    <div className="text-center mb-6">
                        <FaCheckCircle className="text-5xl text-green-600 mx-auto mb-4" />
                        <h4 className="text-2xl font-bold text-green-800">¡Análisis Completo Finalizado!</h4>
                        <p className="text-green-700 mt-2">Tus datos han sido validados y analizados completamente.</p>
                        
                        {usingMockData && (
                            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg">
                                <p className="text-yellow-800 text-sm">
                                    ⚠️ <strong>Nota:</strong> Se están mostrando datos de ejemplo debido a limitaciones temporales de la API. 
                                    Los resultados reales estarán disponibles cuando se resuelva el problema de cuota.
                                </p>
                            </div>
                        )}
                        
                        {savedAnalysisData && !usingMockData && (
                            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg">
                                <p className="text-green-800 text-sm">
                                    💾 <strong>Datos Guardados:</strong> Se están mostrando los resultados guardados de tu análisis previo. 
                                    No se realizaron nuevas llamadas a la IA.
                                </p>
                            </div>
                        )}
                    </div>
                    
                                         <FinalAnalysisResultDisplay data={analysisResult} />
                     
                     {/* Botón Continuar */}
                     <div className="text-center mt-8">
                         <button
                             onClick={handleCompleteModule}
                             disabled={isCompletingModule || moduleCompleted}
                             className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center gap-2 mx-auto ${
                                 isCompletingModule || moduleCompleted
                                     ? 'bg-gray-400 cursor-not-allowed'
                                     : 'bg-green-600 hover:bg-green-700 hover:scale-105 shadow-lg'
                             }`}
                         >
                             {isCompletingModule ? (
                                 <>
                                     <FaSpinner className="animate-spin" />
                                     Guardando Datos y Completando Módulo...
                                 </>
                             ) : moduleCompleted ? (
                                 <>
                                     <FaCheckCircle />
                                     Módulo Completado
                                 </>
                             ) : (
                                 <>
                                     <FaArrowRight />
                                     Guardar y Continuar
                                 </>
                             )}
                         </button>
                         
                         {moduleCompleted && (
                             <p className="text-green-700 text-sm mt-2">
                                 ¡Módulo completado exitosamente! Serás redirigido al Learning Path.
                             </p>
                         )}
                     </div>
                 </div>
             )}

            {/* Información del negocio */}
            {businessInfo && (
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="font-bold text-blue-800 mb-2">📋 Información del Negocio</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <strong>Tipo:</strong> {businessInfo.tipoNegocio}
                        </div>
                        <div>
                            <strong>Tamaño:</strong> {businessInfo.tamano}
                        </div>
                        <div>
                            <strong>Ubicación:</strong> {businessInfo.ubicacion}
                        </div>
                    </div>
                </div>
            )}

            {/* Resumen de costos analizados */}
            {records.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-bold text-yellow-800 mb-2">💰 Costos Analizados</h4>
                    <p className="text-yellow-700 text-sm">
                        Se analizaron {records.length} costos financieros para este módulo.
                    </p>
                </div>
            )}
        </div>
    );
}
