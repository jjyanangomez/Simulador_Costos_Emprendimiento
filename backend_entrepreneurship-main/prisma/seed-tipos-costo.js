const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedTiposCosto() {
  try {
    console.log('🌱 Iniciando seed de tipos de costo...');

    // Crear tipos de costo fijos
    const tiposCostoFijos = [
      {
        nombre: 'Arriendo/Renta',
        descripcion: 'Pago mensual del local comercial',
        es_fijo: true,
      },
      {
        nombre: 'Personal',
        descripcion: 'Sueldos y salarios del personal',
        es_fijo: true,
      },
      {
        nombre: 'Seguridad Social',
        descripcion: 'Aportes patronales (IESS)',
        es_fijo: true,
      },
      {
        nombre: 'Servicios Básicos',
        descripcion: 'Luz, agua, internet, teléfono',
        es_fijo: true,
      },
      {
        nombre: 'Publicidad y Marketing',
        descripcion: 'Campañas publicitarias y promocionales',
        es_fijo: true,
      },
      {
        nombre: 'Licencias y Permisos',
        descripcion: 'Permisos municipales y licencias comerciales',
        es_fijo: true,
      },
      {
        nombre: 'Seguros',
        descripcion: 'Seguros empresariales y de responsabilidad',
        es_fijo: true,
      },
      {
        nombre: 'Mantenimiento',
        descripcion: 'Mantenimiento del local y equipos',
        es_fijo: true,
      },
      {
        nombre: 'Transporte y Logística',
        descripcion: 'Gastos de transporte y distribución',
        es_fijo: true,
      },
      {
        nombre: 'Otros Costos Fijos',
        descripcion: 'Otros gastos fijos del negocio',
        es_fijo: true,
      },
    ];

    // Crear tipos de costo variables
    const tiposCostoVariables = [
      {
        nombre: 'Materias Primas',
        descripcion: 'Ingredientes y materiales para productos',
        es_fijo: false,
      },
      {
        nombre: 'Embalaje',
        descripcion: 'Materiales de empaque y embalaje',
        es_fijo: false,
      },
      {
        nombre: 'Comisiones',
        descripcion: 'Comisiones por ventas o servicios',
        es_fijo: false,
      },
      {
        nombre: 'Impuestos Variables',
        descripcion: 'Impuestos que varían con las ventas',
        es_fijo: false,
      },
      {
        nombre: 'Otros Costos Variables',
        descripcion: 'Otros gastos que varían con la producción',
        es_fijo: false,
      },
    ];

    // Insertar tipos de costo fijos
    console.log('📝 Insertando tipos de costo fijos...');
    for (const tipo of tiposCostoFijos) {
      await prisma.tiposCosto.upsert({
        where: { nombre: tipo.nombre },
        update: {},
        create: tipo,
      });
    }

    // Insertar tipos de costo variables
    console.log('📝 Insertando tipos de costo variables...');
    for (const tipo of tiposCostoVariables) {
      await prisma.tiposCosto.upsert({
        where: { nombre: tipo.nombre },
        update: {},
        create: tipo,
      });
    }

    // Crear categorías de productos
    console.log('📝 Insertando categorías de productos...');
    const categoriasProducto = [
      { nombre: 'Bebidas', descripcion: 'Bebidas gaseosas, jugos, café, etc.' },
      { nombre: 'Comidas Principales', descripcion: 'Platos principales del menú' },
      { nombre: 'Entradas', descripcion: 'Aperitivos y entradas' },
      { nombre: 'Postres', descripcion: 'Dulces y postres' },
      { nombre: 'Acompañamientos', descripcion: 'Guarniciones y acompañamientos' },
      { nombre: 'Snacks', descripcion: 'Bocadillos y snacks' },
      { nombre: 'Bebidas Alcohólicas', descripcion: 'Cervezas, vinos, licores' },
      { nombre: 'Productos de Panadería', descripcion: 'Panes, pasteles, galletas' },
    ];

    for (const categoria of categoriasProducto) {
      await prisma.categoriasProducto.upsert({
        where: { nombre: categoria.nombre },
        update: {},
        create: categoria,
      });
    }

    // Crear unidades de medida
    console.log('📝 Insertando unidades de medida...');
    const unidadesMedida = [
      { nombre: 'Unidad', abreviatura: 'un' },
      { nombre: 'Litro', abreviatura: 'L' },
      { nombre: 'Kilogramo', abreviatura: 'kg' },
      { nombre: 'Gramo', abreviatura: 'g' },
      { nombre: 'Libra', abreviatura: 'lb' },
      { nombre: 'Onza', abreviatura: 'oz' },
      { nombre: 'Porción', abreviatura: 'porc' },
      { nombre: 'Taza', abreviatura: 'taza' },
      { nombre: 'Cucharada', abreviatura: 'cda' },
      { nombre: 'Cucharadita', abreviatura: 'cdta' },
    ];

    for (const unidad of unidadesMedida) {
      await prisma.unidadMedida.upsert({
        where: { nombre: unidad.nombre },
        update: {},
        create: unidad,
      });
    }

    console.log('✅ Seed de tipos de costo completado exitosamente!');
    
    // Mostrar resumen
    const totalTiposCosto = await prisma.tiposCosto.count();
    const totalCategorias = await prisma.categoriasProducto.count();
    const totalUnidades = await prisma.unidadMedida.count();
    
    console.log(`📊 Resumen:`);
    console.log(`   - Tipos de costo: ${totalTiposCosto}`);
    console.log(`   - Categorías de producto: ${totalCategorias}`);
    console.log(`   - Unidades de medida: ${totalUnidades}`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed
seedTiposCosto()
  .then(() => {
    console.log('🎉 Seed completado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Error en el seed:', error);
    process.exit(1);
  });
