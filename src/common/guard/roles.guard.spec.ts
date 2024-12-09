import 'reflect-metadata';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { ApiErrorCode } from '../enums/api-error-codes.enum';
import { ApiException } from '../exceptions/api.exception';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);

    mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({}),
      }),
      getHandler: jest.fn(),
      getClass: jest.fn(),
      getType: jest.fn(),
      getArgs: jest.fn(),
      getArgByIndex: jest.fn(),
      switchToRpc: jest.fn(),
      switchToWs: jest.fn(),
    };
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when no roles are required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should throw when no user is present', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ApiException({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You need to be authenticated to access this resource',
          statusCode: HttpStatus.FORBIDDEN,
        }),
      );
    });

    it('should throw when user does not have required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
      const mockRequest = { user: { role: Role.USER } };
      jest
        .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
        .mockReturnValue(mockRequest);

      expect(() => guard.canActivate(mockExecutionContext)).toThrow(
        new ApiException({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You do not have permission to access this resource',
          statusCode: HttpStatus.FORBIDDEN,
        }),
      );
    });

    it('should return true when user has required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
      const mockRequest = { user: { role: Role.ADMIN } };
      jest
        .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
        .mockReturnValue(mockRequest);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has one of multiple required roles', () => {
      jest
        .spyOn(reflector, 'getAllAndOverride')
        .mockReturnValue([Role.ADMIN, Role.USER]);
      const mockRequest = { user: { role: Role.USER } };
      jest
        .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
        .mockReturnValue(mockRequest);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should get roles from both handler and class', () => {
      const getAllAndOverrideSpy = jest.spyOn(reflector, 'getAllAndOverride');
      const mockRequest = { user: { role: Role.ADMIN } };
      jest
        .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
        .mockReturnValue(mockRequest);

      getAllAndOverrideSpy.mockReturnValue([Role.ADMIN]);

      guard.canActivate(mockExecutionContext);

      expect(getAllAndOverrideSpy).toHaveBeenCalledWith(ROLES_KEY, [
        mockExecutionContext.getHandler(),
        mockExecutionContext.getClass(),
      ]);
    });

    it('should handle case-sensitive role comparison', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
      const mockRequest = { user: { role: 'ADMIN' } }; // String instead of enum
      jest
        .spyOn(mockExecutionContext.switchToHttp(), 'getRequest')
        .mockReturnValue(mockRequest);

      const result = guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });
  });
});
