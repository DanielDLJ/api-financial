import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/service/users.service';
import { EncryptionService } from '@/encryption/service/encryption.service';
import { TokenService } from '@/token/service/token.service';
import { Role } from '@prisma/client';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

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
      providers: [
        AuthService,
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
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    const email = 'test@example.com';
    const password = 'password123';

    it('should sign in a user and return an access token', async () => {
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        name: 'Test User',
        role: Role.USER,
      };

      const expectedResponse = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        user: {
          sub: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockEncryptionService.compareHashPassword.mockResolvedValue(true);
      mockTokenService.generateToken.mockResolvedValue(expectedResponse);

      const result = await service.signIn(email, password);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockEncryptionService.compareHashPassword).toHaveBeenCalledWith(
        password,
        user.password,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(service.signIn(email, password)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.AUTH_USER_NOT_FOUND,
          message: 'User not found',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        name: 'Test User',
        role: Role.USER,
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      mockEncryptionService.compareHashPassword.mockResolvedValue(false);

      await expect(service.signIn(email, password)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
          message: 'Invalid credentials',
          statusCode: 401,
        }),
      );
    });
  });

  describe('signUp', () => {
    const signUpDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should sign up a user and return an access token', async () => {
      const createdUser = {
        id: 1,
        ...signUpDto,
        role: Role.USER,
      };

      const expectedResponse = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        user: {
          sub: createdUser.id,
          email: createdUser.email,
          name: createdUser.name,
          role: createdUser.role,
        },
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(createdUser);
      mockTokenService.generateToken.mockResolvedValue(expectedResponse);

      const result = await service.signUp(signUpDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        ...signUpDto,
        role: Role.USER,
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: 1 });

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.AUTH_USER_ALREADY_EXISTS,
          message: 'User already exists.',
          statusCode: HttpStatus.CONFLICT,
        }),
      );
    });
  });
});
