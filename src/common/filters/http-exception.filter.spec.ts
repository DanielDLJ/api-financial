import { HttpExceptionFilter } from './http-exception.filter';
import {
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ApiException } from '../exceptions/api.exception';
import { ApiErrorCode } from '../enums/api-error-codes.enum';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockGetResponse: jest.Mock;
  let mockHttpArgumentsHost: jest.Mock;
  let mockArgumentsHost: ArgumentsHost;

  beforeEach(() => {
    filter = new HttpExceptionFilter();
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
    mockHttpArgumentsHost = jest.fn().mockReturnValue({
      getResponse: mockGetResponse,
      getRequest: jest.fn(),
    });

    mockArgumentsHost = {
      switchToHttp: mockHttpArgumentsHost,
      getArgByIndex: jest.fn(),
      getArgs: jest.fn(),
      getType: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should handle ApiException', () => {
      const exception = new ApiException({
        code: ApiErrorCode.USER_NOT_FOUND,
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
        details: 'Additional details',
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockJson).toHaveBeenCalledWith({
        code: ApiErrorCode.USER_NOT_FOUND,
        message: 'User not found',
        details: 'Additional details',
      });
    });

    it('should handle ApiException without details', () => {
      const exception = new ApiException({
        code: ApiErrorCode.FORBIDDEN,
        message: 'Access denied',
        statusCode: HttpStatus.FORBIDDEN,
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockJson).toHaveBeenCalledWith({
        code: ApiErrorCode.FORBIDDEN,
        message: 'Access denied',
        details: undefined,
      });
    });

    it('should handle BadRequestException (validation errors)', () => {
      const exception = new BadRequestException({
        message: ['email must be a string', 'password must be a string'],
      });

      filter.catch(exception, mockArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: ['email must be a string', 'password must be a string'],
      });
    });

    it('should handle BadRequestException with string message', () => {
      const exception = new BadRequestException('Invalid input');

      filter.catch(exception, mockArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockJson).toHaveBeenCalledWith({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: 'Invalid input',
      });
    });

    it('should handle HttpException', () => {
      const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

      filter.catch(exception, mockArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
      expect(mockJson).toHaveBeenCalledWith({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Forbidden',
      });
    });

    it('should handle unknown errors', () => {
      const exception = new Error('Unknown error');

      filter.catch(exception, mockArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: 'Unknown error',
      });
    });

    it('should handle non-Error objects', () => {
      const exception = { random: 'object' };

      filter.catch(exception, mockArgumentsHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        details: undefined,
      });
    });
  });
});
