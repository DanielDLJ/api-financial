import { Test, TestingModule } from '@nestjs/testing';
import { FlagsController } from './flags.controller';
import { FlagsService } from '../service/flags.service';
import { ListAllDto } from '@/common/dto/list-all.dto';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

describe('FlagsController', () => {
  let controller: FlagsController;

  const mockFlagsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlagsController],
      providers: [
        {
          provide: FlagsService,
          useValue: mockFlagsService,
        },
      ],
    }).compile();

    controller = module.get<FlagsController>(FlagsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated flags', async () => {
      const query: ListAllDto = { page: 1, limit: 10, showDeleted: false };
      const expectedResponse = {
        data: [{ id: 1, name: 'Test Flag' }],
        metaData: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockFlagsService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedResponse);
      expect(mockFlagsService.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle database error', async () => {
      const query: ListAllDto = { page: 1, limit: 10, showDeleted: false };

      const error = new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockFlagsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(query)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a flag by id', async () => {
      const flagId = '1';
      const expectedFlag = {
        id: 1,
        name: 'Test Flag',
      };

      mockFlagsService.findOne.mockResolvedValue(expectedFlag);

      const result = await controller.findOne(flagId);

      expect(result).toEqual(expectedFlag);
      expect(mockFlagsService.findOne).toHaveBeenCalledWith(+flagId);
    });

    it('should handle flag not found error', async () => {
      const flagId = '999';

      const error = new ApiException({
        code: ApiErrorCode.FLAG_NOT_FOUND,
        message: `Flag #${flagId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });

      mockFlagsService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(flagId)).rejects.toThrow(error);
    });
  });
});
