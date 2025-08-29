import { Module } from '@nestjs/common';
import { BusinessProgressStepController } from './business-progress-step.controller';
import { BusinessProgressStepService } from './business-progress-step.service';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { BusinessProgressStepMapper } from './mappers/business-progress-step.mapper';


@Module({
  imports: [PrismaModule],
  controllers: [BusinessProgressStepController],
  providers: [
    BusinessProgressStepService,
    BusinessProgressStepMapper,
  ],
})
export class BusinessProgressStepModule {}