import { Test, TestingModule } from '@nestjs/testing';
import { FlagsController } from './flags.controller';
import { FlagsService } from '../service/flags.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { FlagsRepository } from '../repository/flags.repository';

describe('FlagsController', () => {
  let controller: FlagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlagsController],
      providers: [FlagsService, PrismaService, FlagsRepository],
    }).compile();

    controller = module.get<FlagsController>(FlagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
