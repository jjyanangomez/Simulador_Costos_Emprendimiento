#!/bin/bash

set -e

echo "🌱 [SEED] Iniciando seed de la base de datos..."

# Verificar que el contenedor esté ejecutándose
if ! docker ps | grep -q "krakedev_backend"; then
    echo "❌ [SEED] El contenedor del backend no está ejecutándose"
    echo "💡 [SEED] Ejecuta primero: docker-compose up -d"
    exit 1
fi

# Verificar que la base de datos esté lista
echo "🗄️ [SEED] Verificando conexión a la base de datos..."
if ! docker exec krakedev_backend nc -z postgres 5432 2>/dev/null; then
    echo "❌ [SEED] No se puede conectar a la base de datos"
    exit 1
fi

echo "✅ [SEED] Base de datos conectada"

# Ejecutar migraciones
echo "🔄 [SEED] Ejecutando migraciones..."
docker exec krakedev_backend npx prisma migrate deploy

# Ejecutar seed
echo "🌱 [SEED] Ejecutando seed de datos..."
docker exec krakedev_backend npm run seed

echo "✅ [SEED] Seed completado exitosamente"
echo "📊 [SEED] Datos creados:"
echo "   - 4 tamaños de negocio"
echo "   - 4 estados de progreso"
echo "   - 1 ruta de aprendizaje con 5 módulos"
echo "   - 3 usuarios de prueba"
echo "   - 5 negocios de ejemplo"
echo "   - Progreso y registros financieros"
echo "   - Análisis de IA con resultados completos"
