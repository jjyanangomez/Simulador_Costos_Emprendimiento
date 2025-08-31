const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBusinessCreation() {
  try {
    console.log('🧪 Probando creación de negocio...');
    
    // Verificar que el usuario existe
    const usuario = await prisma.usuarios.findUnique({
      where: { usuario_id: 2 }
    });
    console.log('👤 Usuario encontrado:', usuario ? 'SÍ' : 'NO');
    
    // Verificar que el tamaño existe
    const tamano = await prisma.tamanosNegocio.findUnique({
      where: { id_tamano: 1 }
    });
    console.log('📏 Tamaño encontrado:', tamano ? 'SÍ' : 'NO');
    
    // Verificar que el sector existe
    const sector = await prisma.sectores.findUnique({
      where: { sector_id: 1 }
    });
    console.log('🏭 Sector encontrado:', sector ? 'SÍ' : 'NO');
    
    // Intentar crear el negocio
    const negocio = await prisma.negocios.create({
      data: {
        usuario_id: 2,
        nombre_negocio: 'Mi Negocio Test',
        ubicacion_exacta: 'Ciudad Test',
        id_tamano: 1,
        sector_id: 1,
        aforo_personas: 50,
        inversion_inicial: 10000
      }
    });
    
    console.log('✅ Negocio creado exitosamente:', negocio.negocio_id);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('🔍 Código de error:', error.code);
  } finally {
    await prisma.$disconnect();
  }
}

testBusinessCreation();
