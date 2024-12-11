import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardsService } from './credit-cards.service';
import { CreditCardsRepository } from '../repository/credit-cards.repository';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { HttpStatus } from '@nestjs/common';
import { CreateCreditCardDto } from '../dto/create-credit-card.dto';
import { UpdateCreditCardDto } from '../dto/update-credit-card.dto';
import { ListAllDto } from '@/common/dto/list-all.dto';

describe('CreditCardsService', () => {
  let service: CreditCardsService;

  const mockCreditCardsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreditCardsService,
        {
          provide: CreditCardsRepository,
          useValue: mockCreditCardsRepository,
        },
      ],
    }).compile();

    service = module.get<CreditCardsService>(CreditCardsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userId = 1;
    const createCreditCardDto: CreateCreditCardDto = {
      cardName: 'Test Card',
      bankId: 1,
      flagId: 1,
      dueDate: 10,
      closingDate: 10,
      creditLimit: 1000,
    };

    it('should create a credit card', async () => {
      const expectedCard = { id: 1, ...createCreditCardDto, userId };

      mockCreditCardsRepository.create.mockResolvedValue(expectedCard);

      const result = await service.create(userId, createCreditCardDto);

      expect(result).toEqual(expectedCard);
      expect(mockCreditCardsRepository.create).toHaveBeenCalledWith(
        userId,
        createCreditCardDto,
      );
    });

    it('should throw database error', async () => {
      const error = new ApiException({
        code: ApiErrorCode.DATABASE_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockCreditCardsRepository.create.mockRejectedValue(error);

      await expect(service.create(userId, createCreditCardDto)).rejects.toThrow(
        error,
      );
    });
  });

  describe('findAll', () => {
    const userId = 1;
    const query: ListAllDto = { page: 1, limit: 10, showDeleted: false };

    it('should return paginated credit cards', async () => {
      const expectedResponse = {
        data: [{ id: 1, cardName: 'Test Card' }],
        metaData: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockCreditCardsRepository.findAll.mockResolvedValue(expectedResponse);

      const result = await service.findAll(userId, query);

      expect(result).toEqual(expectedResponse);
      expect(mockCreditCardsRepository.findAll).toHaveBeenCalledWith(
        userId,
        query,
      );
    });

    it('should throw database error', async () => {
      const error = new ApiException({
        code: ApiErrorCode.DATABASE_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockCreditCardsRepository.findAll.mockRejectedValue(error);

      await expect(service.findAll(userId, query)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    const userId = 1;
    const creditCardId = 1;

    it('should return a credit card', async () => {
      const expectedCard = {
        id: creditCardId,
        cardName: 'Test Card',
        userId,
      };

      mockCreditCardsRepository.findOne.mockResolvedValue(expectedCard);

      const result = await service.findOne(userId, creditCardId, false);

      expect(result).toEqual(expectedCard);
      expect(mockCreditCardsRepository.findOne).toHaveBeenCalledWith(
        creditCardId,
        userId,
        false,
      );
    });

    it('should throw if credit card not found', async () => {
      mockCreditCardsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.findOne(userId, creditCardId, false),
      ).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: `Credit card #${creditCardId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should throw database error', async () => {
      const error = new ApiException({
        code: ApiErrorCode.DATABASE_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockCreditCardsRepository.findOne.mockRejectedValue(error);

      await expect(
        service.findOne(userId, creditCardId, false),
      ).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    const userId = 1;
    const creditCardId = 1;
    const updateCreditCardDto: UpdateCreditCardDto = {
      cardName: 'Updated Card',
    };

    it('should update a credit card', async () => {
      const expectedCard = {
        id: creditCardId,
        ...updateCreditCardDto,
        userId,
      };

      mockCreditCardsRepository.findOne.mockResolvedValue({
        id: creditCardId,
        userId,
      });
      mockCreditCardsRepository.update.mockResolvedValue(expectedCard);

      const result = await service.update(
        userId,
        creditCardId,
        updateCreditCardDto,
      );

      expect(result).toEqual(expectedCard);
      expect(mockCreditCardsRepository.update).toHaveBeenCalledWith(
        creditCardId,
        updateCreditCardDto,
      );
    });

    it('should throw if credit card not found', async () => {
      mockCreditCardsRepository.findOne.mockResolvedValue({
        id: creditCardId,
        userId,
      });
      mockCreditCardsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(userId, creditCardId, updateCreditCardDto),
      ).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: `Credit card #${creditCardId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should throw database error', async () => {
      const error = new ApiException({
        code: ApiErrorCode.DATABASE_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockCreditCardsRepository.findOne.mockResolvedValue({
        id: creditCardId,
        userId,
      });
      mockCreditCardsRepository.update.mockRejectedValue(error);

      await expect(
        service.update(userId, creditCardId, updateCreditCardDto),
      ).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    const userId = 1;
    const creditCardId = 1;

    it('should remove a credit card', async () => {
      const expectedResponse = {
        id: creditCardId,
        deletedAt: new Date(),
      };

      mockCreditCardsRepository.findOne.mockResolvedValue({
        id: creditCardId,
        userId,
      });
      mockCreditCardsRepository.remove.mockResolvedValue(expectedResponse);

      const result = await service.remove(userId, creditCardId);

      expect(result).toEqual(expectedResponse);
      expect(mockCreditCardsRepository.remove).toHaveBeenCalledWith(
        creditCardId,
      );
    });

    it('should throw if credit card not found', async () => {
      mockCreditCardsRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(userId, creditCardId)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: `Credit card #${creditCardId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
      expect(mockCreditCardsRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw database error', async () => {
      const error = new ApiException({
        code: ApiErrorCode.DATABASE_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockCreditCardsRepository.findOne.mockResolvedValue({
        id: creditCardId,
        userId,
      });
      mockCreditCardsRepository.remove.mockRejectedValue(error);

      await expect(service.remove(userId, creditCardId)).rejects.toThrow(error);
    });
  });
});
