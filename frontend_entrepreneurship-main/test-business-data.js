// 🧪 Script de prueba para combinar información de la empresa con costos fijos
// Este script debe ejecutarse en el navegador después de importar la utilidad

console.log('🧪 [TEST_SCRIPT] Iniciando prueba de combinación de datos del negocio...');

// Función para ejecutar todas las pruebas
function runAllTests() {
  console.log('\n🚀 [TEST_SCRIPT] ===== EJECUTANDO TODAS LAS PRUEBAS =====\n');
  
  try {
    // 1. Generar datos completos
    console.log('📋 PRUEBA 1: Generando datos completos...');
    const completeData = window.generateCompleteBusinessData();
    console.log('✅ Datos completos generados:', completeData);
    
    // 2. Imprimir JSON completo
    console.log('\n📋 PRUEBA 2: Imprimiendo JSON completo...');
    window.printCompleteBusinessData(true);
    
    // 3. Imprimir resumen ejecutivo
    console.log('\n📋 PRUEBA 3: Imprimiendo resumen ejecutivo...');
    window.printBusinessSummary();
    
    // 4. Buscar información específica
    console.log('\n📋 PRUEBA 4: Buscando información específica...');
    window.searchBusinessData('costo');
    
    console.log('\n🎉 [TEST_SCRIPT] Todas las pruebas ejecutadas exitosamente!');
    
  } catch (error) {
    console.error('❌ [TEST_SCRIPT] Error durante las pruebas:', error);
  }
}

// Función para probar funcionalidades individuales
function testIndividualFeatures() {
  console.log('\n🔧 [TEST_SCRIPT] ===== PROBANDO FUNCIONALIDADES INDIVIDUALES =====\n');
  
  try {
    // Probar solo la generación de datos
    console.log('📋 Generando solo datos...');
    const data = window.generateCompleteBusinessData();
    console.log('Datos generados:', data);
    
    // Probar solo el resumen
    console.log('\n📋 Generando solo resumen...');
    window.printBusinessSummary();
    
    // Probar solo la búsqueda
    console.log('\n📋 Probando búsqueda...');
    window.searchBusinessData('negocio');
    
  } catch (error) {
    console.error('❌ Error en pruebas individuales:', error);
  }
}

// Función para mostrar información del localStorage
function showLocalStorageInfo() {
  console.log('\n💾 [TEST_SCRIPT] ===== INFORMACIÓN DEL LOCALSTORAGE =====\n');
  
  try {
    // Mostrar todas las claves del localStorage
    const keys = Object.keys(localStorage);
    console.log('🔑 Claves disponibles en localStorage:', keys);
    
    // Mostrar contenido de cada clave
    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        const parsedValue = JSON.parse(value);
        console.log(`\n📁 Clave: ${key}`);
        console.log('   Valor:', parsedValue);
      } catch (e) {
        console.log(`\n📁 Clave: ${key}`);
        console.log('   Valor (raw):', localStorage.getItem(key));
      }
    });
    
  } catch (error) {
    console.error('❌ Error al mostrar localStorage:', error);
  }
}

// Función para limpiar datos de prueba
function clearTestData() {
  console.log('\n🧹 [TEST_SCRIPT] ===== LIMPIANDO DATOS DE PRUEBA =====\n');
  
  try {
    // Limpiar costos fijos
    if (window.LocalStorageService) {
      window.LocalStorageService.limpiarCostosFijos();
      console.log('✅ Costos fijos limpiados');
    }
    
    // Limpiar nombre del negocio
    if (window.clearBusinessName) {
      window.clearBusinessName();
      console.log('✅ Nombre del negocio limpiado');
    }
    
    // Limpiar análisis de negocio
    if (window.BusinessAnalysisService) {
      window.BusinessAnalysisService.clearAllData();
      console.log('✅ Análisis de negocio limpiado');
    }
    
    console.log('🎉 Todos los datos de prueba han sido limpiados');
    
  } catch (error) {
    console.error('❌ Error al limpiar datos:', error);
  }
}

// Función para crear datos de prueba
function createTestData() {
  console.log('\n🏗️ [TEST_SCRIPT] ===== CREANDO DATOS DE PRUEBA =====\n');
  
  try {
    // Crear nombre de negocio de prueba
    if (window.saveBusinessName) {
      window.saveBusinessName('Restaurante El Sabor');
      console.log('✅ Nombre de negocio de prueba creado');
    }
    
    // Crear costos fijos de prueba
    if (window.LocalStorageService) {
      const testData = {
        costos: [
          {
            name: 'Arriendo del Local',
            description: 'Alquiler mensual del local comercial',
            amount: 1200,
            frequency: 'mensual',
            category: 'Alquiler'
          },
          {
            name: 'Servicios Básicos',
            description: 'Agua, luz, gas e internet',
            amount: 300,
            frequency: 'mensual',
            category: 'Servicios'
          },
          {
            name: 'Seguro de Responsabilidad',
            description: 'Seguro anual contra daños',
            amount: 2400,
            frequency: 'anual',
            category: 'Seguros'
          }
        ],
        totalMonthly: 1500,
        totalYearly: 18000,
        costBreakdown: {
          mensual: 1500,
          semestral: 0,
          anual: 2400
        },
        fechaGuardado: new Date().toISOString(),
        negocioId: 'test-123'
      };
      
      window.LocalStorageService.guardarCostosFijos(testData);
      console.log('✅ Costos fijos de prueba creados');
    }
    
    // Crear análisis de negocio de prueba
    if (window.BusinessAnalysisService) {
      const testBusinessData = {
        businessName: 'Restaurante El Sabor',
        businessCategory: 'Restaurante',
        sector: 'Gastronomía',
        exactLocation: 'Centro Comercial Plaza Mayor',
        businessSize: 'Mediano',
        capacity: 50,
        financingType: 'Mixto',
        totalInvestment: 25000,
        ownCapital: 15000,
        loanCapital: 10000,
        interestRate: 8.5,
        investmentItems: [
          { description: 'Equipos de cocina', amount: 15000, quantity: 1 },
          { description: 'Mobiliario', amount: 8000, quantity: 1 },
          { description: 'Decoración', amount: 2000, quantity: 1 }
        ]
      };
      
      const testAnalysisData = {
        isViable: true,
        score: 85,
        riskLevel: 'medium',
        financialHealth: 'good',
        recommendations: ['Mantener control de costos', 'Diversificar menú'],
        warnings: ['Competencia alta en la zona'],
        businessInsights: ['Mercado en crecimiento', 'Buena ubicación']
      };
      
      window.BusinessAnalysisService.saveBusinessAnalysis(testBusinessData, testAnalysisData);
      console.log('✅ Análisis de negocio de prueba creado');
    }
    
    console.log('🎉 Todos los datos de prueba han sido creados');
    
  } catch (error) {
    console.error('❌ Error al crear datos de prueba:', error);
  }
}

// Función principal que se ejecuta al cargar
function main() {
  console.log('🎯 [TEST_SCRIPT] ===== SCRIPT DE PRUEBA CARGADO =====');
  console.log('📋 Funciones disponibles:');
  console.log('   - runAllTests() - Ejecuta todas las pruebas');
  console.log('   - testIndividualFeatures() - Prueba funcionalidades individuales');
  console.log('   - showLocalStorageInfo() - Muestra información del localStorage');
  console.log('   - createTestData() - Crea datos de prueba');
  console.log('   - clearTestData() - Limpia datos de prueba');
  console.log('   - main() - Ejecuta la función principal');
  
  console.log('\n💡 Para ejecutar las pruebas, escribe en la consola:');
  console.log('   runAllTests()');
  
  // Verificar si las utilidades están disponibles
  if (typeof window.generateCompleteBusinessData === 'function') {
    console.log('✅ Utilidades disponibles - Listo para usar');
  } else {
    console.log('⚠️ Utilidades no disponibles - Asegúrate de importar businessDataCombiner.ts');
  }
}

// Ejecutar función principal
main();

// Exportar funciones para uso global
window.runAllTests = runAllTests;
window.testIndividualFeatures = testIndividualFeatures;
window.showLocalStorageInfo = showLocalStorageInfo;
window.createTestData = createTestData;
window.clearTestData = clearTestData;
