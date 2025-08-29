#!/bin/bash

echo "🧪 Probando flujo completo de negocios..."

# Verificar que el backend esté corriendo
echo "📡 Verificando backend..."
if ! curl -s http://localhost:3000/api/v1 > /dev/null 2>&1; then
    echo "❌ Backend no está corriendo. Inicia el backend primero:"
    echo "cd Backend && npm run start:dev"
    exit 1
fi

# Verificar que el frontend esté corriendo
echo "🌐 Verificando frontend..."
if ! curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "❌ Frontend no está corriendo. Inicia el frontend primero:"
    echo "cd Frontend && npm run dev"
    exit 1
fi

# Verificar endpoints específicos
echo "🔗 Verificando endpoints de negocios..."

# Probar endpoint de usuarios (para obtener datos de prueba)
echo "👤 Verificando usuarios..."
USERS_RESPONSE=$(curl -s http://localhost:3000/api/v1/usuarios)
if [ $? -eq 0 ]; then
    echo "✅ Endpoint de usuarios responde correctamente"
    echo "📋 Usuarios disponibles:"
    echo "$USERS_RESPONSE" | jq -r '.[] | "  - \(.nombreCompleto) (ID: \(.usuarioId))"'
else
    echo "❌ Error al obtener usuarios"
fi

# Probar endpoint de negocios
echo "🏢 Verificando negocios..."
BUSINESSES_RESPONSE=$(curl -s http://localhost:3000/api/v1/negocios)
if [ $? -eq 0 ]; then
    BUSINESS_COUNT=$(echo "$BUSINESSES_RESPONSE" | jq '. | length')
    echo "✅ Endpoint de negocios responde correctamente"
    echo "📊 Total de negocios en el sistema: $BUSINESS_COUNT"
else
    echo "❌ Error al obtener negocios"
fi

echo ""
echo "🎯 Flujo de prueba:"
echo "1. Abre http://localhost:5173/login"
echo "2. Inicia sesión con:"
echo "   - Email: maria@ejemplo.com"
echo "   - Contraseña: 123456"
echo "3. Ve a 'Mis Negocios'"
echo "4. Haz clic en 'Añadir Negocio'"
echo "5. Completa el formulario y guarda"
echo "6. Verifica que aparece en la lista"
echo ""
echo "🔍 Para ver logs en tiempo real:"
echo "- Backend: cd Backend && npm run start:dev"
echo "- Frontend: cd Frontend && npm run dev"
echo "- Navegador: F12 → Console"
