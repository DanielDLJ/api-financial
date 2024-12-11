import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Type,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ApiErrorCode } from '../enums/api-error-codes.enum';
import { ApiException } from '../exceptions/api.exception';

@Injectable()
export abstract class ResourceOwnerGuard implements CanActivate {
  abstract getResourceId(params: any): string | number;
  abstract getUserId(params: any): string | number;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest();

    // Admin can do everything
    if (user.role === Role.ADMIN) {
      return true;
    }

    const resourceId = this.getResourceId(params);
    const userId = this.getUserId(params);

    // Check if the user is trying to access their own resources
    if (userId !== user.id.toString()) {
      throw new ApiException({
        code: ApiErrorCode.FORBIDDEN,
        message: 'You can only access your own resources',
        statusCode: HttpStatus.FORBIDDEN,
      });
    }

    // If there is no resource ID, allow (it can be a listing or creation)
    if (!resourceId) {
      return true;
    }

    return this.validateOwnership(user.id, resourceId);
  }

  protected abstract validateOwnership(
    userId: number,
    resourceId: number | string,
  ): Promise<boolean>;
}
