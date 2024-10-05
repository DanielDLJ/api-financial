import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FlagsController } from './controller/flags.controller';
import { FlagsService } from './service/flags.service';
import { FlagsRepository } from './repository/flags.repository';

@Module({
  imports: [PrismaModule],
  controllers: [FlagsController],
  providers: [FlagsService, FlagsRepository],
  exports: [FlagsService],
})
export class FlagsModule {}
