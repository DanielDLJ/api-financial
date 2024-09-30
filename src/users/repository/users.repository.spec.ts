import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/service/prisma.service';
import { UsersRepository } from '../repository/user.repository';

describe('UsersRepository', () => {
  let repository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, UsersRepository],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
});
