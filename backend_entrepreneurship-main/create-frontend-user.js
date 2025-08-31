const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createFrontendUser() {
  try {
    console.log('👤 Creando usuario para el frontend...');

    // Crear usuario "joe" con email "jose@gmail.com"
    const usuario = await prisma.usuarios.create({
      data: {
        nombre_completo: 'joe',
        email: 'jose@gmail.com',
        password_hash: 'hash_temporal_123',
        fecha_nacimiento: new Date('1990-01-01')
      }
    });

    console.log('✅ Usuario creado exitosamente:');
    console.log(`   - ID: ${usuario.usuario_id}`);
    console.log(`   - Nombre: ${usuario.nombre_completo}`);
    console.log(`   - Email: ${usuario.email}`);

    // Crear un negocio para este usuario
    console.log('\n🏪 Creando negocio para el usuario...');
    
    // Obtener el primer tamaño de negocio (ID: 1 - Gran empresa)
    const tamano = await prisma.tamanosNegocio.findFirst({
      where: { id_tamano: 1 }
    });

    // Obtener el primer sector (ID: 1 - Restaurantes)
    const sector = await prisma.sectores.findFirst({
      where: { sector_id: 1 }
    });

    const negocio = await prisma.negocios.create({
      data: {
        usuario_id: usuario.usuario_id,
        nombre_negocio: 'Negocio de Joe',
        id_tamano: tamano.id_tamano,
        aforo_personas: 30,
        capital_prestamo: 0,
        capital_propio: 5000,
        inversion_inicial: 5000,
        sector_id: sector.sector_id,
        tasa_interes: 10.0,
        ubicacion_exacta: 'Quito, Ecuador'
      }
    });

    console.log('✅ Negocio creado exitosamente:');
    console.log(`   - ID: ${negocio.negocio_id}`);
    console.log(`   - Nombre: ${negocio.nombre_negocio}`);
    console.log(`   - Usuario ID: ${negocio.usuario_id}`);
    console.log(`   - Tamaño ID: ${negocio.id_tamano}`);
    console.log(`   - Sector ID: ${negocio.sector_id}`);

    console.log('\n📋 RESUMEN DE IDs DISPONIBLES:');
    console.log(`   - Usuario "joe": ID ${usuario.usuario_id}`);
    console.log(`   - Tamaño "Gran empresa": ID ${tamano.id_tamano}`);
    console.log(`   - Sector "Restaurantes": ID ${sector.sector_id}`);

  } catch (error) {
    console.error('❌ Error al crear usuario del frontend:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createFrontendUser();
