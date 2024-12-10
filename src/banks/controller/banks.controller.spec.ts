import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { BanksController } from './banks.controller';
import { BanksService } from '../service/banks.service';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { HttpStatus } from '@nestjs/common';
import { ListAllBanksDto } from '../dto/list-all-banks.dto';

describe('BanksController', () => {
  let controller: BanksController;

  const mockBanksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BanksController],
      providers: [
        {
          provide: BanksService,
          useValue: mockBanksService,
        },
      ],
    }).compile();

    controller = module.get<BanksController>(BanksController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated banks', async () => {
      const query: ListAllBanksDto = { page: 1, limit: 10, showDeleted: false };
      const expectedResponse = {
        data: [{ id: 1, name: 'Test Bank' }],
        metaData: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockBanksService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedResponse);
      expect(mockBanksService.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle database error', async () => {
      const query: ListAllBanksDto = { page: 1, limit: 10, showDeleted: false };

      const error = new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockBanksService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(query)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a bank by id', async () => {
      const bankId = '1';
      const expectedBank = {
        id: 1,
        name: 'Test Bank',
      };

      mockBanksService.findOne.mockResolvedValue(expectedBank);

      const result = await controller.findOne(bankId);

      expect(result).toEqual(expectedBank);
      expect(mockBanksService.findOne).toHaveBeenCalledWith(+bankId);
    });

    it('should handle bank not found error', async () => {
      const bankId = '999';

      const error = new ApiException({
        code: ApiErrorCode.NOT_FOUND,
        message: `Bank #${bankId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });

      mockBanksService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(bankId)).rejects.toThrow(error);
    });
  });

  describe('Swagger and Decorators', () => {
    it('should have ApiTags decorator', () => {
      const controllerMetadata = Reflect.getMetadata(
        'swagger/apiUseTags',
        BanksController,
      );
      expect(controllerMetadata).toEqual(['banks']);
    });

    it('should have Roles decorator on findAll method', () => {
      const rolesMetadata = Reflect.getMetadata(ROLES_KEY, controller.findAll);
      expect(rolesMetadata).toEqual([Role.ADMIN, Role.USER]);
    });

    it('should have Roles decorator on findOne method', () => {
      const rolesMetadata = Reflect.getMetadata(ROLES_KEY, controller.findOne);
      expect(rolesMetadata).toEqual([Role.ADMIN, Role.USER]);
    });
  });
});
