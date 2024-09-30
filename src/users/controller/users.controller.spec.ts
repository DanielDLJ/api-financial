import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from '../../encryption/service/encryption.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { UsersRepository } from '../repository/user.repository';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn().mockImplementation((key: string) => {
              if (key === 'encryption.secretKey') {
                return process.env.ENCRYPTION_SECRET_KEY;
              }
              if (key === 'encryption.ivLength') {
                return Number(process.env.ENCRYPTION_IV_LENGTH);
              }
              if (key === 'encryption.salt') {
                return Number(process.env.ENCRYPTION_SALT);
              }
            }),
          },
        },
        UsersService,
        EncryptionService,
        PrismaService,
        UsersRepository,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
