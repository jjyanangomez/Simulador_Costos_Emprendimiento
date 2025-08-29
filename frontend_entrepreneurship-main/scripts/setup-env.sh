#!/bin/bash

echo "🔧 Configurando variables de entorno para el Frontend..."

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env..."
    cat > .env << EOF
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_APP_TITLE=Simulador de Emprendimientos
EOF
    echo "✅ Archivo .env creado exitosamente"
else
    echo "✅ Archivo .env ya existe"
fi

# Verificar contenido del archivo
echo "📋 Contenido del archivo .env:"
cat .env

echo ""
echo "🚀 Para aplicar los cambios:"
echo "1. Detener el servidor (Ctrl+C)"
echo "2. Reiniciar: npm run dev"
echo ""
echo "🌐 URLs configuradas:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:3000"
echo "- API Base: http://localhost:3000/api/v1"
