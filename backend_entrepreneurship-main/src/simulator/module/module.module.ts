import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { PrismaModule } from 'src/shared/database/prisma.module';
import { ModuleMapper } from './mappers/module.mapper';


@Module({
  imports: [PrismaModule],
  controllers: [ModuleController],
  providers: [
    ModuleService,
    ModuleMapper,
  ],
})
export class ModuleModule {}