import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenService } from '@/token/service/token.service';
import { ApiException } from '../exceptions/api.exception';
import { ApiErrorCode } from '../enums/api-error-codes.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If the route is public, we allow access
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // If no token is provided, we deny access
    if (!token) {
      throw new ApiException({
        code: ApiErrorCode.TOKEN_INVALID,
        message: 'No token provided',
        statusCode: 401,
      });
    }

    try {
      // Validate token and get user payload
      const payload = await this.tokenService.verifyAccessToken(token);

      // Attach user payload to request object
      // so that we can access it in our route handlers
      request['user'] = payload;

      return true;
    } catch (error) {
      // If the token is invalid, we deny access
      if (error instanceof ApiException) {
        throw error;
      }

      throw new ApiException({
        code: ApiErrorCode.TOKEN_INVALID,
        message: 'Invalid token',
        statusCode: HttpStatus.UNAUTHORIZED,
      });
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
