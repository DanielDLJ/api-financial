import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/service/prisma.service';
import { CreditCardsRepository } from './credit-cards.repository';

describe('CreditCardsRepository', () => {
  let repository: CreditCardsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, CreditCardsRepository],
    }).compile();

    repository = module.get<CreditCardsRepository>(CreditCardsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
