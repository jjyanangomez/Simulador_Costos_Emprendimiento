const http = require('http');

console.log('🚀 Probando APIs rápidamente...\n');

// Probar API de recetas
http.get('http://localhost:3000/api/v1/recetas/all', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('✅ API Recetas:', json.data?.length || 0, 'recetas encontradas');
    } catch (e) {
      console.log('❌ Error API Recetas:', data);
    }
  });
}).on('error', (e) => {
  console.log('❌ Error conexión Recetas:', e.message);
});

// Probar API de costos fijos
http.get('http://localhost:3000/api/v1/costos-fijos/total?negocioId=1', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('✅ API Costos Fijos: $' + (json.data?.total || 0));
    } catch (e) {
      console.log('❌ Error API Costos Fijos:', data);
    }
  });
}).on('error', (e) => {
  console.log('❌ Error conexión Costos Fijos:', e.message);
});
