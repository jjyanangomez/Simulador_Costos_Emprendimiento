import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; 
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: false,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  app.setGlobalPrefix('api/v1');
   // --- CONFIGURACIÓN DE SWAGGER ---

  // 1. Crear la configuración base con DocumentBuilder
  const config = new DocumentBuilder()
    .setTitle('API Simulador de Emprendimientos')
    .setDescription(
      'Documentación de la API para gestionar negocios, progresos y catálogos del simulador.',
    )
    .setVersion('1.0')
    .addTag('API de simulador de negocios') // Una etiqueta general
    .build();

  // 2. Crear el documento completo de Swagger
  const document = SwaggerModule.createDocument(app, config);

  // 3. Configurar el endpoint de la UI de Swagger
  // La UI estará disponible en http://localhost:3000/api/docs
  SwaggerModule.setup('api/docs', app, document);

  // --- FIN DE LA CONFIGURACIÓN DE SWAGGER ---
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
