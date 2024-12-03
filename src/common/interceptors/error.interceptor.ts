import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiErrorCode, ApiException } from '../enums/api-error-codes.enum';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof ApiException) {
          return throwError(
            () =>
              new HttpException(
                {
                  code: error.error.code,
                  message: error.error.message,
                  details: error.error.details,
                },
                error.error.statusCode,
              ),
          );
        }

        if (error instanceof Error) {
          return throwError(
            () =>
              new HttpException(
                {
                  code: ApiErrorCode.INTERNAL_SERVER_ERROR,
                  message: 'An unexpected error occurred',
                  details: error.message,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
              ),
          );
        }

        return throwError(() => error);
      }),
    );
  }
}
