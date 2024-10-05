import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BanksController } from './controller/banks.controller';
import { BanksService } from './service/banks.service';
import { BanksRepository } from './repository/banks.repository';

@Module({
  imports: [PrismaModule],
  controllers: [BanksController],
  providers: [BanksService, BanksRepository],
  exports: [BanksService],
})
export class BanksModule {}
