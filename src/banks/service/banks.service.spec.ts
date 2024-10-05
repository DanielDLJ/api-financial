import { Test, TestingModule } from '@nestjs/testing';
import { BanksService } from './banks.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { BanksRepository } from '../repository/banks.repository';

describe('BanksService', () => {
  let service: BanksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanksService, PrismaService, BanksRepository],
    }).compile();

    service = module.get<BanksService>(BanksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
