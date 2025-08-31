const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSectorsSafe() {
  try {
    console.log('🏭 Verificando sectores existentes...');
    
    // Verificar si ya existen sectores
    const sectoresExistentes = await prisma.sectores.findMany();
    
    if (sectoresExistentes.length > 0) {
      console.log('✅ Ya existen sectores:', sectoresExistentes.map(s => ({ id: s.sector_id, nombre: s.nombre_sector })));
      return;
    }
    
    console.log('🏭 Creando sectores...');
    
    const sectores = await Promise.all([
      prisma.sectores.create({
        data: {
          nombre_sector: 'Restaurantes y Cafeterías',
          descripcion: 'Sector de alimentos y bebidas'
        }
      }),
      prisma.sectores.create({
        data: {
          nombre_sector: 'Comercio Minorista',
          descripcion: 'Venta de productos al consumidor final'
        }
      }),
      prisma.sectores.create({
        data: {
          nombre_sector: 'Ferreterías y Construcción',
          descripcion: 'Materiales y herramientas de construcción'
        }
      }),
      prisma.sectores.create({
        data: {
          nombre_sector: 'Salud y Farmacias',
          descripcion: 'Productos y servicios de salud'
        }
      })
    ]);

    console.log('✅ Sectores creados exitosamente:', sectores.map(s => ({ id: s.sector_id, nombre: s.nombre_sector })));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createSectorsSafe();
