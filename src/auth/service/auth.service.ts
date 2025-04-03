import { HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '@/users/service/users.service';
import { EncryptionService } from '@/encryption/service/encryption.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Role } from '@prisma/client';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { ApiException } from '@/common/exceptions/api.exception';
import { TokenService } from '@/token/service/token.service';
import { ITokenPayload } from '@/token/interface/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptionService: EncryptionService,
    private readonly tokenService: TokenService,
  ) {}

  async signIn(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email, true);

      // Check if user exists and isn't deleted
      if (!user || user.deletedAt) {
        throw new ApiException({
          code: ApiErrorCode.AUTH_USER_NOT_FOUND,
          message:
            'Authentication failed. Please check your email and password.',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      const isMatch = await this.encryptionService.compareHashPassword(
        password,
        user.password,
      );

      if (!isMatch) {
        throw new ApiException({
          code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
          message:
            'Authentication failed. Please check your email and password.',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      const payload: ITokenPayload = {
        sub: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      return this.tokenService.generateToken(payload);
    } catch (error) {
      // Handle specific "user not found" error from user service
      if (
        error instanceof ApiException &&
        error.error.code === ApiErrorCode.USER_NOT_FOUND
      ) {
        throw new ApiException({
          code: ApiErrorCode.AUTH_USER_NOT_FOUND,
          message:
            'Authentication failed. Please check your email and password.',
          statusCode: HttpStatus.UNAUTHORIZED,
        });
      }

      // Re-throw other errors
      throw error;
    }
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const userExists = await this.usersService.findByEmail(
        signUpDto.email,
        true,
      );

      if (userExists) {
        throw new ApiException({
          code: ApiErrorCode.AUTH_USER_ALREADY_EXISTS,
          message:
            'This email address is already registered. Please use a different email or try to login.',
          statusCode: HttpStatus.CONFLICT,
        });
      }
    } catch (error) {
      // Only allow "user not found" errors to continue
      if (
        !(error instanceof ApiException) ||
        !(
          error instanceof ApiException &&
          error.error.code === ApiErrorCode.USER_NOT_FOUND
        )
      ) {
        throw error;
      }
      // User not found is expected - proceed with registration
    }

    const createUserDto: CreateUserDto = {
      email: signUpDto.email,
      name: signUpDto.name,
      password: signUpDto.password,
      role: Role.USER, // Default role for new users
    };

    const user = await this.usersService.create(createUserDto);

    const payload: ITokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    return this.tokenService.generateToken(payload);
  }

  async refreshToken(token: string) {
    const payload = await this.tokenService.verifyRefreshToken(token);

    // Check if user still exists
    await this.usersService.findOne(payload.sub, false);

    return this.tokenService.generateToken(payload);
  }
}
