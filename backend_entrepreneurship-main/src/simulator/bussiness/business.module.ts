// src/simulator/bussiness/business.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { BusinessService } from './business.service';
import { BusinessMapper } from './mappers/business.mapper';
import { BusinessController } from './bussiness.controller';
import { ProductoPrecioVentaService } from './services/producto-precio-venta.service';
import { ProductoPrecioVentaController } from './controllers/producto-precio-venta.controller';

@Module({
  imports: [PrismaModule], // <-- Hace que PrismaService esté disponible
  controllers: [BusinessController, ProductoPrecioVentaController],
  providers: [BusinessService, BusinessMapper, ProductoPrecioVentaService],
  exports: [ProductoPrecioVentaService], // Exportar para uso en otros módulos
})
export class BusinessModule {}