const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCostTypes() {
  try {
    console.log('💰 Creando tipos de costo...');
    
    const costTypes = await Promise.all([
      prisma.tiposCosto.create({ 
        data: { 
          nombre: 'Arriendo/Renta del Local', 
          descripcion: 'Pago mensual del local comercial',
          es_fijo: true
        } 
      }),
      prisma.tiposCosto.create({ 
        data: { 
          nombre: 'Sueldos y Salarios', 
          descripcion: 'Remuneraciones del personal',
          es_fijo: true
        } 
      }),
      prisma.tiposCosto.create({ 
        data: { 
          nombre: 'Servicios Básicos', 
          descripcion: 'Luz, agua, internet, etc.',
          es_fijo: true
        } 
      }),
      prisma.tiposCosto.create({ 
        data: { 
          nombre: 'Publicidad y Marketing', 
          descripcion: 'Campañas publicitarias y promoción',
          es_fijo: true
        } 
      }),
      prisma.tiposCosto.create({ 
        data: { 
          nombre: 'Licencias y Permisos', 
          descripcion: 'Permisos municipales y licencias comerciales',
          es_fijo: true
        } 
      }),
      prisma.tiposCosto.create({ 
        data: { 
          nombre: 'Seguros', 
          descripcion: 'Seguros de responsabilidad civil y local',
          es_fijo: true
        } 
      }),
      prisma.tiposCosto.create({ 
        data: { 
          nombre: 'Mantenimiento', 
          descripcion: 'Mantenimiento del local y equipos',
          es_fijo: true
        } 
      }),
      prisma.tiposCosto.create({ 
        data: { 
          nombre: 'Transporte', 
          descripcion: 'Gastos de transporte y logística',
          es_fijo: true
        } 
      }),
      prisma.tiposCosto.create({ 
        data: { 
          nombre: 'Otros Costos Fijos', 
          descripcion: 'Otros gastos fijos del negocio',
          es_fijo: true
        } 
      })
    ]);
    
    console.log('✅ Tipos de costo creados exitosamente:', costTypes.map(ct => ({ 
      id: ct.tipo_costo_id, 
      nombre: ct.nombre 
    })));
    
  } catch (error) {
    console.error('❌ Error creando tipos de costo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCostTypes();
