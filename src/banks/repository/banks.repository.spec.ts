import { Test, TestingModule } from '@nestjs/testing';
import { BanksRepository } from './banks.repository';
import { PrismaService } from '@/prisma/service/prisma.service';
import { ListAllBanksDto } from '../dto/list-all-banks.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('BanksRepository', () => {
  let repository: BanksRepository;

  const mockPrismaService = {
    bank: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BanksRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<BanksRepository>(BanksRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated banks', async () => {
      const query: ListAllBanksDto = {
        page: 1,
        limit: 10,
        name: 'Test Bank',
        fullName: 'Test Bank',
        code: 123,
        showDeleted: false,
      };
      const banks = [
        { id: 1, name: 'Test Bank', fullName: 'Test Bank', code: 123 },
      ];
      const total = 1;

      mockPrismaService.bank.findMany.mockResolvedValue(banks);
      mockPrismaService.bank.count.mockResolvedValue(total);

      const result = await repository.findAll(query);

      expect(result.data).toEqual(banks);
      expect(result.metaData).toEqual({
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      });
      expect(mockPrismaService.bank.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: query.name },
          fullName: { contains: query.fullName },
          code: query.code,
          deletedAt: null,
        },
        take: query.limit,
        skip: 0,
      });
    });

    it('should handle showDeleted flag', async () => {
      const query: ListAllBanksDto = { page: 1, limit: 10, showDeleted: true };

      await repository.findAll(query);

      expect(mockPrismaService.bank.findMany).toHaveBeenCalledWith({
        where: {},
        take: query.limit,
        skip: 0,
      });
    });

    it('should exclude deleted banks by default', async () => {
      const query: ListAllBanksDto = { page: 1, limit: 10, showDeleted: false };

      await repository.findAll(query);

      expect(mockPrismaService.bank.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        take: query.limit,
        skip: 0,
      });
    });

    it('should handle pagination correctly', async () => {
      const query: ListAllBanksDto = { page: 2, limit: 5, showDeleted: false };

      await repository.findAll(query);

      expect(mockPrismaService.bank.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        take: query.limit,
        skip: 5, // (page - 1) * limit
      });
    });

    it('should handle database error', async () => {
      const query: ListAllBanksDto = { page: 1, limit: 10, showDeleted: false };

      mockPrismaService.bank.findMany.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(repository.findAll(query)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a bank by id', async () => {
      const bankId = 1;
      const expectedBank = { id: bankId, name: 'Test Bank' };

      mockPrismaService.bank.findUnique.mockResolvedValue(expectedBank);

      const result = await repository.findOne(bankId);

      expect(result).toEqual(expectedBank);
      expect(mockPrismaService.bank.findUnique).toHaveBeenCalledWith({
        where: { id: bankId, deletedAt: null },
      });
    });

    it('should include deleted banks when showDeleted is true', async () => {
      const bankId = 1;
      const deletedBank = {
        id: bankId,
        name: 'Test Bank',
        deletedAt: new Date(),
      };

      mockPrismaService.bank.findUnique.mockResolvedValue(deletedBank);

      const result = await repository.findOne(bankId, true);

      expect(result).toEqual(deletedBank);
      expect(mockPrismaService.bank.findUnique).toHaveBeenCalledWith({
        where: { id: bankId },
      });
    });

    it('should return null when bank not found', async () => {
      const bankId = 999;

      mockPrismaService.bank.findUnique.mockResolvedValue(null);

      const result = await repository.findOne(bankId);

      expect(result).toBeNull();
    });

    it('should handle database error', async () => {
      const bankId = 1;

      mockPrismaService.bank.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(repository.findOne(bankId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
