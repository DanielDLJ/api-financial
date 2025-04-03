import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './user.repository';
import { PrismaService } from '@/prisma/service/prisma.service';
import { Role } from '@prisma/client';
import { HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';

describe('UsersRepository', () => {
  let repository: UsersRepository;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    handleGenericDatabaseError: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);

    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
      role: Role.USER,
    };

    it('should create a user successfully', async () => {
      const expectedUser = { id: 1, ...createUserDto };
      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      const result = await repository.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
    });

    it('should throw ApiException CONFLICT when email already exists', async () => {
      mockPrismaService.user.create.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      await expect(repository.create(createUserDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.USER_ALREADY_EXISTS,
          message: 'Email already exists',
          statusCode: HttpStatus.CONFLICT,
        }),
      );
    });

    it('should throw InternalServerErrorException for unknown database errors', async () => {
      mockPrismaService.user.create.mockRejectedValue(
        new Error('Prisma query timeout'),
      );

      mockPrismaService.handleGenericDatabaseError.mockImplementation(() => {
        throw new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      });

      await expect(repository.create(createUserDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    });
  });

  describe('findAll', () => {
    const query = { page: 1, limit: 10, showDeleted: false };

    it('should return paginated users', async () => {
      const users = [{ id: 1, name: 'Test User' }];
      const total = 1;

      mockPrismaService.user.findMany.mockResolvedValue(users);
      mockPrismaService.user.count.mockResolvedValue(total);

      const result = await repository.findAll(query);

      expect(result.data).toEqual(users);
      expect(result.metaData).toEqual({
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      });
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
        take: query.limit,
        skip: 0,
        include: {
          creditCard: true,
        },
      });
    });

    it('should handle showDeleted flag', async () => {
      await repository.findAll({ ...query, showDeleted: true });

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        where: {},
        take: query.limit,
        skip: 0,
        include: {
          creditCard: true,
        },
      });
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.user.findMany.mockRejectedValue(
        new Error('Prisma query timeout'),
      );

      mockPrismaService.handleGenericDatabaseError.mockImplementation(() => {
        throw new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      });

      await expect(repository.findAll(query)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    });
  });

  describe('findOne', () => {
    const userId = 1;

    it('should find a user by id', async () => {
      const expectedUser = { id: userId, name: 'Test User' };
      mockPrismaService.user.findUnique.mockResolvedValue(expectedUser);

      const result = await repository.findOne(userId);

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId, deletedAt: null },
        include: {
          creditCard: true,
        },
      });
    });

    it('should include deleted users when showDeleted is true', async () => {
      await repository.findOne(userId, true);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: {
          creditCard: true,
        },
      });
    });

    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await repository.findOne(userId);

      expect(result).toBeNull();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.user.findUnique.mockRejectedValue(
        new Error('Prisma query timeout'),
      );

      mockPrismaService.handleGenericDatabaseError.mockImplementation(() => {
        throw new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      });

      await expect(repository.findOne(userId)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    });
  });

  describe('findByEmail', () => {
    const email = 'test@example.com';

    it('should find a user by email', async () => {
      const expectedUser = { id: 1, email };
      mockPrismaService.user.findUnique.mockResolvedValue(expectedUser);

      const result = await repository.findByEmail(email, false);

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email, deletedAt: null },
      });
    });

    it('should include deleted users when showDeleted is true', async () => {
      const expectedUser = { id: 1, email, deletedAt: new Date() };
      mockPrismaService.user.findUnique.mockResolvedValue(expectedUser);

      const result = await repository.findByEmail(email, true);

      expect(result).toEqual(expectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });

    it('should return null when user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      const result = await repository.findByEmail(email);

      expect(result).toBeNull();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.user.findUnique.mockRejectedValue(
        new Error('Prisma query timeout'),
      );

      mockPrismaService.handleGenericDatabaseError.mockImplementation(() => {
        throw new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      });

      await expect(repository.findByEmail(email)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    });
  });

  describe('update', () => {
    const userId = 1;
    const updateData = { name: 'Updated Name' };

    it('should update a user successfully', async () => {
      const updatedUser = { id: userId, ...updateData };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await repository.update(userId, updateData);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: updateData,
      });
    });

    it('should throw ConflictException when email already exists', async () => {
      mockPrismaService.user.update.mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });

      await expect(repository.update(userId, updateData)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.USER_ALREADY_EXISTS,
          message: 'Email already exists',
          statusCode: HttpStatus.CONFLICT,
        }),
      );
    });

    it('should throw InternalServerErrorException for unknown database errors', async () => {
      mockPrismaService.user.update.mockRejectedValue(
        new Error('Prisma query timeout'),
      );

      mockPrismaService.handleGenericDatabaseError.mockImplementation(() => {
        throw new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      });

      await expect(repository.update(userId, updateData)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    });
  });

  describe('remove', () => {
    const userId = 1;

    it('should soft delete a user successfully', async () => {
      const deletedUser = {
        id: userId,
        deletedAt: new Date(),
      };
      mockPrismaService.user.update.mockResolvedValue(deletedUser);

      const result = await repository.remove(userId);

      expect(result).toEqual(deletedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw InternalServerErrorException on database error', async () => {
      mockPrismaService.user.update.mockRejectedValue(
        new Error('Prisma query timeout'),
      );

      mockPrismaService.handleGenericDatabaseError.mockImplementation(() => {
        throw new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        });
      });

      await expect(repository.remove(userId)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    });
  });
});
