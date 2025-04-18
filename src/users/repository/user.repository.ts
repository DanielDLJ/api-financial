import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ListAllDto } from '../../common/dto/list-all.dto';
import {
  MetaData,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto';
import { User } from '@prisma/client';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target.includes('email')) {
        throw new ApiException({
          code: ApiErrorCode.USER_ALREADY_EXISTS,
          message: 'Email already exists',
          statusCode: HttpStatus.CONFLICT,
        });
      }
      this.handleGenericDatabaseError('create', error);
    }
  }

  async findAll(query: ListAllDto) {
    const { page, limit, showDeleted } = query;
    const skip = (page - 1) * limit;
    const where = showDeleted ? {} : { deletedAt: null };

    try {
      const users = await this.prisma.user.findMany({
        where,
        take: limit,
        skip,
        include: {
          creditCard: true,
        },
      });

      const total = await this.prisma.user.count({ where });
      return new PaginatedResponseDto<User>(
        users,
        new MetaData(page, limit, total),
      );
    } catch (error) {
      this.handleGenericDatabaseError('findAll', error);
    }
  }

  async findOne(id: number, showDeleted?: boolean): Promise<User | null> {
    const where = showDeleted ? { id } : { id, deletedAt: null };

    try {
      const user = await this.prisma.user.findUnique({
        where,
        include: {
          creditCard: true,
        },
      });
      return user;
    } catch (error) {
      this.handleGenericDatabaseError('findOne', error);
    }
  }

  async findByEmail(email: string, showDeleted = false) {
    const where = showDeleted ? { email } : { email, deletedAt: null };

    try {
      return await this.prisma.user.findUnique({ where });
    } catch (error) {
      this.handleGenericDatabaseError('findByEmail', error);
    }
  }

  async update(id: number, data: UpdateUserDto) {
    try {
      return await this.prisma.user.update({ where: { id }, data });
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target.includes('email')) {
        throw new ApiException({
          code: ApiErrorCode.USER_ALREADY_EXISTS,
          message: 'Email already exists',
          statusCode: HttpStatus.CONFLICT,
        });
      }
      this.handleGenericDatabaseError('update', error);
    }
  }

  async remove(id: number) {
    try {
      const data = {
        deletedAt: new Date(),
      };
      return await this.prisma.user.update({ where: { id }, data });
    } catch (error) {
      this.handleGenericDatabaseError('remove', error);
    }
  }

  private handleGenericDatabaseError(operation: string, error: any) {
    this.prisma.handleGenericDatabaseError('user_repository', operation, error);
    throw error;
  }
}
