const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed simplificado de la base de datos...');

  try {
    // Limpiar datos existentes
    console.log('🧹 Limpiando datos existentes...');
    
    await prisma.costosFijos.deleteMany();
    await prisma.costosVariables.deleteMany();
    await prisma.recetas.deleteMany();
    await prisma.productos.deleteMany();
    await prisma.negocios.deleteMany();
    await prisma.usuarios.deleteMany();
    await prisma.tamanosNegocio.deleteMany();
    await prisma.sectores.deleteMany();
    await prisma.tiposCosto.deleteMany();
    await prisma.categoriaActivoFijo.deleteMany();

    // Crear sectores
    console.log('🏢 Creando sectores...');
    const sectores = await Promise.all([
      prisma.sectores.create({
        data: { 
          nombre_sector: 'Restaurantes y Gastronomía',
          descripcion: 'Servicios de alimentación y bebidas'
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
          nombre_sector: 'Construcción',
          descripcion: 'Servicios de construcción y remodelación'
        }
      }),
      prisma.sectores.create({
        data: { 
          nombre_sector: 'Salud y Bienestar',
          descripcion: 'Servicios médicos y de cuidado personal'
        }
      })
    ]);

    // Crear tamaños de negocio
    console.log('📏 Creando tamaños de negocio...');
    const tamanos = await Promise.all([
      prisma.tamanosNegocio.create({
        data: { 
          tamano_nombre: 'Microempresa (1-10 empleados)',
          descripcion: 'Empresa pequeña con personal limitado'
        }
      }),
      prisma.tamanosNegocio.create({
        data: { 
          tamano_nombre: 'Pequeña empresa (11-50 empleados)',
          descripcion: 'Empresa en crecimiento con equipo mediano'
        }
      }),
      prisma.tamanosNegocio.create({
        data: { 
          tamano_nombre: 'Mediana empresa (51-200 empleados)',
          descripcion: 'Empresa establecida con estructura organizacional'
        }
      }),
      prisma.tamanosNegocio.create({
        data: { 
          tamano_nombre: 'Gran empresa (200+ empleados)',
          descripcion: 'Empresa grande con múltiples departamentos'
        }
      })
    ]);

    // Crear tipos de costo
    console.log('💰 Creando tipos de costo...');
    const tiposCosto = await Promise.all([
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
          descripcion: 'Campañas publicitarias y promocionales',
          es_fijo: true
        }
      }),
      prisma.tiposCosto.create({
        data: { 
          nombre: 'Materia Prima',
          descripcion: 'Materiales para la producción',
          es_fijo: false
        }
      }),
      prisma.tiposCosto.create({
        data: { 
          nombre: 'Mano de Obra',
          descripcion: 'Costo de producción por unidad',
          es_fijo: false
        }
      })
    ]);

    // Crear categorías de activo fijo
    console.log('🏗️ Creando categorías de activo fijo...');
    const categorias = await Promise.all([
      prisma.categoriaActivoFijo.create({
        data: { 
          nombre: 'Equipos de Cocina',
          descripcion: 'Equipos para preparación de alimentos',
          icono: '🍳',
          color: '#FF6B6B'
        }
      }),
      prisma.categoriaActivoFijo.create({
        data: { 
          nombre: 'Mobiliario',
          descripcion: 'Muebles y decoración del local',
          icono: '🪑',
          color: '#4ECDC4'
        }
      }),
      prisma.categoriaActivoFijo.create({
        data: { 
          nombre: 'Equipos de Oficina',
          descripcion: 'Computadoras, impresoras, etc.',
          icono: '💻',
          color: '#45B7D1'
        }
      }),
      prisma.categoriaActivoFijo.create({
        data: { 
          nombre: 'Equipos de Limpieza',
          descripcion: 'Aspiradoras, trapeadores, etc.',
          icono: '🧹',
          color: '#96CEB4'
        }
      })
    ]);

    // Crear usuario de prueba
    console.log('👤 Creando usuario de prueba...');
    const usuario = await prisma.usuarios.create({
      data: {
        nombre_completo: 'Usuario de Prueba',
        email: 'test@ejemplo.com',
        password_hash: 'hash_temporal_123',
        fecha_nacimiento: new Date('1990-01-01')
      }
    });

    // Crear negocio de prueba
    console.log('🏪 Creando negocio de prueba...');
    const negocio = await prisma.negocios.create({
      data: {
        usuario_id: usuario.usuario_id,
        nombre_negocio: 'Restaurante de Prueba',
        id_tamano: tamanos[0].id_tamano, // Microempresa
        aforo_personas: 50,
        capital_prestamo: 0,
        capital_propio: 10000,
        inversion_inicial: 10000,
        sector_id: sectores[0].sector_id, // Restaurantes
        tasa_interes: 12.5,
        ubicacion_exacta: 'Quito, Ecuador'
      }
    });

    console.log('✅ Seed completado exitosamente!');
    console.log(`   - Usuario creado: ${usuario.email}`);
    console.log(`   - Negocio creado: ${negocio.nombre_negocio}`);
    console.log(`   - Sectores creados: ${sectores.length}`);
    console.log(`   - Tamaños creados: ${tamanos.length}`);
    console.log(`   - Tipos de costo creados: ${tiposCosto.length}`);
    console.log(`   - Categorías creadas: ${categorias.length}`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
