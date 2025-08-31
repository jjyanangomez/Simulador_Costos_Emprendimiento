// 🧪 Script de prueba para verificar la combinación de datos del negocio
// Este script debe ejecutarse en el navegador después de cargar la página

console.log('🧪 [TEST_COMBINATION] Script de prueba cargado para combinación de datos del negocio');

// Función para probar la combinación manualmente
function testBusinessDataCombination() {
  console.log('\n🚀 [TEST_COMBINATION] ===== PROBANDO COMBINACIÓN MANUAL =====');
  
  try {
    // Verificar si las utilidades están disponibles
    if (typeof window.generateCompleteBusinessData === 'function') {
      console.log('✅ Utilidad de combinación disponible');
      
      // Generar datos completos
      const completeData = window.generateCompleteBusinessData();
      console.log('📊 Datos completos generados:', completeData);
      
      // Imprimir JSON formateado
      if (typeof window.printCompleteBusinessData === 'function') {
        window.printCompleteBusinessData(true);
      }
      
    } else {
      console.log('⚠️ Utilidad de combinación no disponible, intentando importar...');
      
      // Intentar importar dinámicamente
      import('../../shared/utils/businessDataCombiner')
        .then(({ generateCompleteBusinessData, printCompleteBusinessData }) => {
          console.log('✅ Utilidad importada dinámicamente');
          
          const completeData = generateCompleteBusinessData();
          console.log('📊 Datos completos generados:', completeData);
          
          printCompleteBusinessData(true);
        })
        .catch(error => {
          console.error('❌ Error al importar utilidad:', error);
          console.log('📊 Mostrando datos básicos del localStorage:');
          
          // Mostrar datos básicos del localStorage
          const keys = Object.keys(localStorage);
          console.log('🔑 Claves en localStorage:', keys);
          
          keys.forEach(key => {
            try {
              const value = localStorage.getItem(key);
              const parsedValue = JSON.parse(value);
              console.log(`\n📁 ${key}:`, parsedValue);
            } catch (e) {
              console.log(`\n📁 ${key} (raw):`, localStorage.getItem(key));
            }
          });
        });
    }
    
  } catch (error) {
    console.error('❌ Error en prueba de combinación:', error);
  }
}

// Función para verificar el estado actual
function checkCurrentState() {
  console.log('\n🔍 [TEST_COMBINATION] ===== VERIFICANDO ESTADO ACTUAL =====');
  
  // Verificar localStorage
  const costosFijos = localStorage.getItem('costos_fijos_data');
  const businessName = localStorage.getItem('business_name');
  const businessAnalysis = localStorage.getItem('business_analysis_data');
  const businessData = localStorage.getItem('business_data_only');
  
  console.log('💰 Costos fijos:', costosFijos ? 'Disponible' : 'No disponible');
  console.log('🏢 Nombre del negocio:', businessName ? 'Disponible' : 'No disponible');
  console.log('📊 Análisis de negocio:', businessAnalysis ? 'Disponible' : 'No disponible');
  console.log('📋 Datos básicos:', businessData ? 'Disponible' : 'No disponible');
  
  if (costosFijos) {
    try {
      const parsed = JSON.parse(costosFijos);
      console.log('📊 Costos fijos parseados:', parsed);
    } catch (e) {
      console.log('❌ Error al parsear costos fijos');
    }
  }
  
  if (businessName) {
    try {
      const parsed = JSON.parse(businessName);
      console.log('🏢 Nombre del negocio parseado:', parsed);
    } catch (e) {
      console.log('❌ Error al parsear nombre del negocio');
    }
  }
}

// Función para crear datos de prueba
function createTestData() {
  console.log('\n🏗️ [TEST_COMBINATION] ===== CREANDO DATOS DE PRUEBA =====');
  
  try {
    // Crear nombre de negocio de prueba
    const testBusinessName = {
      name: 'Restaurante El Sabor - Prueba',
      history: ['Restaurante El Sabor', 'El Sabor'],
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('business_name', JSON.stringify(testBusinessName));
    console.log('✅ Nombre del negocio de prueba creado');
    
    // Crear costos fijos de prueba
    const testCostosFijos = {
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
        }
      ],
      totalMonthly: 1500,
      totalYearly: 18000,
      costBreakdown: {
        mensual: 1500,
        semestral: 0,
        anual: 0
      },
      fechaGuardado: new Date().toISOString(),
      negocioId: 'test-123'
    };
    
    localStorage.setItem('costos_fijos_data', JSON.stringify(testCostosFijos));
    console.log('✅ Costos fijos de prueba creados');
    
    // Crear análisis de negocio de prueba
    const testBusinessAnalysis = {
      businessName: 'Restaurante El Sabor - Prueba',
      businessCategory: 'Restaurante',
      sector: 'Gastronomía',
      isViable: true,
      score: 85
    };
    
    localStorage.setItem('business_analysis_data', JSON.stringify(testBusinessAnalysis));
    console.log('✅ Análisis de negocio de prueba creado');
    
    console.log('🎉 Todos los datos de prueba han sido creados');
    
  } catch (error) {
    console.error('❌ Error al crear datos de prueba:', error);
  }
}

// Función para limpiar datos de prueba
function clearTestData() {
  console.log('\n🧹 [TEST_COMBINATION] ===== LIMPIANDO DATOS DE PRUEBA =====');
  
  try {
    localStorage.removeItem('costos_fijos_data');
    localStorage.removeItem('business_name');
    localStorage.removeItem('business_analysis_data');
    localStorage.removeItem('business_data_only');
    
    console.log('✅ Todos los datos de prueba han sido limpiados');
    
  } catch (error) {
    console.error('❌ Error al limpiar datos de prueba:', error);
  }
}

// Función principal
function main() {
  console.log('🎯 [TEST_COMBINATION] ===== SCRIPT DE PRUEBA CARGADO =====');
  console.log('📋 Funciones disponibles:');
  console.log('   - testBusinessDataCombination() - Probar combinación de datos');
  console.log('   - checkCurrentState() - Verificar estado actual');
  console.log('   - createTestData() - Crear datos de prueba');
  console.log('   - clearTestData() - Limpiar datos de prueba');
  console.log('   - main() - Ejecutar función principal');
  
  console.log('\n💡 Para probar la combinación, escribe en la consola:');
  console.log('   testBusinessDataCombination()');
  
  // Verificar estado inicial
  checkCurrentState();
}

// Ejecutar función principal
main();

// Exportar funciones para uso global
window.testBusinessDataCombination = testBusinessDataCombination;
window.checkCurrentState = checkCurrentState;
window.createTestData = createTestData;
window.clearTestData = clearTestData;
