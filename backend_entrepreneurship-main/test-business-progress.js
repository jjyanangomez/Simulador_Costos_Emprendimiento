const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testBusinessProgress() {
  console.log('🧪 [TEST] Iniciando pruebas de business-progress...\n');

  try {
    // Test 1: Obtener progreso de un módulo (debería ser 404 si no existe)
    console.log('1️⃣ [TEST] Probando obtener progreso de módulo inexistente...');
    const getProgressResponse = await fetch(`${BASE_URL}/business-progress/1/1`);
    console.log('✅ [TEST] GET progress:', getProgressResponse.status);
    
    if (getProgressResponse.status === 404) {
      console.log('📊 [TEST] Progreso no encontrado (esperado para módulo nuevo)');
    } else if (getProgressResponse.ok) {
      const progressData = await getProgressResponse.json();
      console.log('📊 [TEST] Progreso encontrado:', progressData);
    }

    // Test 2: Marcar módulo como completado
    console.log('\n2️⃣ [TEST] Probando marcar módulo como completado...');
    const completeResponse = await fetch(`${BASE_URL}/business-progress/1/1/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('✅ [TEST] PUT complete:', completeResponse.status);
    
    if (completeResponse.ok) {
      const completeData = await completeResponse.json();
      console.log('📊 [TEST] Módulo completado:', completeData);
    } else {
      const errorText = await completeResponse.text();
      console.log('❌ [TEST] Error al completar:', errorText);
    }

    // Test 3: Obtener progreso después de completar (debería existir ahora)
    console.log('\n3️⃣ [TEST] Probando obtener progreso después de completar...');
    const getProgressAfterResponse = await fetch(`${BASE_URL}/business-progress/1/1`);
    console.log('✅ [TEST] GET progress después:', getProgressAfterResponse.status);
    
    if (getProgressAfterResponse.ok) {
      const progressAfterData = await getProgressAfterResponse.json();
      console.log('📊 [TEST] Progreso después de completar:', progressAfterData);
      
      // Verificar que el estado sea "Completado" (id_estado = 3)
      if (progressAfterData.id_estado === 3) {
        console.log('✅ [TEST] Estado correcto: Completado');
      } else {
        console.log('⚠️ [TEST] Estado inesperado:', progressAfterData.id_estado);
      }
    } else {
      const errorText = await getProgressAfterResponse.text();
      console.log('❌ [TEST] Error al obtener progreso:', errorText);
    }

    console.log('\n🎉 [TEST] Todas las pruebas completadas!');

  } catch (error) {
    console.error('❌ [TEST] Error durante las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
testBusinessProgress();
