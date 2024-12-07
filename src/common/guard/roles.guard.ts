import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { ApiErrorCode } from '../enums/api-error-codes.enum';
import { ApiException } from '../exceptions/api.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ApiException({
        code: ApiErrorCode.FORBIDDEN,
        message: 'You need to be authenticated to access this resource',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    if (!requiredRoles.some((role) => user.role === role)) {
      throw new ApiException({
        code: ApiErrorCode.FORBIDDEN,
        message: 'You do not have permission to access this resource',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    return true;
  }
}
