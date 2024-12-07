import { Module } from '@nestjs/common';
import { CreditCardsService } from './service/credit-cards.service';
import { CreditCardsController } from './controller/credit-cards.controller';
import { CreditCardOwnerGuard } from './guards/credit-card-owner.guard';
import { PrismaModule } from '@/prisma/prisma.module';
import { UsersModule } from '@/users/users.module';
import { CreditCardsRepository } from './repository/credit-cards.repository';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [CreditCardsController],
  providers: [CreditCardsService, CreditCardsRepository, CreditCardOwnerGuard],
})
export class CreditCardsModule {}
