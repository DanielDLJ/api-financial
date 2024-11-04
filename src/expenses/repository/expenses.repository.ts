import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { ListAllDto } from 'src/common/dto/list-all.dto';
import {
  MetaData,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto';
import { Expense } from '@prisma/client';
import { UpdateExpenseDto } from '../dto/update-expense.dto';

@Injectable()
export class ExpensesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createExpenseDto: CreateExpenseDto) {
    const { ...rest } = createExpenseDto;

    try {
      return await this.prisma.expense.create({
        data: {
          ...rest,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025' && error?.meta?.cause?.includes(`No 'User'`)) {
        throw new NotFoundException('User not found');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(userId: number, query: ListAllDto) {
    const { page, limit, showDeleted } = query;
    const skip = (page - 1) * limit;
    const where = showDeleted ? {} : { deletedAt: null };
    where['userId'] = userId;

    try {
      const expenses = await this.prisma.expense.findMany({
        where,
        take: limit,
        skip,
      });
      const total = await this.prisma.expense.count({ where });
      return new PaginatedResponseDto<Expense>(
        expenses,
        new MetaData(page, limit, total),
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(
    expenseId: number,
    userId: number,
    showDeleted?: boolean,
  ): Promise<Expense | null> {
    const where = showDeleted
      ? { id: expenseId, userId }
      : { id: expenseId, userId, deletedAt: null };

    try {
      return await this.prisma.expense.findUnique({
        where,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, data: UpdateExpenseDto) {
    try {
      return await this.prisma.expense.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    try {
      const data = {
        deletedAt: new Date(),
      };
      return await this.prisma.expense.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
