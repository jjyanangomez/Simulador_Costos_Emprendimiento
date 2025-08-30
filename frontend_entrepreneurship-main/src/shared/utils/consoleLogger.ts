// 🖥️ UTILIDADES PARA IMPRIMIR DATOS EN CONSOLA
// Funciones para mostrar información detallada en la consola del navegador

import { BusinessAnalysisService } from '../services/BusinessAnalysisService';
import { getBusinessAnalysisData } from './businessAnalysisStorage';

/**
 * 🤖 Imprime todos los datos del análisis de IA en consola
 */
export function printAIAnalysisToConsole(): void {
  const data = getBusinessAnalysisData();
  
  if (!data) {
    console.warn('⚠️ No hay datos de análisis disponibles para mostrar');
    return;
  }

  console.log('\n🤖 ================== DATOS DEL ANÁLISIS DE IA ==================');
  
  // Datos básicos del negocio
  console.log('📊 DATOS DEL NEGOCIO:');
  console.table({
    'Nombre del Negocio': data.businessName,
    'Categoría': data.businessCategory,
    'Sector/Ubicación': data.sector,
    'Ubicación Exacta': data.exactLocation || 'No especificada',
    'Tamaño del Negocio': data.businessSize,
    'Capacidad': `${data.capacity} personas`,
    'Tipo de Financiamiento': data.financingType,
    'Capital Propio': `$${data.ownCapital.toLocaleString()}`,
    'Capital Préstamo': `$${data.loanCapital.toLocaleString()}`,
    'Tasa de Interés': `${data.interestRate}%`,
    'Inversión Total': `$${data.totalInvestment.toLocaleString()}`
  });
  
  // Items de inversión
  console.log('\n💰 ITEMS DE INVERSIÓN:');
  console.table(data.investmentItems.map((item, index) => ({
    'Nº': index + 1,
    'Descripción': item.description,
    'Cantidad': item.quantity || 1,
    'Monto': `$${item.amount.toLocaleString()}`
  })));
  
  // Resultado del análisis
  console.log('\n🎯 RESULTADO DEL ANÁLISIS DE IA:');
  console.table({
    'Es Viable': data.aiAnalysis.isViable ? '✅ SÍ' : '❌ NO',
    'Puntuación': `${data.aiAnalysis.score}/100 puntos`,
    'Nivel de Riesgo': data.aiAnalysis.riskLevel.toUpperCase(),
    'Salud Financiera': data.aiAnalysis.financialHealth.toUpperCase()
  });
  
  // Aspectos positivos
  console.log('\n📈 ASPECTOS POSITIVOS:');
  if (data.aiAnalysis.businessInsights.length > 0) {
    data.aiAnalysis.businessInsights.forEach((insight, index) => {
      console.log(`   ${index + 1}. ✅ ${insight}`);
    });
  } else {
    console.log('   (Ninguno identificado)');
  }
  
  // Advertencias
  console.log('\n⚠️ ADVERTENCIAS:');
  if (data.aiAnalysis.warnings.length > 0) {
    data.aiAnalysis.warnings.forEach((warning, index) => {
      console.log(`   ${index + 1}. ⚠️ ${warning}`);
    });
  } else {
    console.log('   (Ninguna identificada)');
  }
  
  // Recomendaciones
  console.log('\n💡 RECOMENDACIONES:');
  if (data.aiAnalysis.recommendations.length > 0) {
    data.aiAnalysis.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. 💡 ${rec}`);
    });
  } else {
    console.log('   (Ninguna generada)');
  }
  
  // Criterios de viabilidad
  console.log('\n🏆 CRITERIOS DE VIABILIDAD:');
  console.table({
    'Puntuación Mínima': '75 puntos',
    'Riesgo Máximo': 'BAJO (MEDIO y ALTO = NO VIABLE)',
    'Puntuación Actual': `${data.aiAnalysis.score} puntos`,
    'Riesgo Actual': data.aiAnalysis.riskLevel.toUpperCase(),
    'Cumple Criterios': data.aiAnalysis.isViable ? 'SÍ ✅' : 'NO ❌'
  });
  
  // Cálculos financieros
  const debtRatio = ((data.loanCapital / data.totalInvestment) * 100).toFixed(1);
  const investmentPerPerson = (data.totalInvestment / data.capacity).toFixed(0);
  const ownCapitalRatio = ((data.ownCapital / data.totalInvestment) * 100).toFixed(1);
  
  console.log('\n💰 ANÁLISIS FINANCIERO:');
  console.table({
    'Inversión Total': `$${data.totalInvestment.toLocaleString()}`,
    'Capital Propio': `$${data.ownCapital.toLocaleString()} (${ownCapitalRatio}%)`,
    'Capital Préstamo': `$${data.loanCapital.toLocaleString()} (${debtRatio}%)`,
    'Inversión por Persona': `$${investmentPerPerson}`,
    'Tasa de Interés': `${data.interestRate}%`
  });
  
  // Resumen ejecutivo
  console.log('\n📋 RESUMEN EJECUTIVO:');
  console.table({
    'Negocio': `${data.businessName} (${data.businessCategory})`,
    'Ubicación': data.sector,
    'Estado Final': data.aiAnalysis.isViable ? '🟢 NEGOCIO VIABLE' : '🔴 NEGOCIO NO VIABLE',
    'Fecha de Análisis': new Date(data.analysisDate).toLocaleString('es-ES'),
    'ID de Análisis': data.analysisId
  });
  
  console.log('================== FIN DEL ANÁLISIS DE IA ==================\n');
}

/**
 * 📊 Imprime solo los datos básicos del negocio
 */
export function printBusinessDataToConsole(): void {
  const data = BusinessAnalysisService.getBusinessDataOnly();
  
  if (!data) {
    console.warn('⚠️ No hay datos de negocio disponibles');
    return;
  }

  console.log('\n🏢 ================== DATOS DEL NEGOCIO ==================');
  console.table(data);
  console.log('================== FIN DATOS DEL NEGOCIO ==================\n');
}

/**
 * 🤖 Imprime solo el análisis de IA
 */
export function printAIResultsToConsole(): void {
  const aiData = BusinessAnalysisService.getAIAnalysisOnly();
  
  if (!aiData) {
    console.warn('⚠️ No hay datos de análisis de IA disponibles');
    return;
  }

  console.log('\n🤖 ================== ANÁLISIS DE IA ==================');
  console.table({
    'Es Viable': aiData.isViable ? '✅ SÍ' : '❌ NO',
    'Puntuación': `${aiData.score}/100`,
    'Riesgo': aiData.riskLevel.toUpperCase(),
    'Salud Financiera': aiData.financialHealth.toUpperCase()
  });
  
  console.log('\n📈 ASPECTOS POSITIVOS:', aiData.businessInsights);
  console.log('⚠️ ADVERTENCIAS:', aiData.warnings);
  console.log('💡 RECOMENDACIONES:', aiData.recommendations);
  console.log('================== FIN ANÁLISIS DE IA ==================\n');
}

/**
 * 💰 Imprime sugerencias de costos calculadas
 */
export function printCostSuggestionsToConsole(): void {
  const suggestions = BusinessAnalysisService.calculateFixedCostsSuggestions();
  
  if (!suggestions) {
    console.warn('⚠️ No hay datos para calcular sugerencias de costos');
    return;
  }

  console.log('\n💰 ================== SUGERENCIAS DE COSTOS ==================');
  console.table({
    'Alquiler Sugerido': `$${suggestions.rent.toLocaleString()}/mes`,
    'Personal Estimado': `$${suggestions.staff.toLocaleString()}/mes`,
    'Servicios Básicos': `$${suggestions.utilities.toLocaleString()}/mes`,
    'Seguros': `$${suggestions.insurance.toLocaleString()}/mes`,
    'TOTAL MENSUAL': `$${suggestions.total.toLocaleString()}/mes`
  });
  console.log('================== FIN SUGERENCIAS DE COSTOS ==================\n');
}

/**
 * 📈 Imprime métricas del negocio
 */
export function printBusinessMetricsToConsole(): void {
  const metrics = BusinessAnalysisService.getBusinessMetrics();
  
  if (!metrics) {
    console.warn('⚠️ No hay métricas del negocio disponibles');
    return;
  }

  console.log('\n📈 ================== MÉTRICAS DEL NEGOCIO ==================');
  console.table({
    'Estado de Viabilidad': metrics.viabilityStatus,
    'Nivel de Riesgo': metrics.riskLevel.toUpperCase(),
    'Salud Financiera': metrics.financialHealth.toUpperCase(),
    'Puntuación': `${metrics.score}/100`,
    'Días desde Análisis': metrics.daysSinceAnalysis,
    'Necesita Actualización': metrics.needsUpdate ? 'SÍ' : 'NO'
  });
  console.log('================== FIN MÉTRICAS DEL NEGOCIO ==================\n');
}

/**
 * 🔍 Imprime información de debug completa
 */
export function printDebugInfoToConsole(): void {
  const debug = BusinessAnalysisService.getDebugInfo();
  
  console.log('\n🔍 ================== INFORMACIÓN DE DEBUG ==================');
  console.table(debug);
  
  console.log('\n📦 CLAVES DE LOCALSTORAGE:');
  debug.storageKeys.forEach((key, index) => {
    const value = localStorage.getItem(key);
    const size = value ? (value.length / 1024).toFixed(2) : '0';
    console.log(`   ${index + 1}. ${key} (${size} KB)`);
  });
  console.log('================== FIN DEBUG INFO ==================\n');
}

/**
 * 📊 Imprime TODOS los datos disponibles
 */
export function printAllDataToConsole(): void {
  console.log('\n🚀 ================== TODOS LOS DATOS DEL SISTEMA ==================');
  
  printBusinessDataToConsole();
  printAIResultsToConsole();
  printCostSuggestionsToConsole();
  printBusinessMetricsToConsole();
  printDebugInfoToConsole();
  
  console.log('🚀 ================== FIN DE TODOS LOS DATOS ==================\n');
}

/**
 * 📄 Exporta todos los datos como JSON para consola
 */
export function printDataAsJSON(): void {
  const data = BusinessAnalysisService.getBusinessAnalysisData();
  
  if (!data) {
    console.warn('⚠️ No hay datos para exportar');
    return;
  }

  console.log('\n📄 ================== DATOS EN FORMATO JSON ==================');
  console.log(JSON.stringify(data, null, 2));
  console.log('================== FIN JSON ==================\n');
}

/**
 * 🎯 Función principal para acceso rápido desde consola del navegador
 */
export function showAIData(): void {
  printAIAnalysisToConsole();
}

// Exponer funciones globalmente para uso en consola del navegador
(window as any).showAIData = showAIData;
(window as any).printAllData = printAllDataToConsole;
(window as any).printBusinessData = printBusinessDataToConsole;
(window as any).printAIResults = printAIResultsToConsole;
(window as any).printCostSuggestions = printCostSuggestionsToConsole;
(window as any).printBusinessMetrics = printBusinessMetricsToConsole;
(window as any).printDebugInfo = printDebugInfoToConsole;
(window as any).printDataAsJSON = printDataAsJSON;
