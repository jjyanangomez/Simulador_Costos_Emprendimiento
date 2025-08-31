const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de equilibrio...');

  try {
    // Verificar si ya existen datos
    const existingRecetas = await prisma.recetas.count();
    const existingCostosFijos = await prisma.costosFijos.count();

    if (existingRecetas > 0 || existingCostosFijos > 0) {
      console.log('⚠️  Ya existen datos de equilibrio. Saltando seed...');
      return;
    }

    // Obtener el primer negocio existente o crear uno
    let negocio = await prisma.negocios.findFirst();
    if (!negocio) {
      console.log('📝 No hay negocios existentes. Creando uno de prueba...');
      
      // Crear un usuario de prueba si no existe
      let usuario = await prisma.usuarios.findFirst();
      if (!usuario) {
        const bcrypt = require('bcrypt');
        const passwordHash = await bcrypt.hash('123456', 10);
        usuario = await prisma.usuarios.create({
          data: {
            nombre_completo: 'Usuario de Prueba',
            email: 'test@ejemplo.com',
            password_hash: passwordHash
          }
        });
      }

      // Obtener el primer tamaño de negocio
      let tamano = await prisma.tamano_negocio.findFirst();
      if (!tamano) {
        tamano = await prisma.tamano_negocio.create({
          data: { tamano_nombre: 'Microempresa (1-10 empleados)' }
        });
      }

      negocio = await prisma.negocios.create({
        data: {
          usuario_id: usuario.usuario_id,
          tipo_negocio: 'Restaurante',
          nombre_negocio: 'Restaurante de Prueba',
          ubicacion: 'Quito - Centro',
          id_tamano: tamano.id_tamano
        }
      });
    }

    // Crear categorías de producto si no existen
    let categoria = await prisma.categoriasProducto.findFirst();
    if (!categoria) {
      categoria = await prisma.categoriasProducto.create({
        data: { nombre_categoria: 'Platos Principales' }
      });
    }

    // Crear unidad de medida si no existe
    let unidad = await prisma.unidadMedida.findFirst();
    if (!unidad) {
      unidad = await prisma.unidadMedida.create({
        data: { nombre_unidad: 'Porción' }
      });
    }

    // Crear productos
    console.log('🍽️  Creando productos...');
    const productos = await Promise.all([
      prisma.productos.create({
        data: {
          negocio_id: negocio.negocio_id,
          categoria_id: categoria.id_categoria,
          unidad_medida_id: unidad.id_unidad,
          nombre_producto: 'Hamburguesa Clásica',
          descripcion: 'Hamburguesa con carne, lechuga, tomate y queso',
          precio_por_unidad: 8.99,
          costo_por_unidad: 3.50
        }
      }),
      prisma.productos.create({
        data: {
          negocio_id: negocio.negocio_id,
          categoria_id: categoria.id_categoria,
          unidad_medida_id: unidad.id_unidad,
          nombre_producto: 'Pizza Margherita',
          descripcion: 'Pizza con tomate, mozzarella y albahaca',
          precio_por_unidad: 12.99,
          costo_por_unidad: 5.00
        }
      }),
      prisma.productos.create({
        data: {
          negocio_id: negocio.negocio_id,
          categoria_id: categoria.id_categoria,
          unidad_medida_id: unidad.id_unidad,
          nombre_producto: 'Ensalada César',
          descripcion: 'Ensalada con lechuga, crutones y aderezo César',
          precio_por_unidad: 6.99,
          costo_por_unidad: 2.50
        }
      })
    ]);

    // Crear recetas
    console.log('👨‍🍳 Creando recetas...');
    const recetas = await Promise.all([
      prisma.recetas.create({
        data: {
          producto_id: productos[0].producto_id,
          nombre_receta: 'Hamburguesa Clásica',
          tiempo_preparacion: 15,
          personal_requerido: 2,
          costos_adicionales: 2.50,
          precio_venta: 8.99,
          costo_receta: 2.50
        }
      }),
      prisma.recetas.create({
        data: {
          producto_id: productos[1].producto_id,
          nombre_receta: 'Pizza Margherita',
          tiempo_preparacion: 25,
          personal_requerido: 3,
          costos_adicionales: 3.00,
          precio_venta: 12.99,
          costo_receta: 3.00
        }
      }),
      prisma.recetas.create({
        data: {
          producto_id: productos[2].producto_id,
          nombre_receta: 'Ensalada César',
          tiempo_preparacion: 10,
          personal_requerido: 1,
          costos_adicionales: 1.50,
          precio_venta: 6.99,
          costo_receta: 1.50
        }
      })
    ]);

    // Crear tipos de costo si no existen
    let tipoCosto = await prisma.tiposCosto.findFirst();
    if (!tipoCosto) {
      tipoCosto = await prisma.tiposCosto.create({
        data: { nombre_tipo: 'Gastos Generales' }
      });
    }

    // Crear costos fijos
    console.log('💰 Creando costos fijos...');
    const costosFijos = await Promise.all([
      prisma.costosFijos.create({
        data: {
          negocio_id: negocio.negocio_id,
          tipo_costo_id: tipoCosto.id_tipo,
          nombre_costo: 'Alquiler del local',
          descripcion: 'Alquiler mensual del local comercial',
          monto: 1200.00,
          frecuencia: 'mensual',
          fecha_inicio: new Date(),
          activo: true
        }
      }),
      prisma.costosFijos.create({
        data: {
          negocio_id: negocio.negocio_id,
          tipo_costo_id: tipoCosto.id_tipo,
          nombre_costo: 'Servicios básicos',
          descripcion: 'Electricidad, agua, internet',
          monto: 300.00,
          frecuencia: 'mensual',
          fecha_inicio: new Date(),
          activo: true
        }
      }),
      prisma.costosFijos.create({
        data: {
          negocio_id: negocio.negocio_id,
          tipo_costo_id: tipoCosto.id_tipo,
          nombre_costo: 'Seguro del negocio',
          descripcion: 'Seguro de responsabilidad civil',
          monto: 150.00,
          frecuencia: 'mensual',
          fecha_inicio: new Date(),
          activo: true
        }
      })
    ]);

    console.log('✅ Seed de equilibrio completado exitosamente!');
    console.log(`📊 Datos creados:`);
    console.log(`   - ${productos.length} productos`);
    console.log(`   - ${recetas.length} recetas`);
    console.log(`   - ${costosFijos.length} costos fijos`);
    console.log(`   - Negocio ID: ${negocio.negocio_id}`);

  } catch (error) {
    console.error('❌ Error durante el seed de equilibrio:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed de equilibrio:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
