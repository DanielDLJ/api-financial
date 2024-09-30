import { Module } from '@nestjs/common';
import { CreditCardsService } from './service/credit-cards.service';
import { CreditCardsController } from './controller/credit-cards.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { CreditCardsRepository } from './repository/credit-cards.repository';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [CreditCardsController],
  providers: [CreditCardsService, CreditCardsRepository],
})
export class CreditCardsModule {}
