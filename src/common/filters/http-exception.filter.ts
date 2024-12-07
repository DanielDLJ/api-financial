import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from '../exceptions/api.exception';
import { ApiErrorCode } from '../enums/api-error-codes.enum';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ApiException) {
      return response.status(exception.error.statusCode).json({
        code: exception.error.code,
        message: exception.error.message,
        details: exception.error.details,
      });
    }

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: ApiErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      details: exception instanceof Error ? exception.message : undefined,
    });
  }
}
