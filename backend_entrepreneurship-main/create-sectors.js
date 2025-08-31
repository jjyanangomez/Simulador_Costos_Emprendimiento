const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSectors() {
  try {
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
    console.error('❌ Error creando sectores:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSectors();
