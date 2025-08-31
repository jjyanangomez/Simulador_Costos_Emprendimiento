const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de categorías de activos fijos...');

  const categorias = [
    {
      nombre: 'Equipos de Cocina',
      descripcion: 'Equipos y utensilios necesarios para la preparación de alimentos',
      icono: '🍳',
      color: '#FF6B6B',
      activo: true
    },
    {
      nombre: 'Mobiliario',
      descripcion: 'Mesas, sillas, estantes y otros muebles del negocio',
      icono: '🪑',
      color: '#4ECDC4',
      activo: true
    },
    {
      nombre: 'Equipos de Refrigeración',
      descripcion: 'Refrigeradores, congeladores y equipos de frío',
      icono: '❄️',
      color: '#45B7D1',
      activo: true
    },
    {
      nombre: 'Equipos de Limpieza',
      descripcion: 'Aspiradoras, trapeadores y productos de limpieza',
      icono: '🧹',
      color: '#96CEB4',
      activo: true
    },
    {
      nombre: 'Equipos de Seguridad',
      descripcion: 'Cámaras de seguridad, alarmas y sistemas de protección',
      icono: '🔒',
      color: '#FFEAA7',
      activo: true
    },
    {
      nombre: 'Equipos de Oficina',
      descripcion: 'Computadoras, impresoras y otros equipos administrativos',
      icono: '💻',
      color: '#DDA0DD',
      activo: true
    },
    {
      nombre: 'Equipos de Ventilación',
      descripcion: 'Aires acondicionados, extractores y ventiladores',
      icono: '💨',
      color: '#98D8C8',
      activo: true
    },
    {
      nombre: 'Equipos de Iluminación',
      descripcion: 'Lámparas, focos y sistemas de iluminación',
      icono: '💡',
      color: '#F7DC6F',
      activo: true
    }
  ];

  for (const categoria of categorias) {
    const categoriaCreada = await prisma.categoriaActivoFijo.upsert({
      where: { nombre: categoria.nombre },
      update: {},
      create: categoria
    });
    console.log(`✅ Categoría creada: ${categoriaCreada.nombre}`);
  }

  console.log('🎉 Seed de categorías de activos fijos completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
