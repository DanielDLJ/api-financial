import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from '../../prisma/service/prisma.service';
import { ListAllDto } from '../../common/dto/list-all.dto';
import {
  MetaData,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prisma.user.create({ data: createUserDto });
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target.includes('email')) {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException(error);
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
      throw new InternalServerErrorException(error);
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
      throw new InternalServerErrorException(error);
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, data: UpdateUserDto) {
    try {
      return await this.prisma.user.update({ where: { id }, data });
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target.includes('email')) {
        throw new ConflictException('Email already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    try {
      const data = {
        deletedAt: new Date(),
      };
      return await this.prisma.user.update({ where: { id }, data });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
