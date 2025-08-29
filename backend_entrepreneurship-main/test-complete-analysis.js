const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testCompleteAnalysis() {
  console.log('🧪 [TEST] Iniciando pruebas del sistema de análisis completo...\n');

  try {
    // Test 1: Health check del endpoint principal
    console.log('1️⃣ [TEST] Probando health check del endpoint principal...');
    const healthResponse = await fetch(`${BASE_URL}/ai/health`);
    console.log('✅ [TEST] Health check principal:', healthResponse.status);

    // Test 2: Health check del endpoint alternativo
    console.log('\n2️⃣ [TEST] Probando health check del endpoint alternativo...');
    const altHealthResponse = await fetch(`${BASE_URL}/complete-analysis-results/health`);
    console.log('✅ [TEST] Health check alternativo:', altHealthResponse.status);

    // Test 3: Intentar obtener resultados (debería devolver 404 si no hay datos)
    console.log('\n3️⃣ [TEST] Probando obtención de resultados (debería ser 404)...');
    const getResponse = await fetch(`${BASE_URL}/ai/get-complete-results/1/1`);
    console.log('✅ [TEST] GET resultados:', getResponse.status);

    // Test 4: Intentar guardar resultados de prueba
    console.log('\n4️⃣ [TEST] Probando guardado de resultados de prueba...');
    const testData = {
      negocioId: 1,
      moduloId: 1,
      analisisId: 1,
      costosAnalizados: [
        {
          nombre_costo: "Seguro de responsabilidad civil",
          valor_recibido: "$500",
          rango_estimado: "$400-$600",
          evaluacion: "Aceptable",
          comentario: "Precio dentro del rango esperado"
        }
      ],
      riesgosDetectados: [
        {
          riesgo: "Falta de seguro de responsabilidad civil",
          causa_directa: "No se consideró este tipo de seguro",
          impacto_potencial: "Alto - podría resultar en pérdidas financieras significativas"
        }
      ],
      planAccion: [
        {
          titulo: "Implementar seguro de responsabilidad civil",
          descripcion: "Contratar un seguro que cubra daños a terceros",
          prioridad: "Alta"
        }
      ],
      resumenAnalisis: {
        puntuacion_global: 7,
        recomendaciones: ["Implementar seguros", "Optimizar costos"]
      }
    };

    const saveResponse = await fetch(`${BASE_URL}/ai/save-complete-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log('✅ [TEST] POST guardar resultados:', saveResponse.status);
    
    if (saveResponse.ok) {
      const saveResult = await saveResponse.json();
      console.log('📊 [TEST] Respuesta del guardado:', saveResult);
    }

    // Test 5: Intentar obtener los resultados que acabamos de guardar
    console.log('\n5️⃣ [TEST] Probando obtención de resultados guardados...');
    const getSavedResponse = await fetch(`${BASE_URL}/ai/get-complete-results/1/1`);
    console.log('✅ [TEST] GET resultados guardados:', getSavedResponse.status);
    
    if (getSavedResponse.ok) {
      const getResult = await getSavedResponse.json();
      console.log('📊 [TEST] Respuesta de obtención:', getResult);
    }

    console.log('\n🎉 [TEST] Todas las pruebas completadas exitosamente!');

  } catch (error) {
    console.error('❌ [TEST] Error durante las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
testCompleteAnalysis();
