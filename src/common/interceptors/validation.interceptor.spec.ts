import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { ValidationInterceptor } from './validation.interceptor';
import { ApiErrorCode, ApiException } from '../enums/api-error-codes.enum';
import { of, throwError } from 'rxjs';

describe('ValidationInterceptor', () => {
  let interceptor: ValidationInterceptor;
  let mockExecutionContext: ExecutionContext;
  let mockCallHandler: CallHandler;

  beforeEach(() => {
    interceptor = new ValidationInterceptor();
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
    it('should transform BadRequestException into ApiException', (done) => {
      const validationError = new BadRequestException({
        message: ['email must be a string', 'password must be a string'],
      });

      mockCallHandler = {
        handle: () => throwError(() => validationError),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ApiException);
          expect(error.error).toEqual({
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Validation failed',
            details: ['email must be a string', 'password must be a string'],
            statusCode: 400,
          });
          done();
        },
      });
    });

    it('should handle single message BadRequestException', (done) => {
      const validationError = new BadRequestException('Single error message');

      mockCallHandler = {
        handle: () => throwError(() => validationError),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ApiException);
          expect(error.error).toEqual({
            code: ApiErrorCode.VALIDATION_ERROR,
            message: 'Validation failed',
            details: ['Single error message'],
            statusCode: 400,
          });
          done();
        },
      });
    });

    it('should pass through non-BadRequestException errors', (done) => {
      const otherError = new Error('Some other error');

      mockCallHandler = {
        handle: () => throwError(() => otherError),
      };

      interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
        error: (error) => {
          expect(error).toBe(otherError);
          expect(error).not.toBeInstanceOf(ApiException);
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
