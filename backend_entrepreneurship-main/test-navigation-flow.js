const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testNavigationFlow() {
  console.log('🧪 [TEST] Iniciando pruebas del flujo de navegación...\n');

  try {
    // Test 1: Verificar que el backend esté funcionando
    console.log('1️⃣ [TEST] Verificando que el backend esté funcionando...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    console.log('✅ [TEST] Health check:', healthResponse.status);
    
    if (!healthResponse.ok) {
      console.log('❌ [TEST] Backend no está funcionando. Asegúrate de ejecutar: npm run start:dev');
      return;
    }

    // Test 2: Verificar que el módulo no esté completado inicialmente
    console.log('\n2️⃣ [TEST] Verificando estado inicial del módulo...');
    const initialProgressResponse = await fetch(`${BASE_URL}/business-progress/1/1`);
    console.log('✅ [TEST] GET progress inicial:', initialProgressResponse.status);
    
    if (initialProgressResponse.status === 404) {
      console.log('📊 [TEST] Módulo no completado (esperado)');
    } else if (initialProgressResponse.ok) {
      const progress = await initialProgressResponse.json();
      console.log('📊 [TEST] Módulo ya tiene progreso:', progress.id_estado);
    }

    // Test 3: Guardar datos de análisis completo
    console.log('\n3️⃣ [TEST] Guardando datos de análisis completo...');
    const testAnalysisData = {
      negocioId: 1,
      moduloId: 1,
      analisisId: 1,
      costosAnalizados: [
        {
          nombre_costo: "Alquiler",
          valor_recibido: "$350",
          rango_estimado: "$500-2000/mes",
          evaluacion: "⚠️ Dentro del rango, pero por debajo del promedio",
          comentario: "El valor de alquiler de $350 se encuentra dentro del rango esperado..."
        }
      ],
      riesgosDetectados: [
        {
          riesgo: "Subestimación de Costos Legales",
          causa_directa: "Los costos de patente y permisos están por debajo del rango de mercado.",
          probabilidad: "Alta",
          impacto: "Posibles multas o sanciones por incumplimiento de regulaciones."
        }
      ],
      planAccion: [
        {
          titulo: "Auditoría Urgente de Permisos",
          descripcion: "Contactar al Cuerpo de Bomberos para verificar costos.",
          prioridad: "Crítica",
          plazo: "Inmediato (1 semana)",
          inversion: "$0 (tiempo propio)",
          impacto_esperado: "Reducción potencial de $10-$25 mensuales."
        }
      ],
      resumenAnalisis: {
        puntuacion_global: 7,
        recomendaciones: ["Implementar seguros", "Optimizar costos"],
        conclusiones: "El negocio presenta costos operativos por debajo del mercado."
      }
    };

    const saveResponse = await fetch(`${BASE_URL}/ai/save-complete-results`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testAnalysisData)
    });

    console.log('✅ [TEST] POST save-complete-results:', saveResponse.status);
    
    if (saveResponse.ok) {
      const saveResult = await saveResponse.json();
      console.log('📊 [TEST] Datos guardados exitosamente');
      console.log('📊 [TEST] ID del resultado:', saveResult.data?.resultadoId);
    } else {
      const errorText = await saveResponse.text();
      console.log('❌ [TEST] Error al guardar:', errorText);
      return;
    }

    // Test 4: Marcar módulo como completado
    console.log('\n4️⃣ [TEST] Marcando módulo como completado...');
    const completeResponse = await fetch(`${BASE_URL}/business-progress/1/1/complete`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('✅ [TEST] PUT complete:', completeResponse.status);
    
    if (completeResponse.ok) {
      const completeResult = await completeResponse.json();
      console.log('📊 [TEST] Módulo completado exitosamente');
      console.log('📊 [TEST] Estado final:', completeResult.data?.estado);
    } else {
      const errorText = await completeResponse.text();
      console.log('❌ [TEST] Error al completar módulo:', errorText);
      return;
    }

    // Test 5: Verificar que el módulo esté completado
    console.log('\n5️⃣ [TEST] Verificando que el módulo esté completado...');
    const finalProgressResponse = await fetch(`${BASE_URL}/business-progress/1/1`);
    console.log('✅ [TEST] GET progress final:', finalProgressResponse.status);
    
    if (finalProgressResponse.ok) {
      const finalProgress = await finalProgressResponse.json();
      console.log('📊 [TEST] Progreso final obtenido');
      console.log('📊 [TEST] ID Estado:', finalProgress.id_estado);
      console.log('📊 [TEST] Estado Nombre:', finalProgress.estado_nombre);
      
      if (finalProgress.id_estado === 3) {
        console.log('✅ [TEST] Módulo correctamente marcado como completado');
      } else {
        console.log('⚠️ [TEST] Estado inesperado:', finalProgress.id_estado);
        return;
      }
    } else {
      const errorText = await finalProgressResponse.text();
      console.log('❌ [TEST] Error al obtener progreso final:', errorText);
      return;
    }

    // Test 6: Recuperar datos guardados
    console.log('\n6️⃣ [TEST] Recuperando datos guardados...');
    const getDataResponse = await fetch(`${BASE_URL}/ai/get-complete-results/1/1`);
    console.log('✅ [TEST] GET complete-results:', getDataResponse.status);
    
    if (getDataResponse.ok) {
      const retrievedData = await getDataResponse.json();
      console.log('📊 [TEST] Datos recuperados exitosamente');
      
      if (retrievedData.success && retrievedData.data) {
        console.log('✅ [TEST] Estructura de datos correcta');
        console.log('📊 [TEST] Costos analizados:', retrievedData.data.costosAnalizados?.length || 0, 'elementos');
        console.log('📊 [TEST] Riesgos detectados:', retrievedData.data.riesgosDetectados?.length || 0, 'elementos');
        console.log('📊 [TEST] Plan de acción:', retrievedData.data.planAccion?.length || 0, 'elementos');
      } else {
        console.log('⚠️ [TEST] Datos no encontrados o formato inesperado');
        return;
      }
    } else {
      const errorText = await getDataResponse.text();
      console.log('❌ [TEST] Error al recuperar datos:', errorText);
      return;
    }

    console.log('\n🎉 [TEST] Flujo completo probado exitosamente!');
    console.log('\n📋 [TEST] Resumen de la prueba:');
    console.log('✅ Backend funcionando');
    console.log('✅ Guardado de datos completos');
    console.log('✅ Marcado de módulo como completado');
    console.log('✅ Verificación de estado completado');
    console.log('✅ Recuperación de datos guardados');
    console.log('✅ Validación de estructura de datos');
    
    console.log('\n🚀 [TEST] Próximos pasos para probar en el frontend:');
    console.log('1. Ejecutar el frontend: cd frontend_entrepreneurship && npm run dev');
    console.log('2. Navegar a un módulo y completarlo');
    console.log('3. Verificar que el botón "Guardar y Continuar" navegue al Learning Path');
    console.log('4. Verificar que al volver al módulo se carguen los datos guardados');

  } catch (error) {
    console.error('❌ [TEST] Error durante las pruebas:', error.message);
    console.error('❌ [TEST] Stack trace:', error.stack);
  }
}

// Ejecutar las pruebas
testNavigationFlow();
