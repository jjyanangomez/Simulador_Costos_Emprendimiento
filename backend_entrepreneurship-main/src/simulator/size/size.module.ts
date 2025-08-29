import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { SizeController } from './size.controller';
import { SizeService } from './size.service';
import { SizeMapper } from './mappers/size.mapper';


@Module({
  imports: [PrismaModule],
  controllers: [SizeController],
  providers: [
    SizeService,
    SizeMapper,
  ],
})
export class SizeModule {}