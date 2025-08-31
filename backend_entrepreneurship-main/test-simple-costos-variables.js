const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testSimpleCostosVariables() {
  try {
    console.log('🧪 Probando creación simple de costos variables...\n');
    
    // 1. Verificar que el negocio existe
    const negocio = await prisma.negocios.findFirst({
      where: { negocio_id: 1 }
    });
    
    if (!negocio) {
      console.log('❌ No se encontró el negocio con ID 1');
      return;
    }
    
    console.log('✅ Negocio encontrado:', negocio.nombre_negocio);
    
    // 2. Crear un costo variable simple (sin producto ni receta)
    console.log('\n💰 Creando costo variable adicional...');
    const costoVariable = await prisma.costosVariables.create({
      data: {
        negocio_id: 1,
        tipo_costo_id: 6, // Mano de Obra
        nombre: 'Servicio de Limpieza de Prueba',
        descripcion: 'Costo de prueba para verificar funcionamiento',
        monto_por_unidad: 25.00,
        unidad_medida_id: 1
      }
    });
    
    console.log('✅ Costo variable creado:', costoVariable.nombre);
    console.log('   - ID:', costoVariable.costo_variable_id);
    console.log('   - Monto:', costoVariable.monto_por_unidad);
    
    // 3. Verificar que se creó correctamente
    const costoVerificado = await prisma.costosVariables.findUnique({
      where: { costo_variable_id: costoVariable.costo_variable_id }
    });
    
    if (costoVerificado) {
      console.log('✅ Costo variable verificado en base de datos');
    } else {
      console.log('❌ Error: No se pudo verificar el costo variable');
    }
    
    // 4. Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba...');
    await prisma.costosVariables.delete({
      where: { costo_variable_id: costoVariable.costo_variable_id }
    });
    console.log('✅ Datos de prueba eliminados');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testSimpleCostosVariables();
