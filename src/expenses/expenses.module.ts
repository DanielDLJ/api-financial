import { Module } from '@nestjs/common';
import { ExpensesService } from './service/expenses.service';
import { ExpensesController } from './controller/expenses.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ExpensesRepository } from './repository/expenses.repository';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ExpensesController],
  providers: [ExpensesService, ExpensesRepository],
})
export class ExpensesModule {}
