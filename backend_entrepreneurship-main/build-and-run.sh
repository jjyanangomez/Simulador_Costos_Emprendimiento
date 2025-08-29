#!/bin/bash

set -e

echo "🐳 [DOCKER] Iniciando construcción y ejecución del backend..."

# Verificar que Docker esté instalado
if ! command -v docker &> /dev/null; then
    echo "❌ [DOCKER] Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Verificar que Docker Compose esté instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ [DOCKER] Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

# Verificar que el archivo .env exista
if [ ! -f ".env" ]; then
    echo "📝 [DOCKER] Archivo .env no encontrado. Copiando desde env.example..."
    cp env.example .env
    echo "✅ [DOCKER] Archivo .env creado. Por favor revisa y ajusta las variables de entorno."
fi

# Detener contenedores existentes
echo "🛑 [DOCKER] Deteniendo contenedores existentes..."
docker-compose down --remove-orphans

# Limpiar imágenes anteriores (opcional)
read -p "¿Deseas limpiar imágenes anteriores? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 [DOCKER] Limpiando imágenes anteriores..."
    docker-compose down --rmi all --volumes --remove-orphans
fi

# Construir y ejecutar
echo "🔨 [DOCKER] Construyendo y ejecutando servicios..."
docker-compose up --build -d

# Esperar a que los servicios estén listos
echo "⏳ [DOCKER] Esperando a que los servicios estén listos..."
sleep 10

# Verificar estado de los contenedores
echo "🔍 [DOCKER] Verificando estado de los contenedores..."
docker-compose ps

# Mostrar logs del backend
echo "📋 [DOCKER] Mostrando logs del backend..."
docker-compose logs -f backend
