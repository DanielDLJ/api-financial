import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, HttpStatus } from '@nestjs/common';
import { CreditCardOwnerGuard } from './credit-card-owner.guard';
import { CreditCardsService } from '../service/credit-cards.service';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { Role } from '@prisma/client';

describe('CreditCardOwnerGuard', () => {
  let guard: CreditCardOwnerGuard;

  const mockCreditCardsService = {
    findOne: jest.fn(),
  };

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
      providers: [
        CreditCardOwnerGuard,
        {
          provide: CreditCardsService,
          useValue: mockCreditCardsService,
        },
      ],
    }).compile();

    guard = module.get<CreditCardOwnerGuard>(CreditCardOwnerGuard);
    jest.clearAllMocks();
  });

  describe('canActivate', () => {
    it('should allow access for admin users', async () => {
      mockRequest.user = { sub: 1, role: Role.ADMIN };
      mockRequest.params = { creditCardId: '1', userId: '1' };

      const result = await guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should allow access any resource for admin user', async () => {
      mockRequest.user = { sub: 1, role: Role.ADMIN };
      mockRequest.params = { creditCardId: '1', userId: '10' };

      const result = await guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should allow access for resource owner', async () => {
      const userId = '1';
      mockRequest.user = { sub: 1, role: Role.USER };
      mockRequest.params = { creditCardId: '1', userId };

      mockCreditCardsService.findOne.mockResolvedValue({
        id: 1,
        userId: 1,
      });

      const result = await guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should deny access when user tries to access another user resource', async () => {
      mockRequest.user = { sub: 1, role: Role.USER };
      mockRequest.params = { creditCardId: '1', userId: '2' };

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

    it('should deny access when credit card not found', async () => {
      const creditCardId = '999';
      mockRequest.user = { sub: 1, role: Role.USER };
      mockRequest.params = { creditCardId, userId: '1' };

      mockCreditCardsService.findOne.mockResolvedValue(null);

      await expect(
        guard.canActivate(mockExecutionContext as ExecutionContext),
      ).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: `Credit card #${creditCardId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should deny access when credit card belongs to another user', async () => {
      const creditCardId = '1';
      mockRequest.user = { sub: 10, role: Role.USER };
      mockRequest.params = { creditCardId, userId: '10' };

      mockCreditCardsService.findOne.mockResolvedValue({
        id: +creditCardId,
        userId: 30, // Different user
      });

      const result = await guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(false);
    });

    it('should allow access for creation/listing (no resourceId)', async () => {
      mockRequest.user = { sub: 1, role: Role.USER };
      mockRequest.params = { userId: '1' };

      const result = await guard.canActivate(
        mockExecutionContext as ExecutionContext,
      );

      expect(result).toBe(true);
    });

    it('should handle service errors', async () => {
      mockRequest.user = { sub: 1, role: Role.USER };
      mockRequest.params = { creditCardId: '1', userId: '1' };

      mockCreditCardsService.findOne.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(
        guard.canActivate(mockExecutionContext as ExecutionContext),
      ).rejects.toThrow('Service error');
    });
  });

  describe('getResourceId', () => {
    it('should return creditCardId from params', () => {
      const creditCardId = '123';
      const params = { creditCardId };

      const result = guard.getResourceId(params);

      expect(result).toBe(creditCardId);
    });
  });

  describe('getUserId', () => {
    it('should return userId from params', () => {
      const userId = '123';
      const params = { userId };

      const result = guard.getUserId(params);

      expect(result).toBe(userId);
    });
  });
});
