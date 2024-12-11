import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { CreditCardsController } from './credit-cards.controller';
import { CreditCardsService } from '../service/credit-cards.service';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { HttpStatus } from '@nestjs/common';
import { CreateCreditCardDto } from '../dto/create-credit-card.dto';
import { UpdateCreditCardDto } from '../dto/update-credit-card.dto';
import { ListAllDto } from '@/common/dto/list-all.dto';

describe('CreditCardsController', () => {
  let controller: CreditCardsController;

  const mockCreditCardsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditCardsController],
      providers: [
        {
          provide: CreditCardsService,
          useValue: mockCreditCardsService,
        },
      ],
    }).compile();

    controller = module.get<CreditCardsController>(CreditCardsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a credit card', async () => {
      const userId = '1';
      const createCreditCardDto: CreateCreditCardDto = {
        cardName: 'Test Card',
        bankId: 1,
        flagId: 1,
        dueDate: 10,
        closingDate: 10,
        creditLimit: 1000,
      };
      const expectedCard = { id: 1, ...createCreditCardDto, userId: 1 };

      mockCreditCardsService.create.mockResolvedValue(expectedCard);

      const result = await controller.create(userId, createCreditCardDto);

      expect(result).toEqual(expectedCard);
      expect(mockCreditCardsService.create).toHaveBeenCalledWith(
        +userId,
        createCreditCardDto,
      );
    });

    it('should handle database error', async () => {
      const userId = '1';
      const createCreditCardDto: CreateCreditCardDto = {
        cardName: 'Test Card',
        bankId: 1,
        flagId: 1,
        dueDate: 10,
        closingDate: 10,
        creditLimit: 1000,
      };

      const error = new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockCreditCardsService.create.mockRejectedValue(error);

      await expect(
        controller.create(userId, createCreditCardDto),
      ).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return paginated credit cards', async () => {
      const userId = '1';
      const query: ListAllDto = { page: 1, limit: 10, showDeleted: false };
      const expectedResponse = {
        data: [{ id: 1, cardName: 'Test Card' }],
        metaData: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockCreditCardsService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(userId, query);

      expect(result).toEqual(expectedResponse);
      expect(mockCreditCardsService.findAll).toHaveBeenCalledWith(
        +userId,
        query,
      );
    });

    it('should handle database error', async () => {
      const userId = '1';
      const query: ListAllDto = { page: 1, limit: 10, showDeleted: false };

      const error = new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockCreditCardsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(userId, query)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a credit card by id', async () => {
      const userId = '1';
      const creditCardId = '1';
      const query = { showDeleted: false };
      const expectedCard = {
        id: 1,
        cardName: 'Test Card',
        userId: 1,
      };

      mockCreditCardsService.findOne.mockResolvedValue(expectedCard);

      const result = await controller.findOne(userId, creditCardId, query);

      expect(result).toEqual(expectedCard);
      expect(mockCreditCardsService.findOne).toHaveBeenCalledWith(
        +userId,
        +creditCardId,
        query.showDeleted,
      );
    });

    it('should handle credit card not found error', async () => {
      const userId = '1';
      const creditCardId = '999';
      const query = { showDeleted: false };

      const error = new ApiException({
        code: ApiErrorCode.NOT_FOUND,
        message: `Credit card #${creditCardId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });

      mockCreditCardsService.findOne.mockRejectedValue(error);

      await expect(
        controller.findOne(userId, creditCardId, query),
      ).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('should update a credit card', async () => {
      const userId = '1';
      const creditCardId = '1';
      const updateCreditCardDto: UpdateCreditCardDto = {
        cardName: 'Updated Card',
      };
      const expectedCard = {
        id: 1,
        cardName: 'Updated Card',
        userId: 1,
      };

      mockCreditCardsService.update.mockResolvedValue(expectedCard);

      const result = await controller.update(
        userId,
        creditCardId,
        updateCreditCardDto,
      );

      expect(result).toEqual(expectedCard);
      expect(mockCreditCardsService.update).toHaveBeenCalledWith(
        +userId,
        +creditCardId,
        updateCreditCardDto,
      );
    });

    it('should handle database error', async () => {
      const userId = '1';
      const creditCardId = '1';
      const updateCreditCardDto: UpdateCreditCardDto = {
        cardName: 'Updated Card',
      };

      const error = new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockCreditCardsService.update.mockRejectedValue(error);

      await expect(
        controller.update(userId, creditCardId, updateCreditCardDto),
      ).rejects.toThrow(error);
    });
  });

  describe('remove', () => {
    it('should remove a credit card', async () => {
      const userId = '1';
      const creditCardId = '1';
      const expectedResponse = {
        id: 1,
        deletedAt: new Date(),
      };

      mockCreditCardsService.remove.mockResolvedValue(expectedResponse);

      const result = await controller.remove(userId, creditCardId);

      expect(result).toEqual(expectedResponse);
      expect(mockCreditCardsService.remove).toHaveBeenCalledWith(
        +userId,
        +creditCardId,
      );
    });

    it('should handle database error', async () => {
      const userId = '1';
      const creditCardId = '1';

      const error = new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockCreditCardsService.remove.mockRejectedValue(error);

      await expect(controller.remove(userId, creditCardId)).rejects.toThrow(
        error,
      );
    });
  });

  describe('Swagger and Decorators', () => {
    it('should have ApiTags decorator', () => {
      const controllerMetadata = Reflect.getMetadata(
        'swagger/apiUseTags',
        CreditCardsController,
      );
      expect(controllerMetadata).toEqual(['credit-cards']);
    });

    it('should have Roles decorator on create method', () => {
      const rolesMetadata = Reflect.getMetadata(ROLES_KEY, controller.create);
      expect(rolesMetadata).toEqual([Role.ADMIN, Role.USER]);
    });

    it('should have Roles decorator on findAll method', () => {
      const rolesMetadata = Reflect.getMetadata(ROLES_KEY, controller.findAll);
      expect(rolesMetadata).toEqual([Role.ADMIN, Role.USER]);
    });

    it('should have Roles decorator on findOne method', () => {
      const rolesMetadata = Reflect.getMetadata(ROLES_KEY, controller.findOne);
      expect(rolesMetadata).toEqual([Role.ADMIN, Role.USER]);
    });

    it('should have Roles decorator on update method', () => {
      const rolesMetadata = Reflect.getMetadata(ROLES_KEY, controller.update);
      expect(rolesMetadata).toEqual([Role.ADMIN, Role.USER]);
    });

    it('should have Roles decorator on remove method', () => {
      const rolesMetadata = Reflect.getMetadata(ROLES_KEY, controller.remove);
      expect(rolesMetadata).toEqual([Role.ADMIN, Role.USER]);
    });

    it('should have UseGuards decorator on protected routes', () => {
      const guardMetadata = Reflect.getMetadata(
        '__guards__',
        controller.findOne,
      );
      expect(guardMetadata).toBeDefined();
    });
  });
});
