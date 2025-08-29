import { Module } from '@nestjs/common';
import { OmittedCostResultController } from './omitted-cost-result.controller';
import { OmittedCostResultService } from './omitted-cost-result.service';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { OmittedCostResultMapper } from './mappers/omitted-cost-result.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [OmittedCostResultController],
  providers: [
    OmittedCostResultService,
    OmittedCostResultMapper,
  ],
})
export class OmittedCostResultModule {}