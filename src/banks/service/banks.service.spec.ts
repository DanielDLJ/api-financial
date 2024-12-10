import { Test, TestingModule } from '@nestjs/testing';
import { BanksService } from './banks.service';
import { BanksRepository } from '../repository/banks.repository';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { HttpStatus } from '@nestjs/common';
import { ListAllBanksDto } from '../dto/list-all-banks.dto';

describe('BanksService', () => {
  let service: BanksService;

  const mockBanksRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BanksService,
        {
          provide: BanksRepository,
          useValue: mockBanksRepository,
        },
      ],
    }).compile();

    service = module.get<BanksService>(BanksService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      mockBanksRepository.findAll.mockResolvedValue(expectedResponse);

      const result = await service.findAll(query);

      expect(result).toEqual(expectedResponse);
      expect(mockBanksRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle database error', async () => {
      const query: ListAllBanksDto = { page: 1, limit: 10, showDeleted: false };

      const error = new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockBanksRepository.findAll.mockRejectedValue(error);

      await expect(service.findAll(query)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a bank by id', async () => {
      const bankId = 1;
      const expectedBank = {
        id: bankId,
        name: 'Test Bank',
      };

      mockBanksRepository.findOne.mockResolvedValue(expectedBank);

      const result = await service.findOne(bankId);

      expect(result).toEqual(expectedBank);
      expect(mockBanksRepository.findOne).toHaveBeenCalledWith(bankId, false);
    });

    it('should handle bank not found error', async () => {
      const bankId = 999;

      mockBanksRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(bankId)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.BANK_NOT_FOUND,
          message: `Bank #${bankId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should include deleted banks when showDeleted is true', async () => {
      const bankId = 1;
      const expectedBank = {
        id: bankId,
        name: 'Test Bank',
        deletedAt: new Date(),
      };

      mockBanksRepository.findOne.mockResolvedValue(expectedBank);

      const result = await service.findOne(bankId, true);

      expect(result).toEqual(expectedBank);
      expect(mockBanksRepository.findOne).toHaveBeenCalledWith(bankId, true);
    });

    it('should handle database error', async () => {
      const bankId = 1;

      const error = new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockBanksRepository.findOne.mockRejectedValue(error);

      await expect(service.findOne(bankId)).rejects.toThrow(error);
    });
  });
});
