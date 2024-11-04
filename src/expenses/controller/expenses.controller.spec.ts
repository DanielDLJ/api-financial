import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from '../service/expenses.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ExpensesRepository } from '../repository/expenses.repository';

describe('ExpensesController', () => {
  let controller: ExpensesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [ExpensesService, PrismaService, ExpensesRepository],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('true', () => expect(true).toBe(true));
});
