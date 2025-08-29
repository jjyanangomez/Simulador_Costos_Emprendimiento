#!/bin/bash

set -e

echo "🚀 [INIT] Iniciando backend..."

# Esperar a que la base de datos esté lista
echo "🗄️ [INIT] Esperando base de datos..."
for i in {1..30}; do
    if nc -z postgres 5432 2>/dev/null; then
        echo "✅ [INIT] Base de datos lista"
        break
    fi
    echo "⏳ [INIT] Esperando... ($i/30)"
    sleep 2
done

# Verificar que la base de datos esté realmente lista
if ! nc -z postgres 5432 2>/dev/null; then
    echo "❌ [INIT] No se pudo conectar a la base de datos después de 60 segundos"
    exit 1
fi

# Generar cliente de Prisma
echo "🔧 [INIT] Generando Prisma Client..."
npx prisma generate

# Ejecutar migraciones
echo "🔄 [INIT] Ejecutando migraciones..."
npx prisma migrate deploy

# Verificar que la aplicación esté compilada
if [ ! -f "dist/src/main.js" ]; then
    echo "🔧 [INIT] Compilando aplicación..."
    npm run build
fi

# Ejecutar seed si es la primera vez
echo "🌱 [INIT] Verificando si se necesita ejecutar seed..."
if [ ! -f "/tmp/seed-completed" ]; then
    echo "🌱 [INIT] Ejecutando seed de datos..."
    npm run seed
    touch /tmp/seed-completed
    echo "✅ [INIT] Seed completado"
else
    echo "✅ [INIT] Seed ya fue ejecutado anteriormente"
fi

echo "🚀 [INIT] Iniciando aplicación..."
exec node dist/src/main.js
