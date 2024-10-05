import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/service/prisma.service';
import { FlagsRepository } from './flags.repository';

describe('FlagsRepository', () => {
  let repository: FlagsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, FlagsRepository],
    }).compile();

    repository = module.get<FlagsRepository>(FlagsRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
