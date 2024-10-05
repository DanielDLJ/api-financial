import { Test, TestingModule } from '@nestjs/testing';
import { BanksController } from './banks.controller';
import { BanksService } from '../service/banks.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { BanksRepository } from '../repository/banks.repository';

describe('BanksController', () => {
  let controller: BanksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BanksController],
      providers: [BanksService, PrismaService, BanksRepository],
    }).compile();

    controller = module.get<BanksController>(BanksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
