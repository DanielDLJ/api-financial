import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/service/prisma.service';
import { BanksRepository } from './banks.repository';

describe('BanksRepository', () => {
  let repository: BanksRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, BanksRepository],
    }).compile();

    repository = module.get<BanksRepository>(BanksRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
