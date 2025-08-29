#!/bin/bash

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 [START-BACKEND] Iniciando backend con Docker...${NC}"

# Función para mostrar mensajes de error
error_exit() {
    echo -e "${RED}❌ [START-BACKEND] Error: $1${NC}" >&2
    exit 1
}

# Función para mostrar mensajes de éxito
success_msg() {
    echo -e "${GREEN}✅ [START-BACKEND] $1${NC}"
}

# Función para mostrar mensajes de información
info_msg() {
    echo -e "${BLUE}ℹ️  [START-BACKEND] $1${NC}"
}

# Función para mostrar mensajes de advertencia
warning_msg() {
    echo -e "${YELLOW}⚠️  [START-BACKEND] $1${NC}"
}

# Paso 1: Verificar que Docker esté instalado
info_msg "Verificando Docker..."
if ! command -v docker &> /dev/null; then
    error_exit "Docker no está instalado. Por favor instala Docker Desktop primero."
fi
success_msg "Docker encontrado: $(docker --version)"

# Paso 2: Verificar que Docker Compose esté instalado
info_msg "Verificando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    error_exit "Docker Compose no está instalado. Por favor instala Docker Compose primero."
fi
success_msg "Docker Compose encontrado: $(docker-compose --version)"

# Paso 3: Verificar que estemos en el directorio correcto
info_msg "Verificando directorio del proyecto..."
if [ ! -f "docker-compose.yml" ] || [ ! -f "Dockerfile" ] || [ ! -f "package.json" ]; then
    error_exit "No se encontraron los archivos necesarios. Asegúrate de estar en el directorio del proyecto Backend."
fi
success_msg "Directorio del proyecto verificado"

# Paso 4: Verificar que el archivo .env exista
info_msg "Verificando archivo de variables de entorno..."
if [ ! -f ".env" ]; then
    warning_msg "Archivo .env no encontrado. Copiando desde env.example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        success_msg "Archivo .env creado desde env.example"
        warning_msg "Por favor revisa y ajusta las variables de entorno en el archivo .env"
    else
        error_exit "No se encontró env.example. Por favor crea el archivo .env manualmente."
    fi
else
    success_msg "Archivo .env encontrado"
fi

# Paso 5: Verificar permisos de scripts
info_msg "Verificando permisos de scripts..."
if [ -d "scripts" ]; then
    chmod +x scripts/*.sh 2>/dev/null || warning_msg "No se pudieron cambiar permisos de scripts"
    success_msg "Permisos de scripts verificados"
fi

# Paso 6: Ejecutar verificación de configuración
info_msg "Ejecutando verificación de configuración..."
if [ -f "scripts/quick-check.sh" ]; then
    ./scripts/quick-check.sh
    if [ $? -ne 0 ]; then
        error_exit "La verificación de configuración falló. Revisa los errores anteriores."
    fi
    success_msg "Verificación de configuración completada"
else
    warning_msg "Script de verificación no encontrado, continuando..."
fi

# Paso 7: Detener contenedores existentes
info_msg "Deteniendo contenedores existentes..."
docker-compose down --remove-orphans 2>/dev/null || warning_msg "No había contenedores ejecutándose"

# Paso 8: Verificar puertos disponibles
info_msg "Verificando puertos disponibles..."
ports=(3000 5432 5050)
for port in "${ports[@]}"; do
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        warning_msg "Puerto $port está en uso"
    else
        success_msg "Puerto $port disponible"
    fi
done

# Paso 9: Construir e iniciar contenedores
info_msg "Construyendo e iniciando contenedores..."
echo -e "${YELLOW}⏳ [START-BACKEND] Esto puede tomar 2-3 minutos en la primera ejecución...${NC}"
docker-compose up --build -d

if [ $? -ne 0 ]; then
    error_exit "Error al construir o iniciar los contenedores"
fi
success_msg "Contenedores iniciados"

# Paso 10: Esperar a que los servicios estén listos
info_msg "Esperando a que los servicios estén listos..."
echo -e "${YELLOW}⏳ [START-BACKEND] Esperando 15 segundos para que los servicios se inicialicen...${NC}"
sleep 15

# Paso 11: Verificar estado de los contenedores
info_msg "Verificando estado de los contenedores..."
docker-compose ps

# Paso 12: Verificar que el backend esté respondiendo
info_msg "Verificando que el backend esté respondiendo..."
max_attempts=10
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -s http://localhost:3000/api/v1/ > /dev/null 2>&1; then
        success_msg "Backend está respondiendo correctamente"
        break
    else
        if [ $attempt -eq $max_attempts ]; then
            warning_msg "Backend no responde después de $max_attempts intentos"
            warning_msg "Revisa los logs con: docker-compose logs -f"
        else
            echo -e "${YELLOW}⏳ [START-BACKEND] Intento $attempt/$max_attempts - Esperando respuesta del backend...${NC}"
            sleep 10
        fi
    fi
    ((attempt++))
done

# Paso 13: Mostrar información final
echo ""
echo -e "${GREEN}🎉 [START-BACKEND] ¡Backend iniciado exitosamente!${NC}"
echo ""
echo -e "${BLUE}📋 [START-BACKEND] URLs de acceso:${NC}"
echo -e "   🌐 API Principal: ${GREEN}http://localhost:3000/api/v1/${NC}"
echo -e "   📚 Swagger Docs: ${GREEN}http://localhost:3000/api/docs${NC}"
echo -e "   🗄️ pgAdmin: ${GREEN}http://localhost:5050${NC}"
echo ""
echo -e "${BLUE}📋 [START-BACKEND] Credenciales pgAdmin:${NC}"
echo -e "   📧 Email: ${GREEN}admin@krakedev.com${NC}"
echo -e "   🔑 Password: ${GREEN}admin123${NC}"
echo ""
echo -e "${BLUE}📋 [START-BACKEND] Comandos útiles:${NC}"
echo -e "   📋 Ver logs: ${GREEN}docker-compose logs -f${NC}"
echo -e "   🛑 Detener: ${GREEN}docker-compose down${NC}"
echo -e "   🔄 Reiniciar: ${GREEN}docker-compose restart${NC}"
echo -e "   🔍 Verificar salud: ${GREEN}./scripts/health-check.sh${NC}"
echo ""

# Paso 14: Preguntar si mostrar logs
read -p "¿Deseas ver los logs del backend? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    info_msg "Mostrando logs del backend..."
    echo -e "${YELLOW}💡 [START-BACKEND] Presiona Ctrl+C para salir de los logs${NC}"
    docker-compose logs -f backend
fi

success_msg "¡Proceso completado!"
