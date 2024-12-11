import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardOwnerGuard } from './credit-card-owner.guard';
import { CreditCardsService } from '../service/credit-cards.service';
import { ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';

describe('CreditCardOwnerGuard', () => {
  let guard: CreditCardOwnerGuard;

  const mockCreditCardsService = {
    findOne: jest.fn(),
  };

  const mockExecutionContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
  } as any;

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
      const mockRequest = {
        user: { id: 1, role: Role.ADMIN },
        params: { userId: '1', creditCardId: '1' },
      };

      mockExecutionContext.getRequest.mockReturnValue(mockRequest);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockCreditCardsService.findOne).not.toHaveBeenCalled();
    });

    it('should allow access for resource owner', async () => {
      const userId = 1;
      const creditCardId = 1;
      const mockRequest = {
        user: { id: userId, role: Role.USER },
        params: {
          userId: userId.toString(),
          creditCardId: creditCardId.toString(),
        },
      };

      mockExecutionContext.getRequest.mockReturnValue(mockRequest);
      mockCreditCardsService.findOne.mockResolvedValue({
        id: creditCardId,
        userId,
      });

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockCreditCardsService.findOne).toHaveBeenCalledWith(
        userId,
        creditCardId,
        true,
      );
    });

    it('should deny access when user tries to access another user resource', async () => {
      const mockRequest = {
        user: { id: 1, role: Role.USER },
        params: { userId: '2', creditCardId: '1' },
      };

      mockExecutionContext.getRequest.mockReturnValue(mockRequest);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You can only access your own resources',
          statusCode: 403,
        }),
      );

      expect(mockCreditCardsService.findOne).not.toHaveBeenCalled();
    });

    it('should deny access when credit card not found', async () => {
      const userId = 1;
      const creditCardId = 999;
      const mockRequest = {
        user: { id: userId, role: Role.USER },
        params: {
          userId: userId.toString(),
          creditCardId: creditCardId.toString(),
        },
      };

      mockExecutionContext.getRequest.mockReturnValue(mockRequest);
      mockCreditCardsService.findOne.mockResolvedValue(null);

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: `Credit card #${creditCardId} not found`,
          statusCode: 404,
        }),
      );
    });

    it('should deny access when credit card belongs to another user', async () => {
      const userId = 1;
      const creditCardId = 1;
      const mockRequest = {
        user: { id: userId, role: Role.USER },
        params: {
          userId: userId.toString(),
          creditCardId: creditCardId.toString(),
        },
      };

      mockExecutionContext.getRequest.mockReturnValue(mockRequest);
      mockCreditCardsService.findOne.mockResolvedValue({
        id: creditCardId,
        userId: 2, // Different user
      });

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
    });

    it('should allow access for creation/listing (no resourceId)', async () => {
      const userId = 1;
      const mockRequest = {
        user: { id: userId, role: Role.USER },
        params: { userId: userId.toString() }, // No creditCardId
      };

      mockExecutionContext.getRequest.mockReturnValue(mockRequest);

      const result = await guard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
      expect(mockCreditCardsService.findOne).not.toHaveBeenCalled();
    });

    it('should handle service errors', async () => {
      const userId = 1;
      const creditCardId = 1;
      const mockRequest = {
        user: { id: userId, role: Role.USER },
        params: {
          userId: userId.toString(),
          creditCardId: creditCardId.toString(),
        },
      };

      mockExecutionContext.getRequest.mockReturnValue(mockRequest);
      mockCreditCardsService.findOne.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        'Service error',
      );
    });
  });

  describe('getResourceId', () => {
    it('should return creditCardId from params', () => {
      const params = { creditCardId: '123' };
      const result = guard.getResourceId(params);
      expect(result).toBe('123');
    });
  });

  describe('getUserId', () => {
    it('should return userId from params', () => {
      const params = { userId: '123' };
      const result = guard.getUserId(params);
      expect(result).toBe('123');
    });
  });
});
