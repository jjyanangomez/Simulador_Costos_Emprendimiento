#!/bin/bash

echo "🧹 Limpiando cache y reiniciando servidor de desarrollo..."

# Detener el servidor si está corriendo
echo "🛑 Deteniendo servidor de desarrollo..."
pkill -f "vite" || true

# Limpiar cache de node_modules
echo "🗑️ Limpiando cache de node_modules..."
rm -rf node_modules/.vite

# Limpiar cache del navegador (opcional)
echo "🌐 Limpiando cache del navegador..."
echo "Por favor, abre las herramientas de desarrollador (F12) y:"
echo "1. Ve a la pestaña 'Application' o 'Aplicación'"
echo "2. En 'Storage' o 'Almacenamiento', haz clic en 'Clear site data'"
echo "3. O presiona Ctrl+Shift+R para recargar sin cache"

# Reinstalar dependencias si es necesario
echo "📦 Verificando dependencias..."
npm install

# Iniciar servidor de desarrollo
echo "🚀 Iniciando servidor de desarrollo..."
npm run dev
