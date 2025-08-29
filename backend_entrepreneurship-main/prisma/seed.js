const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  try {
    // Limpiar datos existentes (en orden correcto para evitar violaciones de FK)
    console.log('🧹 Limpiando datos existentes...');
    
    // Primero eliminar tablas que dependen de otras
    await prisma.resultados_Riesgos_Detectados.deleteMany();
    await prisma.resultados_Plan_Accion.deleteMany();
    await prisma.resultados_Costos_Omitidos.deleteMany();
    await prisma.resultados_Costos_Analizados.deleteMany();
    await prisma.resultados_Validacion_Costos.deleteMany();
    
    // Luego eliminar análisis que dependen de negocios
    await prisma.analisis_IA.deleteMany();
    
    // Eliminar progreso de negocios que depende de negocios y módulos
    await prisma.negocioProgresoPaso.deleteMany();
    
    // Eliminar registros financieros que dependen de negocios y módulos
    await prisma.registros_financieros.deleteMany();
    
    // Eliminar negocios que dependen de usuarios y tamaños
    await prisma.negocios.deleteMany();
    
    // Eliminar usuarios
    await prisma.usuarios.deleteMany();
    
    // Eliminar módulos que dependen de aprendizaje
    await prisma.modulos.deleteMany();
    
    // Eliminar aprendizaje
    await prisma.aprendizaje.deleteMany();
    
    // Eliminar estados
    await prisma.estados.deleteMany();
    
    // Eliminar tamaños de negocio
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
              concepto: 'Aprende los fundamentos de la gestión de costos y su importancia en el éxito empresarial.',
              recurso_interactivo: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            },
            {
              orden_modulo: 2,
              nombre_modulo: 'Clasificación de Costos',
              titulo_conteido: 'Tipos de Costos',
              concepto: 'Identifica y clasifica los diferentes tipos de costos en tu negocio.',
              recurso_interactivo: 'https://www.youtube.com/embed/jNQXAC9IVRw'
            },
            {
              orden_modulo: 3,
              nombre_modulo: 'Análisis de Punto de Equilibrio',
              titulo_conteido: 'Punto de Equilibrio',
              concepto: 'Calcula el punto de equilibrio y toma decisiones informadas sobre precios y volúmenes.',
              recurso_interactivo: 'https://www.youtube.com/embed/9bZkp7q19f0'
            },
            {
              orden_modulo: 4,
              nombre_modulo: 'Presupuesto de Costos',
              titulo_conteido: 'Presupuestación',
              concepto: 'Desarrolla presupuestos efectivos para controlar y planificar los costos.',
              recurso_interactivo: 'https://www.youtube.com/embed/kJQP7kiw5Fk'
            },
            {
              orden_modulo: 5,
              nombre_modulo: 'Control y Análisis de Desviaciones',
              titulo_conteido: 'Control de Costos',
              concepto: 'Implementa sistemas de control y análisis de desviaciones para optimizar costos.',
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
      })
    ]);

    console.log('✅ Seed completado exitosamente!');
    console.log(`📊 Datos creados:`);
    console.log(`   - ${tamanos.length} tamaños de negocio`);
    console.log(`   - ${estados.length} estados`);
    console.log(`   - 1 ruta de aprendizaje con 5 módulos`);
    console.log(`   - ${usuarios.length} usuarios`);
    console.log(`   - ${negocios.length} negocios`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
