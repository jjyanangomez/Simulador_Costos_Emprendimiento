const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testActionPlan() {
  console.log('🧪 [TEST] Iniciando pruebas del endpoint action-plan...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ [TEST] Probando health check...');
    const healthResponse = await fetch(`${BASE_URL}/action-plan/health`);
    console.log('✅ [TEST] Health check:', healthResponse.status);

    // Test 2: Crear múltiples planes de acción
    console.log('\n2️⃣ [TEST] Probando creación de múltiples planes de acción...');
    const testData = {
      results: [
        {
          analisisId: 1,
          titulo: "Implementar seguro de responsabilidad civil",
          descripcion: "Contratar un seguro que cubra daños a terceros",
          prioridad: "Alta"
        },
        {
          analisisId: 1,
          titulo: "Optimizar costos operativos",
          descripcion: "Revisar y reducir gastos innecesarios",
          prioridad: "Media"
        },
        {
          analisisId: 1,
          titulo: "Mejorar gestión de inventario",
          descripcion: "Implementar sistema de control de stock",
          prioridad: "Baja"
        }
      ]
    };

    console.log('📊 [TEST] Datos a enviar:', JSON.stringify(testData, null, 2));

    const createResponse = await fetch(`${BASE_URL}/action-plan/multiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('✅ [TEST] POST createMultiple:', createResponse.status);
    
    if (createResponse.ok) {
      const result = await createResponse.json();
      console.log('📊 [TEST] Respuesta del servidor:', JSON.stringify(result, null, 2));
    } else {
      const errorText = await createResponse.text();
      console.log('❌ [TEST] Error del servidor:', errorText);
    }

    // Test 3: Obtener todos los planes de acción
    console.log('\n3️⃣ [TEST] Probando obtención de todos los planes de acción...');
    const getAllResponse = await fetch(`${BASE_URL}/action-plan`);
    console.log('✅ [TEST] GET all:', getAllResponse.status);
    
    if (getAllResponse.ok) {
      const allResults = await getAllResponse.json();
      console.log('📊 [TEST] Total de planes de acción:', allResults.length);
    }

    // Test 4: Obtener planes de acción por análisis ID
    console.log('\n4️⃣ [TEST] Probando obtención por análisis ID...');
    const getByAnalysisResponse = await fetch(`${BASE_URL}/action-plan/analysis/1`);
    console.log('✅ [TEST] GET by analysis ID:', getByAnalysisResponse.status);
    
    if (getByAnalysisResponse.ok) {
      const analysisResults = await getByAnalysisResponse.json();
      console.log('📊 [TEST] Planes de acción para análisis 1:', analysisResults.length);
    }

    console.log('\n🎉 [TEST] Todas las pruebas completadas!');

  } catch (error) {
    console.error('❌ [TEST] Error durante las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
testActionPlan();
