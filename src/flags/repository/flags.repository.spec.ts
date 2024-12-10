import { Test, TestingModule } from '@nestjs/testing';
import { FlagsRepository } from './flags.repository';
import { PrismaService } from '@/prisma/service/prisma.service';
import { ListAllFlagsDto } from '../dto/list-all-flags.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('FlagsRepository', () => {
  let repository: FlagsRepository;

  const mockPrismaService = {
    flag: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlagsRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<FlagsRepository>(FlagsRepository);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated flags', async () => {
      const query: ListAllFlagsDto = {
        page: 1,
        limit: 10,
        name: 'Test Flag',
        showDeleted: false,
      };
      const flags = [{ id: 1, name: 'Test Flag' }];
      const total = 1;

      mockPrismaService.flag.findMany.mockResolvedValue(flags);
      mockPrismaService.flag.count.mockResolvedValue(total);

      const result = await repository.findAll(query);

      expect(result.data).toEqual(flags);
      expect(result.metaData).toEqual({
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      });
      expect(mockPrismaService.flag.findMany).toHaveBeenCalledWith({
        where: {
          name: { contains: query.name },
          deletedAt: null,
        },
        take: query.limit,
        skip: 0,
      });
    });

    it('should handle showDeleted flag', async () => {
      const query: ListAllFlagsDto = { page: 1, limit: 10, showDeleted: true };

      await repository.findAll(query);

      expect(mockPrismaService.flag.findMany).toHaveBeenCalledWith({
        where: {},
        take: query.limit,
        skip: 0,
      });
    });

    it('should exclude deleted flags by default', async () => {
      const query: ListAllFlagsDto = { page: 1, limit: 10, showDeleted: false };

      await repository.findAll(query);

      expect(mockPrismaService.flag.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        take: query.limit,
        skip: 0,
      });
    });

    it('should handle pagination correctly', async () => {
      const query: ListAllFlagsDto = { page: 2, limit: 5, showDeleted: false };

      await repository.findAll(query);

      expect(mockPrismaService.flag.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        take: query.limit,
        skip: 5, // (page - 1) * limit
      });
    });

    it('should handle database error', async () => {
      const query: ListAllFlagsDto = { page: 1, limit: 10, showDeleted: false };

      mockPrismaService.flag.findMany.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(repository.findAll(query)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a flag by id', async () => {
      const flagId = 1;
      const expectedFlag = { id: flagId, name: 'Test Flag' };

      mockPrismaService.flag.findUnique.mockResolvedValue(expectedFlag);

      const result = await repository.findOne(flagId);

      expect(result).toEqual(expectedFlag);
      expect(mockPrismaService.flag.findUnique).toHaveBeenCalledWith({
        where: { id: flagId, deletedAt: null },
      });
    });

    it('should include deleted flags when showDeleted is true', async () => {
      const flagId = 1;
      const deletedFlag = {
        id: flagId,
        name: 'Test Flag',
        deletedAt: new Date(),
      };

      mockPrismaService.flag.findUnique.mockResolvedValue(deletedFlag);

      const result = await repository.findOne(flagId, true);

      expect(result).toEqual(deletedFlag);
      expect(mockPrismaService.flag.findUnique).toHaveBeenCalledWith({
        where: { id: flagId },
      });
    });

    it('should return null when flag not found', async () => {
      const flagId = 999;

      mockPrismaService.flag.findUnique.mockResolvedValue(null);

      const result = await repository.findOne(flagId);

      expect(result).toBeNull();
    });

    it('should handle database error', async () => {
      const flagId = 1;

      mockPrismaService.flag.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(repository.findOne(flagId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
