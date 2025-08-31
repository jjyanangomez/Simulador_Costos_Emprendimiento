const http = require('http');

console.log('🧪 Probando APIs de Equilibrio...\n');

function testAPI(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.end();
  });
}

async function testAllAPIs() {
  try {
    // 1. Probar API de recetas
    console.log('1️⃣ Probando /api/v1/recetas/all...');
    const recetasResult = await testAPI('/api/v1/recetas/all');
    console.log(`   Status: ${recetasResult.status}`);
    if (recetasResult.status === 200) {
      console.log('   ✅ API de recetas funcionando');
      console.log(`   Cantidad de recetas: ${recetasResult.data.data?.length || 0}`);
    } else {
      console.log('   ❌ Error en API de recetas');
    }

    console.log('');

    // 2. Probar API de costos fijos
    console.log('2️⃣ Probando /api/v1/costos-fijos/total?negocioId=1...');
    const costosResult = await testAPI('/api/v1/costos-fijos/total?negocioId=1');
    console.log(`   Status: ${costosResult.status}`);
    if (costosResult.status === 200) {
      console.log('   ✅ API de costos fijos funcionando');
      console.log(`   Total costos fijos: $${costosResult.data.data?.total || 0}`);
    } else {
      console.log('   ❌ Error en API de costos fijos');
    }

  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('💡 Asegúrate de que el servidor backend esté ejecutándose en puerto 3000');
  }
}

testAllAPIs();
