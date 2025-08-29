import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...');
  await prisma.resultados_Riesgos_Detectados.deleteMany();
  await prisma.resultados_Plan_Accion.deleteMany();
  await prisma.resultados_Costos_Omitidos.deleteMany();
  await prisma.resultados_Costos_Analizados.deleteMany();
  await prisma.analisis_IA.deleteMany();
  await prisma.negocioProgresoPaso.deleteMany();
  await prisma.registros_financieros.deleteMany();
  await prisma.negocios.deleteMany();
  await prisma.usuarios.deleteMany();
  await prisma.modulos.deleteMany();
  await prisma.aprendizaje.deleteMany();
  await prisma.estados.deleteMany();
  await prisma.tamano_negocio.deleteMany();

  // Crear tamaños de negocio
  console.log('📏 Creando tamaños de negocio...');
  const tamanos = await Promise.all([
    prisma.tamano_negocio.create({
      data: { tamano_nombre: 'Microempresa (1-10 empleados)' }
    }),
    prisma.tamano_negocio.create({
      data: { tamano_nombre: 'Pequeña empresa (11-50 empleados)' }
    }),
    prisma.tamano_negocio.create({
      data: { tamano_nombre: 'Mediana empresa (51-200 empleados)' }
    }),
    prisma.tamano_negocio.create({
      data: { tamano_nombre: 'Gran empresa (200+ empleados)' }
    })
  ]);

  // Crear estados
  console.log('📊 Creando estados...');
  const estados = await Promise.all([
    prisma.estados.create({
      data: { nombre_estado: 'Pendiente' }
    }),
    prisma.estados.create({
      data: { nombre_estado: 'En Progreso' }
    }),
    prisma.estados.create({
      data: { nombre_estado: 'Completado' }
    }),
    prisma.estados.create({
      data: { nombre_estado: 'Pausado' }
    })
  ]);

  // Crear rutas de aprendizaje
  console.log('📚 Creando rutas de aprendizaje...');
  const aprendizaje = await prisma.aprendizaje.create({
    data: {
      nombre: 'Fundamentos de Gestión de Costos',
      total_niveles: 5,
      Modulos: {
        create: [
          {
            orden_modulo: 1,
            nombre_modulo: 'Costos Fijos',
            titulo_conteido: 'Conceptos Básicos',
            concepto: 'Aprende los fundamentos de la gestión de costos y su importancia en el éxito empresarial. Los costos son fundamentales para determinar la rentabilidad de un negocio y tomar decisiones estratégicas informadas.',
            recurso_interactivo: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          {
            orden_modulo: 2,
            nombre_modulo: 'Clasificación de Costos',
            titulo_conteido: 'Tipos de Costos',
            concepto: 'Identifica y clasifica los diferentes tipos de costos en tu negocio. Los costos se pueden clasificar en fijos, variables, directos, indirectos, y cada tipo tiene implicaciones diferentes en la gestión empresarial.',
            recurso_interactivo: 'https://www.youtube.com/embed/jNQXAC9IVRw'
          },
          {
            orden_modulo: 3,
            nombre_modulo: 'Análisis de Punto de Equilibrio',
            titulo_conteido: 'Punto de Equilibrio',
            concepto: 'Calcula el punto de equilibrio y toma decisiones informadas sobre precios y volúmenes. El punto de equilibrio es el nivel de ventas donde los ingresos igualan los costos totales, sin generar ganancias ni pérdidas.',
            recurso_interactivo: 'https://www.youtube.com/embed/9bZkp7q19f0'
          },
          {
            orden_modulo: 4,
            nombre_modulo: 'Presupuesto de Costos',
            titulo_conteido: 'Presupuestación',
            concepto: 'Desarrolla presupuestos efectivos para controlar y planificar los costos. Un buen presupuesto te permite anticipar gastos, asignar recursos eficientemente y medir el rendimiento de tu negocio.',
            recurso_interactivo: 'https://www.youtube.com/embed/kJQP7kiw5Fk'
          },
          {
            orden_modulo: 5,
            nombre_modulo: 'Control y Análisis de Desviaciones',
            titulo_conteido: 'Control de Costos',
            concepto: 'Implementa sistemas de control y análisis de desviaciones para optimizar costos. El control de costos te permite identificar ineficiencias, corregir desviaciones y mejorar la rentabilidad de tu negocio.',
            recurso_interactivo: 'https://www.youtube.com/embed/ZZ5LpwO-An4'
          }
        ]
      }
    }
  });

  // Crear usuarios de prueba
  console.log('👥 Creando usuarios de prueba...');
  const passwordHash = await bcrypt.hash('123456', 10);
  
  const usuarios = await Promise.all([
    prisma.usuarios.create({
      data: {
        nombre_completo: 'María González',
        email: 'maria@ejemplo.com',
        password_hash: passwordHash
      }
    }),
    prisma.usuarios.create({
      data: {
        nombre_completo: 'Carlos Rodríguez',
        email: 'carlos@ejemplo.com',
        password_hash: passwordHash
      }
    }),
    prisma.usuarios.create({
      data: {
        nombre_completo: 'Ana Martínez',
        email: 'ana@ejemplo.com',
        password_hash: passwordHash
      }
    })
  ]);

  // Crear negocios de prueba
  console.log('🏢 Creando negocios de prueba...');
  const negocios = await Promise.all([
    prisma.negocios.create({
      data: {
        usuario_id: usuarios[0].usuario_id,
        tipo_negocio: 'Restaurante',
        nombre_negocio: 'La Buena Mesa',
        ubicacion: 'Quito - Centro Histórico',
        id_tamano: tamanos[0].id_tamano
      }
    }),
    prisma.negocios.create({
      data: {
        usuario_id: usuarios[0].usuario_id,
        tipo_negocio: 'Cafetería',
        nombre_negocio: 'El Rincón del Café',
        ubicacion: 'Quito - La Mariscal',
        id_tamano: tamanos[0].id_tamano
      }
    }),
    prisma.negocios.create({
      data: {
        usuario_id: usuarios[1].usuario_id,
        tipo_negocio: 'Tienda de Ropa',
        nombre_negocio: 'Modas Elegantes',
        ubicacion: 'Guayaquil - Centro Comercial',
        id_tamano: tamanos[1].id_tamano
      }
    }),
    prisma.negocios.create({
      data: {
        usuario_id: usuarios[2].usuario_id,
        tipo_negocio: 'Ferretería',
        nombre_negocio: 'El Tornillo Feliz',
        ubicacion: 'Cuenca - Centro',
        id_tamano: tamanos[0].id_tamano
      }
    }),
    prisma.negocios.create({
      data: {
        usuario_id: usuarios[2].usuario_id,
        tipo_negocio: 'Farmacia',
        nombre_negocio: 'Farmacia del Pueblo',
        ubicacion: 'Manta - Malecón',
        id_tamano: tamanos[1].id_tamano
      }
    })
  ]);

  // Crear progreso de negocios
  console.log('📈 Creando progreso de negocios...');
  const modulos = await prisma.modulos.findMany();
  
  for (const negocio of negocios) {
    for (let i = 0; i < 3; i++) { // Solo los primeros 3 módulos
      const estado = i === 0 ? estados[1] : estados[2]; // En progreso o completado
      await prisma.negocioProgresoPaso.create({
        data: {
          negocio_id: negocio.negocio_id,
          modulo_id: modulos[i].id_modulo,
          id_estado: estado.id_estado,
          fecha_inicio: new Date(Date.now() - (i + 1) * 7 * 24 * 60 * 60 * 1000), // Hace i+1 semanas
          fecha_completado: estado.id_estado === estados[2].id_estado ? new Date() : null
        }
      });
    }
  }

  // Crear registros financieros
  console.log('💰 Creando registros financieros...');
  for (const negocio of negocios) {
    for (let i = 0; i < 3; i++) {
      await prisma.registros_financieros.create({
        data: {
          negocio_id: negocio.negocio_id,
          modulo_id: modulos[i].id_modulo,
          nombre: `Costo ${i + 1} - ${negocio.nombre_negocio}`,
          monto: Math.random() * 1000 + 100 // Entre 100 y 1100
        }
      });
    }
  }

  // Crear análisis de IA
  console.log('🤖 Creando análisis de IA...');
  for (const negocio of negocios) {
    const analisis = await prisma.analisis_IA.create({
      data: {
        negocio_id: negocio.negocio_id
      }
    });

    // Crear resultados de costos analizados
    await prisma.resultados_Costos_Analizados.createMany({
      data: [
        {
          analisis_id: analisis.analisis_id,
          nombre_costo: 'Materia Prima',
          valor_recibido: 'Alto',
          rango_estimado: '$500 - $1000',
          evaluacion: 'Eficiente',
          comentario: 'Los costos de materia prima están dentro del rango esperado.'
        },
        {
          analisis_id: analisis.analisis_id,
          nombre_costo: 'Mano de Obra',
          valor_recibido: 'Medio',
          rango_estimado: '$300 - $800',
          evaluacion: 'Aceptable',
          comentario: 'Considerar optimización en procesos de producción.'
        }
      ]
    });

    // Crear costos omitidos
    await prisma.resultados_Costos_Omitidos.createMany({
      data: [
        {
          analisis_id: analisis.analisis_id,
          costo_omitido: 'Costos de mantenimiento de equipos',
          importancia: 'Alta'
        },
        {
          analisis_id: analisis.analisis_id,
          costo_omitido: 'Seguros empresariales',
          importancia: 'Media'
        }
      ]
    });

    // Crear planes de acción
    await prisma.resultados_Plan_Accion.createMany({
      data: [
        {
          analisis_id: analisis.analisis_id,
          titulo: 'Optimizar procesos de producción',
          descripcion: 'Implementar mejoras en los procesos para reducir costos de mano de obra.',
          prioridad: 'Alta'
        },
        {
          analisis_id: analisis.analisis_id,
          titulo: 'Negociar mejores precios con proveedores',
          descripcion: 'Establecer alianzas estratégicas para obtener mejores precios en materia prima.',
          prioridad: 'Media'
        }
      ]
    });

    // Crear riesgos detectados
    await prisma.resultados_Riesgos_Detectados.createMany({
      data: [
        {
          analisis_id: analisis.analisis_id,
          riesgo: 'Fluctuación en precios de materia prima',
          causa_directa: 'Dependencia de proveedores externos',
          impacto_potencial: 'Aumento de costos de producción'
        },
        {
          analisis_id: analisis.analisis_id,
          riesgo: 'Falta de control en inventarios',
          causa_directa: 'Sistema de inventario manual',
          impacto_potencial: 'Pérdidas por obsolescencia o robo'
        }
      ]
    });
  }

  console.log('✅ Seed completado exitosamente!');
  console.log(`📊 Datos creados:`);
  console.log(`   - ${tamanos.length} tamaños de negocio`);
  console.log(`   - ${estados.length} estados`);
  console.log(`   - 1 ruta de aprendizaje con ${modulos.length} módulos`);
  console.log(`   - ${usuarios.length} usuarios`);
  console.log(`   - ${negocios.length} negocios`);
  console.log(`   - Progreso en módulos para cada negocio`);
  console.log(`   - Registros financieros de ejemplo`);
  console.log(`   - Análisis de IA con resultados completos`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
