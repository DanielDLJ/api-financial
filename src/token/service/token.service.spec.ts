import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { Role } from '@prisma/client';
import { Scope } from '../enum/scope.enum';
import { ITokenPayload } from '../interface/token-payload.interface';
import { HttpStatus } from '@nestjs/common';

describe('TokenService', () => {
  let service: TokenService;

  const mockPayload: ITokenPayload = {
    sub: 1,
    email: 'test@example.com',
    name: 'Test User',
    role: Role.USER,
  };

  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      switch (key) {
        case 'jwt.access.secret':
          return 'access-secret';
        case 'jwt.access.expiresIn':
          return '1h';
        case 'jwt.refresh.secret':
          return 'refresh-secret';
        case 'jwt.refresh.expiresIn':
          return '7d';
        default:
          throw new Error(`Config ${key} not found`);
      }
    }),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
    decode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', async () => {
      const expectedToken = 'access-token';
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await service.generateAccessToken(mockPayload);

      expect(result).toBe(expectedToken);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { ...mockPayload, scope: Scope.ACCESS },
        {
          secret: 'access-secret',
          expiresIn: '1h',
        },
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', async () => {
      const expectedToken = 'refresh-token';
      mockJwtService.signAsync.mockResolvedValue(expectedToken);

      const result = await service.generateRefreshToken(mockPayload);

      expect(result).toBe(expectedToken);
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { ...mockPayload, scope: Scope.REFRESH },
        {
          secret: 'refresh-secret',
          expiresIn: '7d',
        },
      );
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', async () => {
      const decodedToken = { ...mockPayload, scope: Scope.ACCESS };
      mockJwtService.verifyAsync.mockResolvedValue(decodedToken);

      const result = await service.verifyAccessToken('valid-token');

      expect(result).toEqual(decodedToken);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
        secret: 'access-secret',
      });
    });

    it('should throw when token has invalid scope', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        ...mockPayload,
        scope: Scope.REFRESH,
      });

      await expect(
        service.verifyAccessToken('invalid-scope-token'),
      ).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.TOKEN_ACCESS_INVALID,
          message: 'Invalid access token scope',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });

    it('should throw when token is expired', async () => {
      mockJwtService.verifyAsync.mockRejectedValue({
        name: 'TokenExpiredError',
      });

      await expect(service.verifyAccessToken('expired-token')).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.TOKEN_EXPIRED,
          message: 'Access token expired',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });

    it('should throw when token is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(service.verifyAccessToken('invalid-token')).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.TOKEN_INVALID,
          message: 'Invalid access token',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', async () => {
      const decodedToken = { ...mockPayload, scope: Scope.REFRESH };
      mockJwtService.verifyAsync.mockResolvedValue(decodedToken);

      const result = await service.verifyRefreshToken('valid-token');

      expect(result).toEqual(decodedToken);
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
        secret: 'refresh-secret',
      });
    });

    it('should throw when refreshtoken has invalid scope', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        ...mockPayload,
        scope: Scope.ACCESS,
      });

      await expect(
        service.verifyRefreshToken('invalid-scope-token'),
      ).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.TOKEN_REFRESH_INVALID,
          message: 'Invalid refresh token scope',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });

    it('should throw when refreshtoken is expired', async () => {
      mockJwtService.verifyAsync.mockRejectedValue({
        name: 'TokenExpiredError',
      });

      await expect(service.verifyRefreshToken('expired-token')).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.TOKEN_EXPIRED,
          message: 'Refresh token expired',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });

    it('should throw when refresh token is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error());

      await expect(service.verifyRefreshToken('invalid-token')).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.TOKEN_INVALID,
          message: 'Invalid refresh token',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });
  });

  describe('generateToken', () => {
    it('should generate both access and refresh tokens', async () => {
      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      mockJwtService.signAsync
        .mockResolvedValueOnce(accessToken)
        .mockResolvedValueOnce(refreshToken);

      const result = await service.generateToken(mockPayload);

      expect(result).toEqual({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: mockPayload,
      });
    });
  });

  describe('decodeToken', () => {
    it('should decode a valid token', () => {
      const decodedToken = mockPayload;
      mockJwtService.decode.mockReturnValue(decodedToken);

      const result = service.decodeToken('valid-token');

      expect(result).toEqual(decodedToken);
      expect(mockJwtService.decode).toHaveBeenCalledWith('valid-token');
    });

    it('should throw when token cannot be decoded', () => {
      mockJwtService.decode.mockReturnValue(null);

      expect(() => service.decodeToken('invalid-token')).toThrow(
        new ApiException({
          code: ApiErrorCode.TOKEN_DECODE_ERROR,
          message: 'Failed to decode token',
          statusCode: HttpStatus.UNAUTHORIZED,
        }),
      );
    });
  });
});
