const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('🔍 Verificando base de datos...\n');

    // 1. Verificar si hay costos fijos
    console.log('1️⃣ Verificando tabla CostosFijos...');
    const costosFijos = await prisma.costosFijos.findMany({
      where: {
        negocio_id: 1,
        activo: true
      },
      select: {
        costo_fijo_id: true,
        nombre: true,
        monto: true,
        frecuencia: true,
        activo: true
      }
    });

    console.log(`   - Cantidad de costos fijos: ${costosFijos.length}`);
    if (costosFijos.length > 0) {
      costosFijos.forEach((costo, index) => {
        console.log(`   - Costo ${index + 1}: ${costo.nombre} - $${costo.monto} (${costo.frecuencia})`);
      });
    } else {
      console.log('   ⚠️  No hay costos fijos en la base de datos');
    }

    console.log('');

    // 2. Verificar si hay recetas (sin campo activo)
    console.log('2️⃣ Verificando tabla Recetas...');
    const recetas = await prisma.recetas.findMany({
      select: {
        receta_id: true,
        nombre_receta: true,
        costo_receta: true,
        precio_venta: true
      }
    });

    console.log(`   - Cantidad de recetas: ${recetas.length}`);
    if (recetas.length > 0) {
      recetas.forEach((receta, index) => {
        console.log(`   - Receta ${index + 1}: ${receta.nombre_receta} - Costo: $${receta.costo_receta}, Precio: $${receta.precio_venta}`);
      });
    } else {
      console.log('   ⚠️  No hay recetas en la base de datos');
    }

    console.log('');

    // 3. Verificar si hay negocios (sin campo activo)
    console.log('3️⃣ Verificando tabla Negocios...');
    const negocios = await prisma.negocios.findMany({
      select: {
        negocio_id: true,
        nombre_negocio: true
      }
    });

    console.log(`   - Cantidad de negocios: ${negocios.length}`);
    if (negocios.length > 0) {
      negocios.forEach((negocio, index) => {
        console.log(`   - Negocio ${index + 1}: ${negocio.nombre_negocio} (ID: ${negocio.negocio_id})`);
      });
    } else {
      console.log('   ⚠️  No hay negocios en la base de datos');
    }

    console.log('');

    // 4. Calcular total de costos fijos manualmente
    if (costosFijos.length > 0) {
      console.log('4️⃣ Calculando total de costos fijos manualmente...');
      let total = 0;
      costosFijos.forEach(costo => {
        switch (costo.frecuencia) {
          case 'mensual':
            total += Number(costo.monto);
            break;
          case 'semestral':
            total += Number(costo.monto) / 6;
            break;
          case 'anual':
            total += Number(costo.monto) / 12;
            break;
          default:
            total += Number(costo.monto);
        }
      });
      console.log(`   - Total calculado: $${total.toFixed(2)}`);
    }

  } catch (error) {
    console.error('❌ Error al verificar la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
