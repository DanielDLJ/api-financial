import { CallHandler, ExecutionContext, HttpException } from '@nestjs/common';
import { ErrorInterceptor } from './error.interceptor';
import { ApiErrorCode } from '../enums/api-error-codes.enum';
import { of, throwError } from 'rxjs';
import { ApiException } from '../exceptions/api.exception';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new ErrorInterceptor();
    mockExecutionContext = {
      switchToHttp: jest.fn(),
      getClass: jest.fn(),
      getHandler: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
      getType: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should transform ApiException into HttpException', (done) => {
      const apiError = {
        code: ApiErrorCode.AUTH_USER_NOT_FOUND,
        message: 'User not found',
        details: 'Additional details',
        statusCode: 404,
      };

      const apiException = new ApiException(apiError);

      mockCallHandler = {
        handle: () => throwError(() => apiException),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error: HttpException) => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(404);
          expect(error.getResponse()).toEqual({
            code: ApiErrorCode.AUTH_USER_NOT_FOUND,
            message: 'User not found',
            details: 'Additional details',
          });
          done();
        },
      });
    });

    it('should transform Error into INTERNAL_SERVER_ERROR', (done) => {
      const error = new Error('Some other error');

      mockCallHandler = {
        handle: () => throwError(() => error),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error: HttpException) => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(500);
          expect(error.getResponse()).toEqual({
            code: ApiErrorCode.INTERNAL_SERVER_ERROR,
            message: 'An unexpected error occurred',
            details: 'Some other error',
          });
          done();
        },
      });
    });

    it('should handle ApiException without details', (done) => {
      const apiError = {
        code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
        message: 'Invalid credentials',
        statusCode: 401,
      };

      const apiException = new ApiException(apiError);

      mockCallHandler = {
        handle: () => throwError(() => apiException),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error: HttpException) => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.getStatus()).toBe(401);
          expect(error.getResponse()).toEqual({
            code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
            message: 'Invalid credentials',
          });
          done();
        },
      });
    });

    it('should pass through successful responses', (done) => {
      const response = { success: true };

      mockCallHandler = {
        handle: () => of(response),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        next: (value) => {
          expect(value).toBe(response);
          done();
        },
      });
    });
  });
});
