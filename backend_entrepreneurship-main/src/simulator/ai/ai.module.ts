import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { PromptService } from './prompt.service';
import { ValidationService } from './validation.service';
import { AnalysisService } from './analysis.service';
import { CompleteAnalysisResultService } from '../../mvc/services/complete-analysis-result.service';
import { PrismaModule } from '../../shared/database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiController],
  providers: [AiService, PromptService, ValidationService, AnalysisService, CompleteAnalysisResultService],
  exports: [AiService, PromptService, ValidationService, AnalysisService],
})
export class AiModule {}