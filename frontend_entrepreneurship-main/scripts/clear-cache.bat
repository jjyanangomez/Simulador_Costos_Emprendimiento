@echo off
echo 🧹 Limpiando cache y reiniciando servidor de desarrollo...

REM Detener el servidor si está corriendo
echo 🛑 Deteniendo servidor de desarrollo...
taskkill /f /im node.exe 2>nul || echo No hay procesos de Node.js corriendo

REM Limpiar cache de node_modules
echo 🗑️ Limpiando cache de node_modules...
if exist "node_modules\.vite" rmdir /s /q "node_modules\.vite"

REM Limpiar cache del navegador (opcional)
echo 🌐 Limpiando cache del navegador...
echo Por favor, abre las herramientas de desarrollador (F12) y:
echo 1. Ve a la pestaña 'Application' o 'Aplicación'
echo 2. En 'Storage' o 'Almacenamiento', haz clic en 'Clear site data'
echo 3. O presiona Ctrl+Shift+R para recargar sin cache

REM Reinstalar dependencias si es necesario
echo 📦 Verificando dependencias...
npm install

REM Iniciar servidor de desarrollo
echo 🚀 Iniciando servidor de desarrollo...
npm run dev

pause
