import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ListAllDto } from '@/common/dto/list-all.dto';
import { ROLES_KEY } from '@/common/decorators/roles.decorator';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: Role.USER,
      };
      const expectedUser = { id: 1, ...createUserDto };

      mockUsersService.create.mockResolvedValue(expectedUser);

      const result = await controller.create(createUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should handle user already exists error', async () => {
      const createUserDto: CreateUserDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        role: Role.USER,
      };

      const error = new ApiException({
        code: ApiErrorCode.USER_ALREADY_EXISTS,
        message: 'User already exists',
        statusCode: HttpStatus.CONFLICT,
      });

      mockUsersService.create.mockRejectedValue(error);

      await expect(controller.create(createUserDto)).rejects.toThrow(error);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const query: ListAllDto = { page: 1, limit: 10, showDeleted: false };
      const expectedResponse = {
        data: [{ id: 1, name: 'Test User' }],
        metaData: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };

      mockUsersService.findAll.mockResolvedValue(expectedResponse);

      const result = await controller.findAll(query);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle database error', async () => {
      const query: ListAllDto = { page: 1, limit: 10, showDeleted: false };

      const error = new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Database error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      mockUsersService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(query)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '1';
      const expectedUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
      };

      mockUsersService.findOne.mockResolvedValue(expectedUser);

      const result = await controller.findOne(userId);

      expect(result).toEqual(expectedUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(+userId);
    });

    it('should handle user not found error', async () => {
      const userId = '999';

      const error = new ApiException({
        code: ApiErrorCode.USER_NOT_FOUND,
        message: `User #${userId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });

      mockUsersService.findOne.mockRejectedValue(error);

      await expect(controller.findOne(userId)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };
      const expectedUser = {
        id: 1,
        name: 'Updated Name',
        email: 'test@example.com',
      };

      mockUsersService.update.mockResolvedValue(expectedUser);

      const result = await controller.update(userId, updateUserDto);

      expect(result).toEqual(expectedUser);
      expect(mockUsersService.update).toHaveBeenCalledWith(
        +userId,
        updateUserDto,
      );
    });

    it('should handle user not found error', async () => {
      const userId = '999';
      const updateUserDto: UpdateUserDto = { name: 'Updated Name' };

      const error = new ApiException({
        code: ApiErrorCode.USER_NOT_FOUND,
        message: `User #${userId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });

      mockUsersService.update.mockRejectedValue(error);

      await expect(controller.update(userId, updateUserDto)).rejects.toThrow(
        error,
      );
    });

    it('should handle email already exists error', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { email: 'existing@example.com' };

      const error = new ApiException({
        code: ApiErrorCode.USER_ALREADY_EXISTS,
        message: 'Email already exists',
        statusCode: HttpStatus.CONFLICT,
      });

      mockUsersService.update.mockRejectedValue(error);

      await expect(controller.update(userId, updateUserDto)).rejects.toThrow(
        error,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const userId = '1';
      const expectedResponse = {
        id: 1,
        deletedAt: new Date(),
      };

      mockUsersService.remove.mockResolvedValue(expectedResponse);

      const result = await controller.remove(userId);

      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.remove).toHaveBeenCalledWith(+userId);
    });

    it('should handle user not found error', async () => {
      const userId = '999';

      const error = new ApiException({
        code: ApiErrorCode.USER_NOT_FOUND,
        message: `User #${userId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });

      mockUsersService.remove.mockRejectedValue(error);

      await expect(controller.remove(userId)).rejects.toThrow(error);
    });

    it('should handle already deleted user error', async () => {
      const userId = '1';

      const error = new ApiException({
        code: ApiErrorCode.USER_NOT_FOUND,
        message: `User #${userId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });

      mockUsersService.remove.mockRejectedValue(error);

      await expect(controller.remove(userId)).rejects.toThrow(error);
    });
  });

  describe('Swagger and Decorators', () => {
    it('should have ApiTags decorator', () => {
      const controllerMetadata = Reflect.getMetadata(
        'swagger/apiUseTags',
        UsersController,
      );
      expect(controllerMetadata).toEqual(['users']);
    });

    it('should have Roles decorator on create method', () => {
      const rolesMetadata = Reflect.getMetadata(ROLES_KEY, controller.create);
      expect(rolesMetadata).toEqual([Role.ADMIN]);
    });

    it('should have Roles decorator on findAll method', () => {
      const rolesMetadata = Reflect.getMetadata(ROLES_KEY, controller.findAll);
      expect(rolesMetadata).toEqual([Role.ADMIN]);
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
