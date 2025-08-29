import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { StatusMapper } from './mappers/size.mapper';

@Module({
  imports: [PrismaModule],
  controllers: [StatusController],
  providers: [
    StatusService,
    StatusMapper,
  ],
})
export class StatusModule {}