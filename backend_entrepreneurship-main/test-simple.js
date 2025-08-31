const http = require('http');

console.log('🧪 Probando APIs de Equilibrio...\n');

// Función para hacer petición HTTP
function makeRequest(path, callback) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        callback(null, res.statusCode, jsonData);
      } catch (e) {
        callback(e, res.statusCode, data);
      }
    });
  });

  req.on('error', (e) => {
    callback(e);
  });

  req.end();
}

// Probar endpoint de recetas
console.log('1️⃣ Probando GET /api/v1/recetas/all...');
makeRequest('/api/v1/recetas/all', (error, statusCode, data) => {
  if (error) {
    console.log('❌ Error de conexión:', error.message);
    return;
  }
  
  if (statusCode === 200) {
    console.log('✅ Recetas API funcionando');
    console.log(`   - Status: ${statusCode}`);
    console.log(`   - Cantidad de recetas: ${data.data?.length || 0}`);
    if (data.data && data.data.length > 0) {
      console.log(`   - Primera receta: ${data.data[0].nombre_receta}`);
      console.log(`   - Costo receta: $${data.data[0].costo_receta}`);
    }
  } else {
    console.log('❌ Error en Recetas API:', statusCode, data);
  }

  console.log('');

  // Probar endpoint de costos fijos
  console.log('2️⃣ Probando GET /api/v1/costos-fijos/total?negocioId=1...');
  makeRequest('/api/v1/costos-fijos/total?negocioId=1', (error2, statusCode2, data2) => {
    if (error2) {
      console.log('❌ Error de conexión:', error2.message);
      return;
    }
    
    if (statusCode2 === 200) {
      console.log('✅ Costos Fijos API funcionando');
      console.log(`   - Status: ${statusCode2}`);
      console.log(`   - Total costos fijos: $${data2.data?.total || 0}`);
    } else {
      console.log('❌ Error en Costos Fijos API:', statusCode2, data2);
    }
  });
});
