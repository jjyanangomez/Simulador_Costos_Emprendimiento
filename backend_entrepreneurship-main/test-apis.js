const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testAPIs() {
  console.log('🧪 Probando APIs de Equilibrio...\n');

  try {
    // 1. Probar endpoint de recetas
    console.log('1️⃣ Probando GET /recetas/all...');
    const recetasResponse = await fetch(`${BASE_URL}/recetas/all`);
    const recetasData = await recetasResponse.json();
    
    if (recetasResponse.ok) {
      console.log('✅ Recetas API funcionando');
      console.log(`   - Status: ${recetasResponse.status}`);
      console.log(`   - Cantidad de recetas: ${recetasData.data?.length || 0}`);
      if (recetasData.data && recetasData.data.length > 0) {
        console.log(`   - Primera receta: ${recetasData.data[0].nombre_receta}`);
        console.log(`   - Costo receta: $${recetasData.data[0].costo_receta}`);
      }
    } else {
      console.log('❌ Error en Recetas API:', recetasData);
    }

    console.log('');

    // 2. Probar endpoint de costos fijos
    console.log('2️⃣ Probando GET /costos-fijos/total?negocioId=1...');
    const costosResponse = await fetch(`${BASE_URL}/costos-fijos/total?negocioId=1`);
    const costosData = await costosResponse.json();
    
    if (costosResponse.ok) {
      console.log('✅ Costos Fijos API funcionando');
      console.log(`   - Status: ${costosResponse.status}`);
      console.log(`   - Total costos fijos: $${costosData.data?.total || 0}`);
    } else {
      console.log('❌ Error en Costos Fijos API:', costosData);
    }

    console.log('');

    // 3. Probar endpoint de productos
    console.log('3️⃣ Probando GET /productos?negocioId=1...');
    const productosResponse = await fetch(`${BASE_URL}/productos?negocioId=1`);
    const productosData = await productosResponse.json();
    
    if (productosResponse.ok) {
      console.log('✅ Productos API funcionando');
      console.log(`   - Status: ${productosResponse.status}`);
      console.log(`   - Cantidad de productos: ${productosData.data?.length || 0}`);
    } else {
      console.log('❌ Error en Productos API:', productosData);
    }

  } catch (error) {
    console.error('💥 Error general:', error.message);
  }
}

// Esperar un poco para que el servidor se inicie
setTimeout(testAPIs, 3000);
