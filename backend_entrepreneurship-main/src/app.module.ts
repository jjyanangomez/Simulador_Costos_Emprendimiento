import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MvcModule } from './mvc/mvc.module';
import { PrismaModule } from './shared/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    MvcModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
