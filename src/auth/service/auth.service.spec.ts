import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '@/users/service/users.service';
import { EncryptionService } from '@/encryption/service/encryption.service';
import { TokenService } from '@/token/service/token.service';
import { Role } from '@prisma/client';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { HttpStatus } from '@nestjs/common';
import { ITokenPayload } from '@/token/interface/token-payload.interface';
import { RefreshTokenResponseDto } from '../dto/refresh-token-response.dto';
import { User } from '@/users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
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
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email, true);
      expect(mockEncryptionService.compareHashPassword).toHaveBeenCalledWith(
        password,
        user.password,
      );
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.findByEmail.mockRejectedValue(
        new ApiException({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: `User #${email} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );

      await expect(service.signIn(email, password)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.AUTH_USER_NOT_FOUND,
          message:
            'Authentication failed. Please check your email and password.',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });

    it('should throw UnauthorizedException if user is deleted', async () => {
      const user = {
        id: 1,
        email,
        password: 'hashedPassword',
        name: 'Test User',
        role: Role.USER,
        deletedAt: new Date(),
      };

      mockUsersService.findByEmail.mockResolvedValue(user);

      await expect(service.signIn(email, password)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.AUTH_USER_NOT_FOUND,
          message:
            'Authentication failed. Please check your email and password.',
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
          message:
            'Authentication failed. Please check your email and password.',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      mockUsersService.findByEmail.mockRejectedValue(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );

      await expect(service.signIn(email, password)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
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

    it('should successfully sign up a new user when the email is not registered', async () => {
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

      mockUsersService.findByEmail.mockRejectedValue(
        new ApiException({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: `User #${signUpDto.email} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
      mockUsersService.create.mockResolvedValue(createdUser);
      mockTokenService.generateToken.mockResolvedValue(expectedResponse);

      const result = await service.signUp(signUpDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.create).toHaveBeenCalledWith({
        ...signUpDto,
        role: Role.USER,
      });
    });

    it('should throw ConflictException when trying to sign up an already registered user', async () => {
      mockUsersService.findByEmail.mockResolvedValue({ id: 1 });

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.AUTH_USER_ALREADY_EXISTS,
          message:
            'This email address is already registered. Please use a different email or try to login.',
          statusCode: HttpStatus.CONFLICT,
        }),
      );
    });

    it('should throw ConflictException when trying to sign up a deleted user', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 1,
        deletedAt: new Date(),
      });

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.AUTH_USER_ALREADY_EXISTS,
          message:
            'This email address is already registered. Please use a different email or try to login.',
          statusCode: HttpStatus.CONFLICT,
        }),
      );
    });

    it('should throw InternalServerErrorException if a database error occurs while checking for user existence', async () => {
      mockUsersService.findByEmail.mockRejectedValue(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database error',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    });

    it('should throw InternalServerErrorException if an unexpected error occurs', async () => {
      mockUsersService.findByEmail.mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new Error('Unexpected error'),
      );
    });

    it('should throw InternalServerErrorException if user creation fails', async () => {
      mockUsersService.findByEmail.mockRejectedValue(
        new ApiException({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: `User #${signUpDto.email} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
      mockUsersService.create.mockRejectedValue(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );

      await expect(service.signUp(signUpDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    });
  });

  describe('refreshToken', () => {
    const token = 'refresh-token';
    const user: ITokenPayload = {
      sub: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: Role.USER,
    };

    const dbUser: User = {
      id: 1,
      email: 'test@example.com',
      name: 'Test User',
      role: Role.USER,
      password: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should refresh the access token', async () => {
      const expectedResponse: RefreshTokenResponseDto = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        user,
      };

      mockTokenService.verifyRefreshToken.mockResolvedValue(user);
      mockUsersService.findOne.mockResolvedValue(dbUser);
      mockTokenService.generateToken.mockResolvedValue(expectedResponse);

      const result = await service.refreshToken(token);
      console.log('result: ', result);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw an error when user is already deleted', async () => {
      mockTokenService.verifyRefreshToken.mockResolvedValue(user);
      mockUsersService.findOne.mockRejectedValue(
        new ApiException({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: `User #${dbUser.id} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );

      await expect(service.refreshToken(token)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: `User #${dbUser.id} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should throw an error if refresh token scope is invalid', async () => {
      mockTokenService.verifyRefreshToken.mockRejectedValue(
        new ApiException({
          code: ApiErrorCode.TOKEN_REFRESH_INVALID,
          message: 'Invalid refresh token scope',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );

      await expect(service.refreshToken(token)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.TOKEN_REFRESH_INVALID,
          message: 'Invalid refresh token scope',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });
    it('should throw an error if refresh token is expired', async () => {
      mockTokenService.verifyRefreshToken.mockRejectedValue(
        new ApiException({
          code: ApiErrorCode.TOKEN_EXPIRED,
          message: 'Refresh token expired',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );

      await expect(service.refreshToken(token)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.TOKEN_EXPIRED,
          message: 'Refresh token expired',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });
    it('should throw an error if refresh token is invalid', async () => {
      mockTokenService.verifyRefreshToken.mockRejectedValue(
        new ApiException({
          code: ApiErrorCode.TOKEN_INVALID,
          message: 'Invalid refresh token',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );

      await expect(service.refreshToken(token)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.TOKEN_INVALID,
          message: 'Invalid refresh token',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });
  });
});
