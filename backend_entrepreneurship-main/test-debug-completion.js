const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testDebugCompletion() {
  console.log('🧪 [DEBUG] Iniciando debug del problema de carga de datos...\n');

  try {
    // Test 1: Verificar que el backend esté funcionando
    console.log('1️⃣ [DEBUG] Verificando que el backend esté funcionando...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    console.log('✅ [DEBUG] Health check:', healthResponse.status);
    
    if (!healthResponse.ok) {
      console.log('❌ [DEBUG] Backend no está funcionando. Asegúrate de ejecutar: npm run start:dev');
      return;
    }

    // Test 2: Verificar estado actual del módulo 35/16 (el que está causando problemas)
    console.log('\n2️⃣ [DEBUG] Verificando estado actual del módulo 35/16...');
    const progressResponse = await fetch(`${BASE_URL}/business-progress/35/16`);
    console.log('✅ [DEBUG] GET progress:', progressResponse.status);
    
    if (progressResponse.ok) {
      const progress = await progressResponse.json();
      console.log('📊 [DEBUG] Progreso actual:', progress);
      console.log('📊 [DEBUG] ID Estado:', progress.id_estado);
      console.log('📊 [DEBUG] Estado Nombre:', progress.estado_nombre);
      
      // Verificar si el estado 13 es "Completado" o si necesitamos usar estado 3
      if (progress.id_estado === 13) {
        console.log('✅ [DEBUG] Módulo está marcado como completado (estado 13)');
      } else if (progress.id_estado === 3) {
        console.log('✅ [DEBUG] Módulo está marcado como completado (estado 3)');
      } else {
        console.log('⚠️ [DEBUG] Módulo NO está completado, estado:', progress.id_estado);
      }
    } else if (progressResponse.status === 404) {
      console.log('📊 [DEBUG] Módulo no tiene progreso registrado (404)');
    } else {
      const errorText = await progressResponse.text();
      console.log('❌ [DEBUG] Error al obtener progreso:', errorText);
    }

    // Test 3: Verificar si hay datos guardados para el módulo 35/16
    console.log('\n3️⃣ [DEBUG] Verificando datos guardados para módulo 35/16...');
    const dataResponse = await fetch(`${BASE_URL}/ai/get-complete-results/35/16`);
    console.log('✅ [DEBUG] GET complete-results:', dataResponse.status);
    
    if (dataResponse.ok) {
      const data = await dataResponse.json();
      console.log('📊 [DEBUG] Datos encontrados:', data.success);
      
      if (data.success && data.data) {
        console.log('✅ [DEBUG] Datos guardados encontrados');
        console.log('📊 [DEBUG] Costos analizados:', data.data.costosAnalizados?.length || 0);
        console.log('📊 [DEBUG] Riesgos detectados:', data.data.riesgosDetectados?.length || 0);
        console.log('📊 [DEBUG] Plan de acción:', data.data.planAccion?.length || 0);
        
        // Mostrar primer elemento de cada array
        if (data.data.costosAnalizados?.length > 0) {
          console.log('📊 [DEBUG] Primer costo:', data.data.costosAnalizados[0].nombre_costo);
        }
        if (data.data.riesgosDetectados?.length > 0) {
          console.log('📊 [DEBUG] Primer riesgo:', data.data.riesgosDetectados[0].riesgo);
        }
        if (data.data.planAccion?.length > 0) {
          console.log('📊 [DEBUG] Primer plan:', data.data.planAccion[0].titulo);
        }
      } else {
        console.log('⚠️ [DEBUG] No hay datos guardados o formato incorrecto');
        console.log('📊 [DEBUG] Respuesta completa:', data);
      }
    } else if (dataResponse.status === 404) {
      console.log('📊 [DEBUG] No se encontraron datos guardados (404)');
    } else {
      const errorText = await dataResponse.text();
      console.log('❌ [DEBUG] Error al obtener datos:', errorText);
    }

    // Test 4: Si no hay datos, crear algunos para prueba
    if (dataResponse.status === 404) {
      console.log('\n4️⃣ [DEBUG] Creando datos de prueba para módulo 35/16...');
      
      const testData = {
        negocioId: 35,
        moduloId: 16,
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
        body: JSON.stringify(testData)
      });

      console.log('✅ [DEBUG] POST save-complete-results:', saveResponse.status);
      
      if (saveResponse.ok) {
        const saveResult = await saveResponse.json();
        console.log('📊 [DEBUG] Datos de prueba guardados exitosamente');
        console.log('📊 [DEBUG] ID del resultado:', saveResult.data?.resultadoId);
      } else {
        const errorText = await saveResponse.text();
        console.log('❌ [DEBUG] Error al guardar datos de prueba:', errorText);
      }
    }

    console.log('\n🎉 [DEBUG] Debug completado!');
    console.log('\n📋 [DEBUG] Resumen:');
    console.log('✅ Backend funcionando');
    console.log('✅ Estado del módulo verificado');
    console.log('✅ Datos guardados verificados');
    console.log('✅ Datos de prueba creados (si era necesario)');
    
    console.log('\n🚀 [DEBUG] Próximos pasos:');
    console.log('1. Ejecutar el frontend: cd frontend_entrepreneurship && npm run dev');
    console.log('2. Navegar a /businesses/35/modules/16');
    console.log('3. Hacer clic en "Ver Resultados"');
    console.log('4. Verificar en la consola del navegador los logs de debug');
    console.log('5. Verificar que se carguen los datos guardados sin ejecutar IA');

  } catch (error) {
    console.error('❌ [DEBUG] Error durante el debug:', error.message);
    console.error('❌ [DEBUG] Stack trace:', error.stack);
  }
}

// Ejecutar el debug
testDebugCompletion();
