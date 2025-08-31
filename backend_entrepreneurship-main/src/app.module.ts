import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MvcModule } from './mvc/mvc.module';
import { PrismaModule } from './shared/database/prisma.module';
import { AiModule } from './simulator/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    MvcModule,
    AiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
