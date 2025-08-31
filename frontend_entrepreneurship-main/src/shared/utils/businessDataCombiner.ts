// 🏢 Utilidad para combinar información de la empresa con costos fijos
// Genera un JSON completo con toda la información disponible

import { LocalStorageService, type CostosFijosData } from '../services/localStorage.service';
import { BusinessAnalysisService } from '../services/BusinessAnalysisService';
import { getBusinessName, getBusinessNameInfo } from './businessNameStorage';

export interface BusinessCompleteData {
  // Información básica del negocio
  businessInfo: {
    name: string | null;
    nameInfo: {
      hasName: boolean;
      formattedName: string;
      history: string[];
      lastUpdated: string | null;
    };
    businessAnalysis: any | null;
    businessDataOnly: any | null;
  };
  
  // Costos fijos
  costosFijos: {
    data: CostosFijosData | null;
    existenCostos: boolean;
    totalCostos: number;
    estadisticas: any | null;
    fechaGuardado: string | null;
  };
  
  // Negocio actual
  negocioActual: {
    id: string | null;
    existe: boolean;
  };
  
  // Metadatos
  metadata: {
    fechaGeneracion: string;
    timestamp: number;
    version: string;
  };
}

/**
 * 🎯 Genera un JSON completo con toda la información de la empresa y costos fijos
 * @returns BusinessCompleteData - Objeto completo con toda la información
 */
export function generateCompleteBusinessData(): BusinessCompleteData {
  console.log('🏢 [BUSINESS_DATA_COMBINER] Generando datos completos del negocio...');
  
  // 1. Información básica del negocio
  const businessName = getBusinessName();
  const businessNameInfo = getBusinessNameInfo();
  const businessAnalysis = BusinessAnalysisService.getBusinessAnalysisData();
  const businessDataOnly = BusinessAnalysisService.getBusinessDataOnly();
  
  console.log('📋 [BUSINESS_DATA_COMBINER] Información básica obtenida:', {
    name: businessName,
    hasAnalysis: !!businessAnalysis,
    hasBusinessData: !!businessDataOnly
  });
  
  // 2. Costos fijos
  const costosFijosData = LocalStorageService.obtenerCostosFijos();
  const existenCostos = LocalStorageService.existenCostosFijos();
  const totalCostos = costosFijosData?.costos.length || 0;
  const estadisticas = LocalStorageService.obtenerEstadisticas();
  const fechaGuardado = LocalStorageService.obtenerFechaGuardado();
  
  console.log('💰 [BUSINESS_DATA_COMBINER] Costos fijos obtenidos:', {
    existenCostos,
    totalCostos,
    fechaGuardado
  });
  
  // 3. Negocio actual
  const negocioActualId = LocalStorageService.obtenerNegocioActual();
  const existeNegocio = !!negocioActualId;
  
  console.log('🏪 [BUSINESS_DATA_COMBINER] Negocio actual:', {
    id: negocioActualId,
    existe: existeNegocio
  });
  
  // 4. Construir objeto completo
  const completeData: BusinessCompleteData = {
    businessInfo: {
      name: businessName,
      nameInfo: businessNameInfo,
      businessAnalysis: businessAnalysis,
      businessDataOnly: businessDataOnly
    },
    
    costosFijos: {
      data: costosFijosData,
      existenCostos,
      totalCostos,
      estadisticas,
      fechaGuardado
    },
    
    negocioActual: {
      id: negocioActualId,
      existe: existeNegocio
    },
    
    metadata: {
      fechaGeneracion: new Date().toISOString(),
      timestamp: Date.now(),
      version: '1.0.0'
    }
  };
  
  console.log('✅ [BUSINESS_DATA_COMBINER] Datos completos generados exitosamente');
  
  return completeData;
}

/**
 * 🖨️ Imprime en consola un JSON formateado con toda la información
 * @param pretty - Si es true, imprime con formato bonito
 */
export function printCompleteBusinessData(pretty: boolean = true): void {
  console.log('🚀 [BUSINESS_DATA_COMBINER] ===== IMPRIMIENDO DATOS COMPLETOS DEL NEGOCIO =====');
  
  const completeData = generateCompleteBusinessData();
  
  if (pretty) {
    console.log('📊 DATOS COMPLETOS DEL NEGOCIO:');
    console.log(JSON.stringify(completeData, null, 2));
  } else {
    console.log('📊 DATOS COMPLETOS DEL NEGOCIO:', completeData);
  }
  
  console.log('🚀 [BUSINESS_DATA_COMBINER] ===== FIN DE IMPRESIÓN =====');
}

/**
 * 📊 Imprime un resumen ejecutivo de la información
 */
export function printBusinessSummary(): void {
  console.log('📋 [BUSINESS_DATA_COMBINER] ===== RESUMEN EJECUTIVO DEL NEGOCIO =====');
  
  const completeData = generateCompleteBusinessData();
  
  console.log('🏢 INFORMACIÓN DEL NEGOCIO:');
  console.log(`   Nombre: ${completeData.businessInfo.name || 'No configurado'}`);
  console.log(`   Tiene análisis: ${completeData.businessInfo.businessAnalysis ? 'Sí' : 'No'}`);
  console.log(`   Tiene datos básicos: ${completeData.businessInfo.businessDataOnly ? 'Sí' : 'No'}`);
  
  console.log('\n💰 COSTOS FIJOS:');
  console.log(`   Existen costos: ${completeData.costosFijos.existenCostos ? 'Sí' : 'No'}`);
  console.log(`   Total de costos: ${completeData.costosFijos.totalCostos}`);
  console.log(`   Fecha de guardado: ${completeData.costosFijos.fechaGuardado || 'N/A'}`);
  
  if (completeData.costosFijos.estadisticas) {
    const stats = completeData.costosFijos.estadisticas;
    console.log(`   Frecuencias utilizadas: ${stats.frecuenciasUtilizadas.join(', ') || 'Ninguna'}`);
    console.log(`   Categoría más usada: ${stats.categoriaMasUsada || 'Ninguna'}`);
    console.log(`   Monto promedio: $${stats.montoPromedio.toFixed(2)}`);
  }
  
  console.log('\n🏪 NEGOCIO ACTUAL:');
  console.log(`   ID: ${completeData.negocioActual.id || 'No configurado'}`);
  console.log(`   Existe: ${completeData.negocioActual.existe ? 'Sí' : 'No'}`);
  
  console.log('\n📅 METADATOS:');
  console.log(`   Generado: ${completeData.metadata.fechaGeneracion}`);
  console.log(`   Versión: ${completeData.metadata.version}`);
  
  console.log('📋 [BUSINESS_DATA_COMBINER] ===== FIN DEL RESUMEN =====');
}

/**
 * 🔍 Busca información específica en los datos
 * @param searchTerm - Término de búsqueda
 */
export function searchBusinessData(searchTerm: string): void {
  console.log(`🔍 [BUSINESS_DATA_COMBINER] Buscando: "${searchTerm}"`);
  
  const completeData = generateCompleteBusinessData();
  const searchTermLower = searchTerm.toLowerCase();
  
  const results: any[] = [];
  
  // Buscar en nombre del negocio
  if (completeData.businessInfo.name?.toLowerCase().includes(searchTermLower)) {
    results.push({
      tipo: 'Nombre del Negocio',
      valor: completeData.businessInfo.name,
      ubicacion: 'businessInfo.name'
    });
  }
  
  // Buscar en costos fijos
  if (completeData.costosFijos.data?.costos) {
    completeData.costosFijos.data.costos.forEach((costo, index) => {
      if (costo.name.toLowerCase().includes(searchTermLower) ||
          costo.description?.toLowerCase().includes(searchTermLower) ||
          costo.category.toLowerCase().includes(searchTermLower)) {
        results.push({
          tipo: 'Costo Fijo',
          valor: costo,
          ubicacion: `costosFijos.data.costos[${index}]`
        });
      }
    });
  }
  
  // Buscar en análisis de negocio
  if (completeData.businessInfo.businessAnalysis) {
    const analysis = completeData.businessInfo.businessAnalysis;
    if (analysis.businessName?.toLowerCase().includes(searchTermLower) ||
        analysis.businessCategory?.toLowerCase().includes(searchTermLower) ||
        analysis.sector?.toLowerCase().includes(searchTermLower)) {
      results.push({
        tipo: 'Análisis de Negocio',
        valor: analysis,
        ubicacion: 'businessInfo.businessAnalysis'
      });
    }
  }
  
  if (results.length > 0) {
    console.log(`✅ [BUSINESS_DATA_COMBINER] Encontradas ${results.length} coincidencias:`);
    results.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.tipo}:`, result.valor);
      console.log(`      Ubicación: ${result.ubicacion}`);
    });
  } else {
    console.log(`❌ [BUSINESS_DATA_COMBINER] No se encontraron coincidencias para "${searchTerm}"`);
  }
}
