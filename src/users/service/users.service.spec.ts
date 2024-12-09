import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../repository/user.repository';
import { EncryptionService } from '@/encryption/service/encryption.service';
import { Role } from '@prisma/client';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { ApiException } from '@/common/exceptions/api.exception';
import { ListAllDto } from '@/common/dto/list-all.dto';
import { HttpStatus } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockEncryptionService = {
    generateHashPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository,
        },
        {
          provide: EncryptionService,
          useValue: mockEncryptionService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: Role.USER,
      };

      const hashedPassword = 'hashedPassword';
      const createdUser = { ...createUserDto, id: 1, password: hashedPassword };

      mockUsersRepository.findByEmail.mockResolvedValue(null);
      mockEncryptionService.generateHashPassword.mockReturnValue(
        hashedPassword,
      );
      mockUsersRepository.create.mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(mockEncryptionService.generateHashPassword).toHaveBeenCalledWith(
        createUserDto.password,
      );
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: hashedPassword,
      });
    });

    it('should throw if email already exists', async () => {
      const createUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        role: Role.USER,
      };

      mockUsersRepository.findByEmail.mockResolvedValue({ id: 1 });

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.USER_ALREADY_EXISTS,
          message: 'User already exists',
          statusCode: HttpStatus.CONFLICT,
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const query: ListAllDto = { page: 1, limit: 10, showDeleted: false };
      const users = [{ id: 1, name: 'Test User' }];
      const meta = { page: 1, limit: 10, total: 1 };

      mockUsersRepository.findAll.mockResolvedValue({ data: users, meta });

      const result = await service.findAll(query);

      expect(result).toEqual({ data: users, meta });
      expect(mockUsersRepository.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const userId = 1;
      const showDeleted = false;
      const user = { id: userId, name: 'Test User' };

      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne(userId);

      expect(result).toEqual(user);
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith(
        userId,
        showDeleted,
      );
    });

    it('should throw ApiException if user not found', async () => {
      const userId = 1;
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: `User #${userId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto = { name: 'Updated Name' };
      const updatedUser = { id: userId, name: 'Updated Name' };

      mockUsersRepository.findOne.mockResolvedValue({ id: userId });
      mockUsersRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUsersRepository.update).toHaveBeenCalledWith(
        userId,
        updateUserDto,
      );
    });

    it('should throw if user not found', async () => {
      const userId = 1;
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(userId, { name: 'New Name' }),
      ).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: `User #${userId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });

    it('should throw if an error occurs', async () => {
      const userId = 1;
      mockUsersRepository.findOne.mockResolvedValue({ id: userId });
      mockUsersRepository.update.mockRejectedValue(new Error('Test error'));

      await expect(
        service.update(userId, { name: 'New Name' }),
      ).rejects.toThrow(new Error('Test error'));
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      const userId = 1;
      const deletedUser = {
        id: userId,
        deletedAt: new Date(),
      };

      mockUsersRepository.findOne.mockResolvedValue({ id: userId });
      mockUsersRepository.remove.mockResolvedValue(deletedUser);

      const result = await service.remove(userId);

      expect(result).toEqual(deletedUser);
      expect(mockUsersRepository.remove).toHaveBeenCalledWith(userId);
    });

    it('should throw if user not found', async () => {
      const userId = 1;
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(
        new ApiException({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: `User #${userId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        }),
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      mockUsersRepository.findByEmail.mockResolvedValue(user);

      const result = await service.findByEmail(user.email);

      expect(result).toEqual(user);
      expect(mockUsersRepository.findByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
});
