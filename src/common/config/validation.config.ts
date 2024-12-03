import { ValidationPipeOptions } from '@nestjs/common';

export const VALIDATION_PIPE_OPTIONS: ValidationPipeOptions = {
  forbidUnknownValues: true,
  forbidNonWhitelisted: true,
  whitelist: true,
};
