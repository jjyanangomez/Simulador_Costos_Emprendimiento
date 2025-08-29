import { Module } from '@nestjs/common';
import { DetectedRiskResultController } from './detected-risk-result.controller';
import { DetectedRiskResultService } from './detected-risk-result.service';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { DetectedRiskResultMapper } from './mappers/detected-risk-result.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [DetectedRiskResultController],
  providers: [
    DetectedRiskResultService,
    DetectedRiskResultMapper,
  ],
})
export class DetectedRiskResultModule {}