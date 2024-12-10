import { Test, TestingModule } from '@nestjs/testing';
import { FlagsService } from './flags.service';
import { FlagsRepository } from '../repository/flags.repository';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { HttpStatus } from '@nestjs/common';
import { ListAllFlagsDto } from '../dto/list-all-flags.dto';

describe('FlagsService', () => {
  let service: FlagsService;

  const mockFlagsRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlagsService,
        {
          provide: FlagsRepository,
          useValue: mockFlagsRepository,
        },
      ],
    }).compile();

    service = module.get<FlagsService>(FlagsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated flags', async () => {
      const query: ListAllFlagsDto = { page: 1, limit: 10, showDeleted: false };
      const expectedResponse = {
        data: [{ id: 1, name: 'Test Flag' }],
        metaData: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockFlagsRepository.findAll.mockResolvedValue(expectedResponse);

      const result = await service.findAll(query);

      expect(result).toEqual(expectedResponse);
      expect(mockFlagsRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle database error', async () => {
      const query: ListAllFlagsDto = { page: 1, limit: 10, showDeleted: false };

      const error = new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockFlagsRepository.findAll.mockRejectedValue(error);

      await expect(service.findAll(query)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a flag by id', async () => {
      const flagId = 1;
      const expectedFlag = {
        id: flagId,
        name: 'Test Flag',
      };

      mockFlagsRepository.findOne.mockResolvedValue(expectedFlag);

      const result = await service.findOne(flagId);

      expect(result).toEqual(expectedFlag);
      expect(mockFlagsRepository.findOne).toHaveBeenCalledWith(flagId, false);
    });

    it('should handle flag not found error', async () => {
      const flagId = 999;

      mockFlagsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(flagId)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.FLAG_NOT_FOUND,
          message: `Flag #${flagId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should include deleted flags when showDeleted is true', async () => {
      const flagId = 1;
      const expectedFlag = {
        id: flagId,
        name: 'Test Flag',
        deletedAt: new Date(),
      };

      mockFlagsRepository.findOne.mockResolvedValue(expectedFlag);

      const result = await service.findOne(flagId, true);

      expect(result).toEqual(expectedFlag);
      expect(mockFlagsRepository.findOne).toHaveBeenCalledWith(flagId, true);
    });

    it('should handle database error', async () => {
      const flagId = 1;

      const error = new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockFlagsRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne(flagId)).rejects.toThrow(error);
    });
  });
});
