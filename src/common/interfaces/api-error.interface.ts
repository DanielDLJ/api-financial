import { ApiErrorCode } from '../enums/api-error-codes.enum';

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: any;
  statusCode: number;
}
