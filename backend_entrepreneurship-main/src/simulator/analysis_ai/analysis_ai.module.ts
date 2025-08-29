import { Module } from '@nestjs/common';
import { AnalisisIAController } from './analysis_ai.controller';
import { AnalisisIAService } from './analysis_ai.service';
import { AnalisisIAMapper } from './mappers/analysis_ai.mapper';
import { PrismaModule } from 'src/shared/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AnalisisIAController],
  providers: [
    AnalisisIAService,
    AnalisisIAMapper,
  ],
})
export class AnalisisIAModule {}
