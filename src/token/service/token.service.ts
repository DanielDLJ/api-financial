import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ITokenPayload } from '../interface/token-payload.interface';
import { Scope } from '../enum/scope.enum';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { ApiException } from '@/common/exceptions/api.exception';
import { ITokenDecoded } from '../interface/token-decoded.interface';

@Injectable()
export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenSecret: string;
  private readonly refreshTokenExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Access Token
    this.accessTokenSecret =
      this.configService.getOrThrow<string>('jwt.access.secret');
    this.accessTokenExpiresIn = this.configService.getOrThrow<string>(
      'jwt.access.expiresIn',
    );

    // Refresh Token
    this.refreshTokenSecret =
      this.configService.getOrThrow<string>('jwt.refresh.secret');
    this.refreshTokenExpiresIn = this.configService.getOrThrow<string>(
      'jwt.refresh.expiresIn',
    );
  }

  async generateAccessToken(payload: ITokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        ...payload,
        scope: Scope.ACCESS,
      },
      {
        secret: this.accessTokenSecret,
        expiresIn: this.accessTokenExpiresIn,
      },
    );
  }

  async generateRefreshToken(payload: ITokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      {
        ...payload,
        scope: Scope.REFRESH,
      },
      {
        secret: this.refreshTokenSecret,
        expiresIn: this.refreshTokenExpiresIn,
      },
    );
  }

  async verifyAccessToken(token: string): Promise<ITokenDecoded> {
    try {
      const decoded = await this.jwtService.verifyAsync<ITokenDecoded>(token, {
        secret: this.accessTokenSecret,
      });

      if (decoded.scope !== Scope.ACCESS) {
        throw new ApiException({
          code: ApiErrorCode.TOKEN_ACCESS_INVALID,
          message: 'Invalid access token scope',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      return decoded;
    } catch (error) {
      if (error instanceof ApiException) throw error;

      const isExpired = error?.name === 'TokenExpiredError';
      throw new ApiException({
        code: isExpired
          ? ApiErrorCode.TOKEN_EXPIRED
          : ApiErrorCode.TOKEN_INVALID,
        message: isExpired ? 'Access token expired' : 'Invalid access token',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  async verifyRefreshToken(token: string): Promise<ITokenDecoded> {
    try {
      const decoded = await this.jwtService.verifyAsync<ITokenDecoded>(token, {
        secret: this.refreshTokenSecret,
      });

      if (decoded.scope !== Scope.REFRESH) {
        throw new ApiException({
          code: ApiErrorCode.TOKEN_REFRESH_INVALID,
          message: 'Invalid refresh token scope',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      return decoded;
    } catch (error) {
      if (error instanceof ApiException) throw error;

      const isExpired = error?.name === 'TokenExpiredError';
      throw new ApiException({
        code: isExpired
          ? ApiErrorCode.TOKEN_REFRESH_EXPIRED
          : ApiErrorCode.TOKEN_REFRESH_INVALID,
        message: isExpired ? 'Refresh token expired' : 'Invalid refresh token',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  async generateToken(payload: ITokenPayload | ITokenDecoded) {
    if (!payload)
      throw new ApiException({
        code: ApiErrorCode.TOKEN_INVALID,
        message: 'Invalid token payload',
        statusCode: HttpStatus.UNAUTHORIZED,
      });

    if ('scope' in payload) {
      delete payload.scope;
    }
    if ('iat' in payload) {
      delete payload.iat;
    }
    if ('exp' in payload) {
      delete payload.exp;
    }

    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: payload,
    };
  }

  decodeToken(token: string): ITokenPayload {
    try {
      const decoded = this.jwtService.decode(token);
      if (!decoded) {
        throw new Error('Token is invalid');
      }

      return decoded as ITokenPayload;
    } catch {
      throw new ApiException({
        code: ApiErrorCode.TOKEN_DECODE_ERROR,
        message: 'Failed to decode token',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }
}
