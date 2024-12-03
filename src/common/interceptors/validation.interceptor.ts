import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorCode } from '../enums/api-error-codes.enum';
import { ApiException } from '../exceptions/api.exception';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof BadRequestException) {
          const response = error.getResponse() as any;
          throw new ApiException({
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Validation failed',
            details: Array.isArray(response.message)
              ? response.message
              : [response.message],
            statusCode: error.getStatus(),
          });
        }
        return throwError(() => error);
      }),
    );
  }
}
