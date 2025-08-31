const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkIds() {
  try {
    console.log('🔍 Verificando IDs en la base de datos...\n');

    // Verificar usuarios
    console.log('👤 USUARIOS:');
    const usuarios = await prisma.usuarios.findMany({
      select: {
        usuario_id: true,
        nombre_completo: true,
        email: true
      }
    });
    usuarios.forEach(u => {
      console.log(`   - ID: ${u.usuario_id}, Nombre: ${u.nombre_completo}, Email: ${u.email}`);
    });

    console.log('\n📏 TAMAÑOS DE NEGOCIO:');
    const tamanos = await prisma.tamanosNegocio.findMany({
      select: {
        id_tamano: true,
        tamano_nombre: true
      }
    });
    tamanos.forEach(t => {
      console.log(`   - ID: ${t.id_tamano}, Nombre: ${t.tamano_nombre}`);
    });

    console.log('\n🏢 SECTORES:');
    const sectores = await prisma.sectores.findMany({
      select: {
        sector_id: true,
        nombre_sector: true
      }
    });
    sectores.forEach(s => {
      console.log(`   - ID: ${s.sector_id}, Nombre: ${s.nombre_sector}`);
    });

    console.log('\n🏪 NEGOCIOS:');
    const negocios = await prisma.negocios.findMany({
      select: {
        negocio_id: true,
        nombre_negocio: true,
        usuario_id: true,
        id_tamano: true,
        sector_id: true
      }
    });
    negocios.forEach(n => {
      console.log(`   - ID: ${n.negocio_id}, Nombre: ${n.nombre_negocio}`);
      console.log(`     Usuario ID: ${n.usuario_id}, Tamaño ID: ${n.id_tamano}, Sector ID: ${n.sector_id}`);
    });

  } catch (error) {
    console.error('❌ Error al verificar IDs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkIds();
