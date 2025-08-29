import { Module } from '@nestjs/common';
import { ActionPlanResultController } from './action-plan-result.controller';
import { ActionPlanResultService } from './action-plan-result.service';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { ActionPlanResultMapper } from './mappers/action-plan-result.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [ActionPlanResultController],
  providers: [
    ActionPlanResultService,
    ActionPlanResultMapper,
  ],
})
export class ActionPlanResultModule {}