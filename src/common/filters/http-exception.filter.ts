import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
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

    if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as any;
      return response.status(HttpStatus.BAD_REQUEST).json({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: exceptionResponse.message,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return response.status(status).json({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: exception.message,
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: ApiErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      details: exception instanceof Error ? exception.message : undefined,
    });
  }
}
