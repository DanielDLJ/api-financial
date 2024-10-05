import { Test, TestingModule } from '@nestjs/testing';
import { FlagsService } from './flags.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { FlagsRepository } from '../repository/flags.repository';

describe('FlagsService', () => {
  let service: FlagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlagsService, PrismaService, FlagsRepository],
    }).compile();

    service = module.get<FlagsService>(FlagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
