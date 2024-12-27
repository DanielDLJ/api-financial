import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';
import { UsersService } from '@/users/service/users.service';
import { EncryptionService } from '@/encryption/service/encryption.service';
import { TokenService } from '@/token/service/token.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    signIn: jest.fn(),
    signUp: jest.fn(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockEncryptionService = {
    compareHashPassword: jest.fn(),
    hashPassword: jest.fn(),
  };

  const mockTokenService = {
    generateToken: jest.fn(),
    verifyAccessToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              if (key === 'jwt.access.secret') return 'test-secret';
              if (key === 'jwt.access.expiresIn') return '1h';
              if (key === 'jwt.refresh.secret') return 'refresh-secret';
              if (key === 'jwt.refresh.expiresIn') return '7d';
              throw new Error(`Config ${key} not found`);
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in a user and return an access token', async () => {
      const signInDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        user: {
          sub: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: Role.USER,
        },
      };

      mockAuthService.signIn.mockResolvedValue(expectedResponse);

      const result = await controller.signIn(signInDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        signInDto.email,
        signInDto.password,
      );
    });
  });

  describe('signUp', () => {
    it('should register a new user and return tokens', async () => {
      const signUpDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        user: {
          sub: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: Role.USER,
        },
      };

      mockAuthService.signUp.mockResolvedValue(expectedResponse);

      const result = await controller.signUp(signUpDto);

      expect(result).toEqual(expectedResponse);
      expect(mockAuthService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });
});
