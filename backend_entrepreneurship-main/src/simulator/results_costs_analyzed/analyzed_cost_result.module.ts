import { Module } from '@nestjs/common';
import { AnalyzedCostResultController } from './analyzed_cost_result.controller';
import { AnalyzedCostResultService } from './analyzed_cost_result.service';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { AnalyzedCostResultMapper } from './mappers/analyzed_cost_result.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [AnalyzedCostResultController],
  providers: [
    AnalyzedCostResultService,
    AnalyzedCostResultMapper,
  ],
})
export class AnalyzedCostResultModule {}