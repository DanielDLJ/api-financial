import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardsRepository } from './credit-cards.repository';
import { PrismaService } from '@/prisma/service/prisma.service';
import { CreateCreditCardDto } from '../dto/create-credit-card.dto';
import { UpdateCreditCardDto } from '../dto/update-credit-card.dto';
import { ListAllDto } from '@/common/dto/list-all.dto';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';

describe('CreditCardsRepository', () => {
  let repository: CreditCardsRepository;

  const mockPrismaService = {
    creditCard: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditCardsRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<CreditCardsRepository>(CreditCardsRepository);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const userId = 1;
    const createDto: CreateCreditCardDto = {
      cardName: 'Test Card',
      bankId: 1,
      flagId: 1,
      dueDate: 10,
      closingDate: 5,
      creditLimit: 1000,
    };

    it('should create a credit card successfully', async () => {
      const expectedResult = { id: 1, ...createDto, userId };
      mockPrismaService.creditCard.create.mockResolvedValue(expectedResult);

      const result = await repository.create(userId, createDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.creditCard.create).toHaveBeenCalledWith({
        data: {
          cardName: createDto.cardName,
          dueDate: createDto.dueDate,
          closingDate: createDto.closingDate,
          creditLimit: createDto.creditLimit,
          user: { connect: { id: userId } },
          bank: { connect: { id: createDto.bankId } },
          flag: { connect: { id: createDto.flagId } },
        },
        include: {
          bank: true,
          flag: true,
        },
      });
    });

    it('should throw when user not found', async () => {
      mockPrismaService.creditCard.create.mockRejectedValue({
        code: 'P2025',
        meta: { cause: 'User not found' },
      });

      await expect(repository.create(userId, createDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: `User #${userId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should throw when flag not found', async () => {
      mockPrismaService.creditCard.create.mockRejectedValue({
        code: 'P2025',
        meta: { cause: 'Flag not found' },
      });

      await expect(repository.create(userId, createDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.FLAG_NOT_FOUND,
          message: `Flag #${createDto.flagId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should throw when bank not found', async () => {
      mockPrismaService.creditCard.create.mockRejectedValue({
        code: 'P2025',
        meta: { cause: 'Bank not found' },
      });

      await expect(repository.create(userId, createDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.BANK_NOT_FOUND,
          message: `Bank #${createDto.bankId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should throw when card name already exists', async () => {
      mockPrismaService.creditCard.create.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['cardName'] },
      });

      await expect(repository.create(userId, createDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.CARD_NAME_ALREADY_EXISTS,
          message: 'Card name already exists for this user',
          statusCode: HttpStatus.CONFLICT,
        }),
      );
    });

    it('should handle database error', async () => {
      mockPrismaService.creditCard.create.mockRejectedValue(new Error());

      await expect(repository.create(userId, createDto)).rejects.toThrow(
        new InternalServerErrorException(
          'An unexpected error occurred while processing your request',
        ),
      );
    });
  });

  describe('findAll', () => {
    const userId = 1;
    const query: ListAllDto = { page: 1, limit: 10, showDeleted: false };

    it('should return paginated credit cards', async () => {
      const creditCards = [{ id: 1, cardName: 'Test Card' }];
      const total = 1;

      mockPrismaService.creditCard.findMany.mockResolvedValue(creditCards);
      mockPrismaService.creditCard.count.mockResolvedValue(total);

      const result = await repository.findAll(userId, query);

      expect(result).toEqual({
        data: creditCards,
        metaData: {
          page: query.page,
          limit: query.limit,
          total,
          totalPages: 1,
        },
      });
    });

    it('should include deleted cards when showDeleted is true', async () => {
      const queryWithDeleted = { ...query, showDeleted: true };
      await repository.findAll(userId, queryWithDeleted);

      expect(mockPrismaService.creditCard.findMany).toHaveBeenCalledWith({
        where: { userId },
        take: queryWithDeleted.limit,
        skip: 0,
        include: { bank: true, flag: true },
      });
    });

    it('should handle database error', async () => {
      mockPrismaService.creditCard.findMany.mockRejectedValue(new Error());

      await expect(repository.findAll(userId, query)).rejects.toThrow(
        new InternalServerErrorException('Error fetching credit cards'),
      );
    });
  });

  describe('findOne', () => {
    const userId = 1;
    const creditCardId = 1;

    it('should find a credit card', async () => {
      const expectedCard = { id: creditCardId, userId, cardName: 'Test Card' };
      mockPrismaService.creditCard.findUnique.mockResolvedValue(expectedCard);

      const result = await repository.findOne(creditCardId, userId, false);

      expect(result).toEqual(expectedCard);
      expect(mockPrismaService.creditCard.findUnique).toHaveBeenCalledWith({
        where: {
          id: creditCardId,
          userId,
          deletedAt: null,
        },
        include: {
          bank: true,
          flag: true,
        },
      });
    });

    it('should find a deleted credit card', async () => {
      const expectedCard = {
        id: creditCardId,
        userId,
        cardName: 'Test Card',
        deletedAt: new Date(),
      };
      mockPrismaService.creditCard.findUnique.mockResolvedValue(expectedCard);

      const result = await repository.findOne(creditCardId, userId, true);

      expect(result).toEqual(expectedCard);
      expect(mockPrismaService.creditCard.findUnique).toHaveBeenCalledWith({
        where: {
          id: creditCardId,
          userId,
        },
        include: { bank: true, flag: true },
      });
    });

    it('should handle database error', async () => {
      mockPrismaService.creditCard.findUnique.mockRejectedValue(new Error());

      await expect(repository.findOne(creditCardId, userId)).rejects.toThrow(
        new InternalServerErrorException('Error fetching credit card'),
      );
    });
  });

  describe('update', () => {
    const creditCardId = 1;
    const updateDto: UpdateCreditCardDto = {
      cardName: 'Updated Card',
      flagId: 1,
      bankId: 1,
      dueDate: 10,
      closingDate: 5,
      creditLimit: 1000,
    };

    it('should update a credit card', async () => {
      const expectedResult = { id: creditCardId, ...updateDto };
      mockPrismaService.creditCard.update.mockResolvedValue(expectedResult);

      const result = await repository.update(creditCardId, updateDto);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.creditCard.update).toHaveBeenCalledWith({
        where: { id: creditCardId },
        data: {
          cardName: updateDto.cardName,
          creditLimit: updateDto.creditLimit,
          closingDate: updateDto.closingDate,
          dueDate: updateDto.dueDate,
          flag: {
            connect: { id: updateDto.flagId },
          },
          bank: {
            connect: { id: updateDto.bankId },
          },
        },
        include: { bank: true, flag: true },
      });
    });

    it('should throw when flag not found', async () => {
      mockPrismaService.creditCard.update.mockRejectedValue({
        code: 'P2025',
        meta: { cause: 'Flag not found' },
      });

      await expect(repository.update(creditCardId, updateDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.FLAG_NOT_FOUND,
          message: `Flag #${updateDto.flagId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should throw when bank not found', async () => {
      mockPrismaService.creditCard.update.mockRejectedValue({
        code: 'P2025',
        meta: { cause: 'Bank not found' },
      });

      await expect(repository.update(creditCardId, updateDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.BANK_NOT_FOUND,
          message: `Bank #${updateDto.bankId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should handle card name already exists error', async () => {
      mockPrismaService.creditCard.update.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['cardName'] },
      });

      await expect(repository.update(creditCardId, updateDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.CARD_NAME_ALREADY_EXISTS,
          message: 'Card name already exists for this user',
          statusCode: HttpStatus.CONFLICT,
        }),
      );
    });

    it('should handle database error', async () => {
      mockPrismaService.creditCard.update.mockRejectedValue(new Error());

      await expect(repository.update(creditCardId, updateDto)).rejects.toThrow(
        new InternalServerErrorException(
          'An unexpected error occurred while processing your request',
        ),
      );
    });
  });

  describe('remove', () => {
    const creditCardId = 1;

    it('should soft delete a credit card', async () => {
      const expectedResult = {
        id: creditCardId,
        deletedAt: expect.any(Date),
      };
      mockPrismaService.creditCard.update.mockResolvedValue(expectedResult);

      const result = await repository.remove(creditCardId);

      expect(result).toEqual(expectedResult);
      expect(mockPrismaService.creditCard.update).toHaveBeenCalledWith({
        where: { id: creditCardId },
        data: { deletedAt: expect.any(Date) },
        include: { bank: true, flag: true },
      });
    });

    it('should throw when credit card not found', async () => {
      mockPrismaService.creditCard.update.mockRejectedValue({
        code: 'P2025',
      });

      await expect(repository.remove(creditCardId)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: `Credit card #${creditCardId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should handle database error', async () => {
      mockPrismaService.creditCard.update.mockRejectedValue(new Error());

      await expect(repository.remove(creditCardId)).rejects.toThrow(
        new InternalServerErrorException('Error removing credit card'),
      );
    });
  });
});
