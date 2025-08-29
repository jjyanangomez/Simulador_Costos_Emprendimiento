# Usar la imagen oficial de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias (incluyendo devDependencies para compilar)
RUN npm ci

# Generar el cliente de Prisma
RUN npx prisma generate

# Copiar el código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Verificar que la compilación fue exitosa
RUN ls -la dist/

# Instalar solo dependencias de producción para la imagen final
# Instalar solo dependencias de producción
RUN npm ci --only=production

# Exponer el puerto
EXPOSE 3000

# Sobrescribir el ENTRYPOINT de la imagen base
ENTRYPOINT []

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "echo '🚀 [ENTRYPOINT] Iniciando aplicación...' && npx prisma migrate deploy && npx prisma generate && echo '🌱 Ejecutando seed...' && npm run seed && echo '🚀 [ENTRYPOINT] Iniciando aplicación NestJS...' && exec node dist/src/main"]