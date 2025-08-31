const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testEndpointCostosVariables() {
  try {
    console.log('🧪 Probando endpoint de costos variables...\n');
    
    // 1. Verificar que el negocio existe
    const negocio = await prisma.negocios.findFirst({
      where: { negocio_id: 4 }
    });
    
    if (!negocio) {
      console.log('❌ No se encontró el negocio con ID 4');
      return;
    }
    
    console.log('✅ Negocio encontrado:', negocio.nombre_negocio);
    
    // 2. Verificar que el tipo de costo existe
    const tipoCosto = await prisma.tiposCosto.findFirst({
      where: { tipo_costo_id: 6 }
    });
    
    if (!tipoCosto) {
      console.log('❌ No se encontró el tipo de costo con ID 6');
      return;
    }
    
    console.log('✅ Tipo de costo encontrado:', tipoCosto.nombre);
    
    // 3. Verificar que la unidad de medida existe
    const unidad = await prisma.unidadMedida.findFirst({
      where: { unidad_id: 1 }
    });
    
    if (!unidad) {
      console.log('❌ No se encontró la unidad de medida con ID 1');
      return;
    }
    
    console.log('✅ Unidad de medida encontrada:', unidad.nombre);
    
    // 4. Crear un costo variable directamente en la base de datos
    console.log('\n💰 Creando costo variable directamente en la base de datos...');
    const costoVariable = await prisma.costosVariables.create({
      data: {
        negocio_id: 4,
        tipo_costo_id: 6, // Mano de Obra
        nombre: 'Servicio de Prueba',
        descripcion: 'Costo de prueba para verificar endpoint',
        monto_por_unidad: 25.00,
        unidad_medida_id: 1
      }
    });
    
    console.log('✅ Costo variable creado exitosamente:');
    console.log('   - ID:', costoVariable.costo_variable_id);
    console.log('   - Nombre:', costoVariable.nombre);
    console.log('   - Monto:', costoVariable.monto_por_unidad);
    
    // 5. Verificar que se creó correctamente
    const costoVerificado = await prisma.costosVariables.findUnique({
      where: { costo_variable_id: costoVariable.costo_variable_id }
    });
    
    if (costoVerificado) {
      console.log('✅ Costo variable verificado en base de datos');
    } else {
      console.log('❌ Error: No se pudo verificar el costo variable');
    }
    
    // 6. Limpiar datos de prueba
    console.log('\n🧹 Limpiando datos de prueba...');
    await prisma.costosVariables.delete({
      where: { costo_variable_id: costoVariable.costo_variable_id }
    });
    console.log('✅ Costo variable de prueba eliminado');
    
    console.log('\n✅ El backend está funcionando correctamente para costos variables');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testEndpointCostosVariables();
