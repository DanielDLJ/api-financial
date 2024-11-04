import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ExpensesRepository } from './expenses.repository';

describe('ExpensesRepository', () => {
  let repository: ExpensesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, ExpensesRepository],
    }).compile();

    repository = module.get<ExpensesRepository>(ExpensesRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
