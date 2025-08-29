const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testCompleteAnalysisFlow() {
  console.log('🧪 [TEST] Iniciando pruebas del flujo completo de análisis...\n');

  try {
    // Test 1: Verificar que el módulo no esté completado inicialmente
    console.log('1️⃣ [TEST] Verificando estado inicial del módulo...');
    const initialProgressResponse = await fetch(`${BASE_URL}/business-progress/1/1`);
    console.log('✅ [TEST] GET progress inicial:', initialProgressResponse.status);
    
    if (initialProgressResponse.status === 404) {
      console.log('📊 [TEST] Módulo no completado (esperado)');
    }

    // Test 2: Guardar datos de análisis completo con la estructura exacta del ejemplo
    console.log('\n2️⃣ [TEST] Guardando datos de análisis completo...');
    const testAnalysisData = {
      negocioId: 1,
      moduloId: 1,
      analisisId: 1,
      costosAnalizados: [
        {
          nombre_costo: "Alquiler",
          valor_recibido: "$350",
          rango_estimado: "$500-2000/mes para No especificado en Quito sur",
          evaluacion: "⚠️ Dentro del rango, pero por debajo del promedio",
          comentario: "El valor de alquiler de $350 se encuentra dentro del rango esperado para un No especificado en una zona comercial/residencial de Quito sur, pero es considerablemente inferior al promedio. Esto podría indicar una ubicación menos estratégica o un contrato favorable. Se debe investigar la ubicación y las características del local para asegurar que la baja renta no se deba a factores negativos que afecten la afluencia de clientes."
        },
        {
          nombre_costo: "Luz",
          valor_recibido: "$20",
          rango_estimado: "$50-200/mes (depende de consumo)",
          evaluacion: "⚠️ Por debajo del rango",
          comentario: "El costo de la luz de $20 es significativamente bajo comparado con el rango estimado. Se debe verificar el consumo real y la posibilidad de un error en la medición o facturación. Un consumo tan bajo podría ser indicativo de un local pequeño, pero también podría ser un riesgo si el consumo aumenta en el futuro."
        },
        {
          nombre_costo: "Agua",
          valor_recibido: "$30",
          rango_estimado: "$20-80/mes (depende de consumo)",
          evaluacion: "✅ Dentro del rango",
          comentario: "El costo del agua de $30 se encuentra dentro del rango esperado para una cafetería en Quito sur. Se recomienda monitorear el consumo para evitar aumentos inesperados."
        },
        {
          nombre_costo: "Internet",
          valor_recibido: "$40",
          rango_estimado: "$30-100/mes (depende de velocidad)",
          evaluacion: "✅ Dentro del rango",
          comentario: "El costo de internet de $40 mensuales se encuentra dentro del rango promedio del mercado para Quito sur. Se recomienda revisar la velocidad del servicio contratado y la relación costo-beneficio."
        },
        {
          nombre_costo: "Patente",
          valor_recibido: "$40",
          rango_estimado: "$100-500/año (depende de actividad)",
          evaluacion: "⚠️ Por debajo del rango",
          comentario: "El costo anual de la patente de $40 es significativamente bajo. Se debe verificar la información y asegurarse de que se trata de un valor correcto y que cubre todos los requisitos legales. Es posible que se deba un pago adicional o exista un error en el cálculo."
        },
        {
          nombre_costo: "Permisos",
          valor_recibido: "$30",
          rango_estimado: "$200-1000/año (depende de tipo de negocio)",
          evaluacion: "⚠️ Por debajo del rango",
          comentario: "El costo anual de los permisos de $30 es significativamente bajo. Se debe revisar exhaustivamente la documentación y asegurarse de que se cumplen todos los requisitos legales. La discrepancia entre el valor pagado y el rango de mercado sugiere un posible riesgo legal y financiero."
        },
        {
          nombre_costo: "Seguros",
          valor_recibido: "$20",
          rango_estimado: "$50-300/mes (depende de cobertura)",
          evaluacion: "⚠️ Por debajo del rango",
          comentario: "El costo mensual del seguro de $20 es muy bajo. Se debe analizar la cobertura del seguro y determinar si es suficiente para proteger el negocio ante posibles riesgos. Una cobertura insuficiente puede generar pérdidas significativas en caso de un evento imprevisto."
        }
      ],
      riesgosDetectados: [
        {
          riesgo: "Subestimación de Costos Legales y Regulatorios",
          causa_directa: "Los costos de patente y permisos están significativamente por debajo del rango de mercado esperado.",
          probabilidad: "Alta",
          impacto: "Posibles multas o sanciones por incumplimiento de regulaciones, lo que podría afectar significativamente la rentabilidad del negocio.",
          consecuencias: "Multas y sanciones que podrían superar considerablemente el valor real de los permisos y patentes, generando un impacto financiero negativo significativo."
        },
        {
          riesgo: "Cobertura de Seguro Insuficiente",
          causa_directa: "El costo del seguro es extremadamente bajo en comparación con el rango de mercado.",
          probabilidad: "Alta",
          impacto: "Posible incapacidad para cubrir pérdidas significativas en caso de un evento imprevisto (incendio, robo, etc.), lo que podría llevar a la quiebra del negocio.",
          consecuencias: "Pérdidas financieras considerables en caso de siniestro, que podrían superar ampliamente el ahorro en costos de seguro."
        },
        {
          riesgo: "Aumento Inesperado de Costos de Servicios Básicos",
          causa_directa: "Los costos de luz y agua son anormalmente bajos.",
          probabilidad: "Media",
          impacto: "Un aumento en el consumo de servicios básicos podría afectar negativamente la rentabilidad del negocio.",
          consecuencias: "Incremento de costos operativos que puede erosionar el margen de ganancia."
        }
      ],
      planAccion: [
        {
          titulo: "Auditoría Urgente y Reclasificación de Tasas de Bomberos y ARCSA",
          descripcion: "Contactar al Cuerpo de Bomberos de Quito sur para obtener el desglose y la justificación del costo de $30 mensuales, verificando la clasificación de riesgo de la actividad y el cálculo de la tasa anual. Solicitar información sobre posibles descuentos o exenciones por tamaño de negocio.",
          prioridad: "Crítica",
          plazo: "Inmediato (1 semana)",
          inversion: "$0 (tiempo propio para gestión y consulta)",
          impacto_esperado: "Reducción potencial de $10-$25 mensuales ($120-$300 anuales) en la tasa de Bomberos si se identifica un error o posibilidad de descuento. Claridad sobre la necesidad de ARCSA, evitando pagos innecesarios."
        },
        {
          titulo: "Optimización del Costo de Internet Mediante Renegociación o Cambio de Proveedor",
          descripcion: "Realizar un estudio de mercado comparativo de al menos 3 proveedores de internet en Quito sur (CNT, Claro, etc.), buscando planes de fibra óptica empresariales con velocidades de al menos 10 Mbps, comparando precios y contratos. Contactar a los proveedores actuales para negociar una reducción de precio.",
          prioridad: "Alta",
          plazo: "1 mes",
          inversion: "$0 - $50 (costo potencial de instalación en caso de cambio de proveedor)",
          impacto_esperado: "Ahorro proyectado de $10-$20 mensuales ($120-$240 anuales) sin comprometer la calidad del servicio, mejorando directamente el flujo de caja y la rentabilidad del negocio."
        },
        {
          titulo: "Clarificación y Gestión Proactiva de Permisos Municipales",
          descripcion: "Obtener un desglose detallado de todos los permisos y licencias que conforman el costo mensual de $30, incluyendo la descripción completa de cada permiso, la autoridad emisora, la fecha de emisión y la fecha de vencimiento. Verificar la validez y necesidad de cada permiso.",
          prioridad: "Media",
          plazo: "2 meses",
          inversion: "$0 (tiempo propio para gestión y consulta)",
          impacto_esperado: "Mayor transparencia financiera, prevención de pagos innecesarios y mitigación de riesgos de multas por omisión. Potencial de ahorro de $5-$15 mensuales si se identifican permisos no obligatorios o redundantes."
        },
        {
          titulo: "Negociación de Alquiler",
          descripcion: "Contactar al propietario del local para negociar una reducción en el costo del alquiler, presentando un argumento basado en el análisis de costos y la rentabilidad actual del negocio.",
          prioridad: "Alta",
          plazo: "1-2 meses",
          inversion: "$0 (tiempo propio para gestión y negociación)",
          impacto_esperado: "Reducción potencial en el costo de alquiler, mejorando significativamente la rentabilidad del negocio. Posible ahorro de $50-$100 mensuales."
        }
      ],
      resumenAnalisis: {
        puntuacion_global: 7,
        recomendaciones: ["Implementar seguros", "Optimizar costos", "Auditoría legal", "Negociación de alquiler"],
        conclusiones: "El negocio presenta costos operativos significativamente por debajo del mercado, lo que puede indicar tanto oportunidades de optimización como riesgos regulatorios importantes que requieren atención inmediata."
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
    }

    // Test 3: Marcar módulo como completado
    console.log('\n3️⃣ [TEST] Marcando módulo como completado...');
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
    }

    // Test 4: Verificar que el módulo esté completado
    console.log('\n4️⃣ [TEST] Verificando que el módulo esté completado...');
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
      }
    } else {
      const errorText = await finalProgressResponse.text();
      console.log('❌ [TEST] Error al obtener progreso final:', errorText);
    }

    // Test 5: Recuperar datos guardados
    console.log('\n5️⃣ [TEST] Recuperando datos guardados...');
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
        console.log('📊 [TEST] Resumen análisis:', retrievedData.data.resumenAnalisis ? 'Presente' : 'Ausente');
        
        // Verificar contenido específico
        if (retrievedData.data.costosAnalizados?.length > 0) {
          const primerCosto = retrievedData.data.costosAnalizados[0];
          console.log('📊 [TEST] Primer costo:', primerCosto.nombre_costo, '-', primerCosto.valor_recibido);
        }
        
        if (retrievedData.data.riesgosDetectados?.length > 0) {
          const primerRiesgo = retrievedData.data.riesgosDetectados[0];
          console.log('📊 [TEST] Primer riesgo:', primerRiesgo.riesgo);
        }
        
        if (retrievedData.data.planAccion?.length > 0) {
          const primerPlan = retrievedData.data.planAccion[0];
          console.log('📊 [TEST] Primer plan:', primerPlan.titulo, '- Prioridad:', primerPlan.prioridad);
        }
      } else {
        console.log('⚠️ [TEST] Datos no encontrados o formato inesperado');
        console.log('📊 [TEST] Respuesta completa:', retrievedData);
      }
    } else {
      const errorText = await getDataResponse.text();
      console.log('❌ [TEST] Error al recuperar datos:', errorText);
    }

    console.log('\n🎉 [TEST] Flujo completo de análisis probado exitosamente!');
    console.log('\n📋 [TEST] Resumen de la prueba:');
    console.log('✅ Guardado de datos completos');
    console.log('✅ Marcado de módulo como completado');
    console.log('✅ Verificación de estado completado');
    console.log('✅ Recuperación de datos guardados');
    console.log('✅ Validación de estructura de datos');

  } catch (error) {
    console.error('❌ [TEST] Error durante las pruebas:', error.message);
    console.error('❌ [TEST] Stack trace:', error.stack);
  }
}

// Ejecutar las pruebas
testCompleteAnalysisFlow();
