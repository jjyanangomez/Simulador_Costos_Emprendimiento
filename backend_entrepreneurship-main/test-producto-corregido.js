const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testProductoCorregido() {
  try {
    console.log('🧪 Probando creación de producto con datos corregidos...\n');
    
    // 1. Verificar que el negocio existe
    const negocio = await prisma.negocios.findFirst({
      where: { negocio_id: 4 } // Usar el ID que aparece en la consola
    });
    
    if (!negocio) {
      console.log('❌ No se encontró el negocio con ID 4');
      return;
    }
    
    console.log('✅ Negocio encontrado:', negocio.nombre_negocio);
    
    // 2. Verificar que la categoría existe
    const categoria = await prisma.categoriasProducto.findFirst({
      where: { categoria_id: 1 }
    });
    
    if (!categoria) {
      console.log('❌ No se encontró la categoría con ID 1');
      return;
    }
    
    console.log('✅ Categoría encontrada:', categoria.nombre);
    
    // 3. Verificar que la unidad de medida existe
    const unidad = await prisma.unidadMedida.findFirst({
      where: { unidad_id: 1 }
    });
    
    if (!unidad) {
      console.log('❌ No se encontró la unidad de medida con ID 1');
      return;
    }
    
    console.log('✅ Unidad de medida encontrada:', unidad.nombre);
    
    // 4. Crear un producto con datos corregidos
    console.log('\n📦 Creando producto con datos corregidos...');
    const producto = await prisma.productos.create({
      data: {
        negocio_id: 4,
        categoria_id: 1,
        unidad_medida_id: 1,
        nombre_producto: 'pili',
        precio_por_unidad: 3.00, // Usar el costo real en lugar de 0
        porcion_requerida: 1,
        costo_por_unidad: 3.00 // Usar el costo real en lugar de 0
      }
    });
    
    console.log('✅ Producto creado exitosamente:');
    console.log('   - ID:', producto.producto_id);
    console.log('   - Nombre:', producto.nombre_producto);
    console.log('   - Precio por unidad:', producto.precio_por_unidad);
    console.log('   - Costo por unidad:', producto.costo_por_unidad);
    
    // 5. Verificar que se creó correctamente
    const productoVerificado = await prisma.productos.findUnique({
      where: { producto_id: producto.producto_id }
    });
    
    if (productoVerificado) {
      console.log('✅ Producto verificado en base de datos');
    } else {
      console.log('❌ Error: No se pudo verificar el producto');
    }
    
    // 6. Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba...');
    await prisma.productos.delete({
      where: { producto_id: producto.producto_id }
    });
    console.log('✅ Producto de prueba eliminado');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testProductoCorregido();
