#!/bin/bash

echo "🔍 Verificando conexión Frontend-Backend..."

# Verificar si el backend está corriendo
echo "📡 Verificando si el backend está corriendo..."
if curl -s http://localhost:3000/api/v1 > /dev/null 2>&1; then
    echo "✅ Backend está corriendo en http://localhost:3000"
else
    echo "❌ Backend NO está corriendo en http://localhost:3000"
    echo ""
    echo "🚀 Para iniciar el backend:"
    echo "cd Backend && npm run start:dev"
    echo ""
    exit 1
fi

# Verificar endpoint específico
echo "🔗 Verificando endpoint de usuarios..."
if curl -s http://localhost:3000/api/v1/usuarios > /dev/null 2>&1; then
    echo "✅ Endpoint de usuarios responde correctamente"
else
    echo "❌ Endpoint de usuarios no responde"
fi

# Verificar CORS
echo "🌐 Verificando configuración CORS..."
CORS_RESPONSE=$(curl -s -I -H "Origin: http://localhost:5173" http://localhost:3000/api/v1/usuarios 2>/dev/null | grep -i "access-control-allow-origin" || echo "No CORS headers found")

if echo "$CORS_RESPONSE" | grep -q "localhost:5173"; then
    echo "✅ CORS configurado correctamente para frontend"
else
    echo "❌ CORS no configurado correctamente"
    echo "Respuesta CORS: $CORS_RESPONSE"
fi

# Verificar archivo .env del frontend
echo "📋 Verificando configuración del frontend..."
if [ -f ".env" ]; then
    echo "✅ Archivo .env existe"
    echo "📄 Contenido:"
    cat .env
else
    echo "❌ Archivo .env no existe"
    echo "Ejecuta: ./scripts/setup-env.sh"
fi

echo ""
echo "🎯 Resumen de URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:3000"
echo "- API Docs: http://localhost:3000/api/docs"
echo "- API Base: http://localhost:3000/api/v1"
echo ""
echo "🧪 Para probar manualmente:"
echo "curl http://localhost:3000/api/v1/usuarios"
