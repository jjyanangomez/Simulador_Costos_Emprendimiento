const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBusinessCreation() {
  try {
    console.log('🧪 Probando creación de negocio...\n');

    // Datos que envía el frontend (corregidos)
    const businessData = {
      usuarioId: 1, // Usuario "Usuario de Prueba" que existe en el backend
      nombreNegocio: "Restaurante de Prueba Frontend",
      ubicacionExacta: "Quito, Ecuador",
      idTamano: 2, // Tamaño "Microempresa (1-10 empleados)" que existe en el backend
      sectorId: 1, // Sector "Restaurantes y Gastronomía" que existe en el backend
      aforoPersonas: 30,
      inversionInicial: 3500,
      capitalPropio: 3500,
      capitalPrestamo: 0,
      tasaInteres: 10.0
    };

    console.log('📤 Datos que se enviarían al backend:');
    console.log(JSON.stringify(businessData, null, 2));

    // Verificar que el usuario existe
    console.log('\n🔍 Verificando que el usuario existe...');
    const usuario = await prisma.usuarios.findUnique({
      where: { usuario_id: businessData.usuarioId }
    });
    
    if (usuario) {
      console.log(`✅ Usuario encontrado: ${usuario.nombre_completo} (${usuario.email})`);
    } else {
      console.log(`❌ Usuario con ID ${businessData.usuarioId} no existe`);
      return;
    }

    // Verificar que el tamaño existe
    console.log('\n🔍 Verificando que el tamaño existe...');
    const tamano = await prisma.tamanosNegocio.findUnique({
      where: { id_tamano: businessData.idTamano }
    });
    
    if (tamano) {
      console.log(`✅ Tamaño encontrado: ${tamano.tamano_nombre}`);
    } else {
      console.log(`❌ Tamaño con ID ${businessData.idTamano} no existe`);
      return;
    }

    // Verificar que el sector existe
    console.log('\n🔍 Verificando que el sector existe...');
    const sector = await prisma.sectores.findUnique({
      where: { sector_id: businessData.sectorId }
    });
    
    if (sector) {
      console.log(`✅ Sector encontrado: ${sector.nombre_sector}`);
    } else {
      console.log(`❌ Sector con ID ${businessData.sectorId} no existe`);
      return;
    }

    // Intentar crear el negocio
    console.log('\n🚀 Intentando crear el negocio...');
    const negocio = await prisma.negocios.create({
      data: {
        usuario_id: businessData.usuarioId,
        nombre_negocio: businessData.nombreNegocio,
        id_tamano: businessData.idTamano,
        aforo_personas: businessData.aforoPersonas,
        capital_prestamo: businessData.capitalPrestamo,
        capital_propio: businessData.capitalPropio,
        inversion_inicial: businessData.inversionInicial,
        sector_id: businessData.sectorId,
        tasa_interes: businessData.tasaInteres,
        ubicacion_exacta: businessData.ubicacionExacta
      }
    });

    console.log('✅ Negocio creado exitosamente!');
    console.log(`   - ID: ${negocio.negocio_id}`);
    console.log(`   - Nombre: ${negocio.nombre_negocio}`);
    console.log(`   - Usuario ID: ${negocio.usuario_id}`);
    console.log(`   - Tamaño ID: ${negocio.id_tamano}`);
    console.log(`   - Sector ID: ${negocio.sector_id}`);

    // Limpiar el negocio de prueba
    console.log('\n🧹 Limpiando negocio de prueba...');
    await prisma.negocios.delete({
      where: { negocio_id: negocio.negocio_id }
    });
    console.log('✅ Negocio de prueba eliminado');

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBusinessCreation();
