import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiException } from '../enums/api-error-codes.enum';

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
        return throwError(() => error);
      }),
    );
  }
}
