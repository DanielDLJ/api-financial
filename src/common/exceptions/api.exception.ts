import { ApiError } from '../interfaces/api-error.interface';

export class ApiException extends Error {
  constructor(public readonly error: ApiError) {
    super(error.message);
  }
}
