import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/service/prisma.service';
import { UsersService } from '../../users/service/users.service';
import { JwtService } from '@nestjs/jwt';
import { EncryptionService } from '../../encryption/service/encryption.service';
import { ConfigService } from '@nestjs/config';
import { Role, User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../users/repository/user.repository';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let encryptionService: EncryptionService;
  let jwtService: JwtService;
  const email = 'ana@hotmail.com';
  const password = '123456';
  const user: User = {
    id: 1,
    name: 'Ana',
    email,
    password,
    role: Role.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    encryptionService = module.get<EncryptionService>(EncryptionService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(encryptionService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  it('should sign in a user and return an access token', async () => {
    const token = 'fake-token';
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
    jest
      .spyOn(encryptionService, 'compareHashPassword')
      .mockResolvedValue(true);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue(token);

    const result = await authService.signIn(email, password);

    expect(usersService.findByEmail).toHaveBeenCalledWith(email);
    expect(encryptionService.compareHashPassword).toHaveBeenCalledWith(
      password,
      user.password,
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      email: user.email,
      id: user.id,
      role: user.role,
    });
    expect(result).toEqual({
      access_token: token,
      refresh_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(undefined);

    await expect(authService.signIn(email, password)).rejects.toThrowError(
      UnauthorizedException,
    );
    expect(usersService.findByEmail).toHaveBeenCalledWith(email);
  });

  it('should throw UnauthorizedException if password does not match', async () => {
    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
    jest
      .spyOn(encryptionService, 'compareHashPassword')
      .mockResolvedValue(false);

    await expect(authService.signIn(email, password)).rejects.toThrowError(
      UnauthorizedException,
    );
    expect(usersService.findByEmail).toHaveBeenCalledWith(email);
    expect(encryptionService.compareHashPassword).toHaveBeenCalledWith(
      password,
      user.password,
    );
  });
});
