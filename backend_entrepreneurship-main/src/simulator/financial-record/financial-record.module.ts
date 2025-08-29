import { Module } from '@nestjs/common';
import { FinancialRecordController } from './financial-record.controller';
import { FinancialRecordService } from './financial-record.service';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { FinancialRecordMapper } from './mappers/financial-record.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [FinancialRecordController],
  providers: [
    FinancialRecordService,
    FinancialRecordMapper,
  ],
})
export class FinancialRecordModule {}