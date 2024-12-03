export enum ApiErrorCode {
  // Auth errors - 4xx
  AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
  AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND',
  AUTH_USER_ALREADY_EXISTS = 'AUTH_USER_ALREADY_EXISTS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // Server errors - 5xx
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'SERVER_002',
}

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: any;
  statusCode: number;
}

export class ApiException extends Error {
  constructor(public readonly error: ApiError) {
    super(error.message);
  }
}
