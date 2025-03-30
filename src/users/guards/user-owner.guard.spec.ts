import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { Role } from '@prisma/client';
import { UserOwnerGuard } from './user-owner.guard';

describe('CreditCardOwnerGuard', () => {
  let guard: UserOwnerGuard;

  const mockRequest = {
    params: {},
    user: null,
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnValue({
      getRequest: () => mockRequest,
    }),
    getHandler: jest.fn(),
    getClass: jest.fn(),
    getArgs: jest.fn(),
    getArgByIndex: jest.fn(),
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: jest.fn(),
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserOwnerGuard],
    }).compile();

    guard = module.get<UserOwnerGuard>(UserOwnerGuard);
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow access for admin users', async () => {
      mockRequest.user = { sub: 1, role: Role.ADMIN };
      mockRequest.params = { id: '1' };

      const result = await guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should allow access any resource for admin user', async () => {
      mockRequest.user = { sub: 1, role: Role.ADMIN };
      mockRequest.params = { id: '10' };

      const result = await guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should allow access for resource owner', async () => {
      const id = '1';
      mockRequest.user = { sub: 1, role: Role.USER };
      mockRequest.params = { id };

      const result = await guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should deny access when user tries to access another user resource', async () => {
      mockRequest.user = { sub: 10, role: Role.USER };
      mockRequest.params = { id: '20' };

      await expect(
        guard.canActivate(mockExecutionContext as ExecutionContext),
      ).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You can only access your own resources',
          statusCode: HttpStatus.FORBIDDEN,
        }),
      );
    });

    it('should allow access for creation/listing (no resourceId)', async () => {
      mockRequest.user = { sub: 1, role: Role.USER };
      mockRequest.params = { id: '1' };

      const result = await guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
    });
  });

  describe('getResourceId', () => {
    it('should return userId from params', () => {
      const id = '123';
      const params = { id };

      const result = guard.getResourceId(params);

      expect(result).toBe(id);
    });
  });

  describe('getUserId', () => {
    it('should return userId from params', () => {
      const id = '123';
      const params = { id };

      const result = guard.getUserId(params);

      expect(result).toBe(id);
    });
  });
});
