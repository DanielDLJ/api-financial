import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/service/prisma.service';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from '../../encryption/service/encryption.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../service/auth.service';
import { AuthController } from './auth.controller';
import { SignInDto } from '../dto/sign-in.dto';
import { UsersRepository } from '../../users/repository/user.repository';
import { Role } from '@prisma/client';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  const email = 'ana@hotmail.com';
  const password = '123456';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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
        AuthService,
        UsersService,
        PrismaService,
        JwtService,
        EncryptionService,
        UsersRepository,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  it('should sign in a user and return an access token', async () => {
    const response = {
      access_token: 'fake-token',
      refresh_token: 'fake-token',
      user: {
        id: 1,
        name: 'Ana',
        email: 'ana@hotmail.com',
        role: Role.USER,
      },
    };
    jest.spyOn(authService, 'signIn').mockResolvedValue(response);

    const signInDto: SignInDto = {
      email,
      password,
    };

    const result = await authController.signIn(signInDto);

    expect(authService.signIn).toHaveBeenCalledWith(email, password);
    expect(result).toEqual(response);
  });
});
