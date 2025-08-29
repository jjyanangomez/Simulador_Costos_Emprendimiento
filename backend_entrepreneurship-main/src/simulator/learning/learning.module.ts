import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { LearningController } from './learning.controller';
import { LearningService } from './learning.service';
import { LearningMapper } from './mappers/learining.mapper';

@Module({
  imports: [PrismaModule], // Importamos para tener acceso a PrismaService
  controllers: [LearningController],
  providers: [
    LearningService,
    LearningMapper,
  ],
})
export class LearningModule {}