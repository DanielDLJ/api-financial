import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { ApiErrorCode } from '../enums/api-error-codes.enum';
import { ApiException } from '../exceptions/api.exception';
import { ITokenPayload } from '@/token/interface/token-payload.interface';

interface CustomRequest extends Request {
  user: ITokenPayload; // User payload
  params: any; // Route params
}

@Injectable()
export abstract class ResourceOwnerGuard implements CanActivate {
  abstract getResourceId(params: any): string | number;
  abstract getUserId(params: any): string | number;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { user, params } = context.switchToHttp().getRequest<CustomRequest>();

    // Admin can do everything
    if (user.role === Role.ADMIN) {
      return true;
    }

    const resourceId = this.getResourceId(params);
    const userId = this.getUserId(params);

    // Check if the user is trying to access their own resources
    if (userId !== user.sub.toString()) {
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

    return this.validateOwnership(user.sub, resourceId);
  }

  protected abstract validateOwnership(
    userId: number,
    resourceId: number | string,
  ): Promise<boolean>;
}
