const http = require('http');

console.log('🧪 Probando API de Costos Fijos...\n');

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

// Probar endpoint de costos fijos total
console.log('1️⃣ Probando GET /api/v1/costos-fijos/total?negocioId=1...');
makeRequest('/api/v1/costos-fijos/total?negocioId=1', (error, statusCode, data) => {
  if (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('💡 Asegúrate de que el servidor backend esté ejecutándose en puerto 3000');
    return;
  }
  
  console.log(`📡 Status Code: ${statusCode}`);
  console.log(`📡 Response:`, JSON.stringify(data, null, 2));
  
  if (statusCode === 200) {
    console.log('✅ Costos Fijos API funcionando');
    console.log(`   - Total costos fijos: $${data.total || 0}`);
    console.log(`   - Cantidad de costos: ${data.count || 0}`);
    console.log(`   - Mensaje: ${data.message}`);
  } else {
    console.log('❌ Error en Costos Fijos API:', statusCode);
  }
  
  console.log('\n2️⃣ Probando GET /api/v1/costos-fijos?negocioId=1...');
  makeRequest('/api/v1/costos-fijos?negocioId=1', (error2, statusCode2, data2) => {
    if (error2) {
      console.log('❌ Error de conexión:', error2.message);
      return;
    }
    
    console.log(`📡 Status Code: ${statusCode2}`);
    console.log(`📡 Response:`, JSON.stringify(data2, null, 2));
    
    if (statusCode2 === 200) {
      console.log('✅ Lista de Costos Fijos API funcionando');
      console.log(`   - Cantidad de costos: ${data2.total || 0}`);
      if (data2.data && data2.data.length > 0) {
        console.log('   - Primer costo fijo:');
        console.log(`     * Nombre: ${data2.data[0].nombre}`);
        console.log(`     * Monto: $${data2.data[0].monto}`);
        console.log(`     * Frecuencia: ${data2.data[0].frecuencia}`);
      }
    } else {
      console.log('❌ Error en Lista de Costos Fijos API:', statusCode2);
    }
  });
});
