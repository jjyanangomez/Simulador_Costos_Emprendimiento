// src/simulator/bussiness/business.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { BusinessService } from './business.service';
import { BusinessMapper } from './mappers/business.mapper';
import { BusinessController } from './bussiness.controller';


@Module({
  imports: [PrismaModule], // <-- Hace que PrismaService esté disponible
  controllers: [BusinessController],
  providers: [BusinessService, BusinessMapper],
})
export class BusinessModule {}