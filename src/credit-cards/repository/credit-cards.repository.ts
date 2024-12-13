import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/service/prisma.service';
import { CreateCreditCardDto } from '../dto/create-credit-card.dto';
import { ListAllDto } from '@/common/dto/list-all.dto';
import { UpdateCreditCardDto } from '../dto/update-credit-card.dto';
import { ApiException } from '@/common/exceptions/api.exception';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class CreditCardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, data: CreateCreditCardDto) {
    const { bankId, flagId, ...rest } = data;

    try {
      return await this.prisma.creditCard.create({
        data: {
          ...rest,
          user: { connect: { id: userId } },
          bank: { connect: { id: bankId } },
          flag: { connect: { id: flagId } },
        },
        include: {
          bank: true,
          flag: true,
        },
      });
    } catch (error) {
      this.handleDatabaseError(error, userId, data);
    }
  }

  async findAll(userId: number, query: ListAllDto) {
    const { page, limit, showDeleted } = query;
    const skip = (page - 1) * limit;
    const where = { userId, ...(showDeleted ? {} : { deletedAt: null }) };

    try {
      const [creditCards, total] = await Promise.all([
        this.prisma.creditCard.findMany({
          where,
          take: limit,
          skip,
          include: {
            bank: true,
            flag: true,
          },
        }),
        this.prisma.creditCard.count({ where }),
      ]);

      return {
        data: creditCards,
        metaData: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Error fetching credit cards',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: error.message,
      });
    }
  }

  async findOne(creditCardId: number, userId: number, showDeleted?: boolean) {
    const where = {
      id: creditCardId,
      userId,
      ...(showDeleted ? {} : { deletedAt: null }),
    };

    try {
      return await this.prisma.creditCard.findUnique({
        where,
        include: {
          bank: true,
          flag: true,
        },
      });
    } catch (error) {
      throw new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Error fetching credit card',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: error.message,
      });
    }
  }

  async update(id: number, data: UpdateCreditCardDto) {
    const { bankId, flagId, ...rest } = data;

    try {
      return await this.prisma.creditCard.update({
        where: { id },
        data: {
          ...rest,
          ...(bankId && { bank: { connect: { id: bankId } } }),
          ...(flagId && { flag: { connect: { id: flagId } } }),
        },
        include: { bank: true, flag: true },
      });
    } catch (error) {
      this.handleDatabaseError(error, id, data);
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.creditCard.update({
        where: { id },
        data: { deletedAt: new Date() },
        include: { bank: true, flag: true },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new ApiException({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: `Credit card #${id} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }

      throw new ApiException({
        code: ApiErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Error removing credit card',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: error.message,
      });
    }
  }

  private handleDatabaseError(
    error: any,
    userId: number,
    data: Partial<CreateCreditCardDto>,
  ) {
    // Foreign key constraint errors
    if (error.code === 'P2025') {
      if (error.meta?.cause?.includes('User')) {
        throw new ApiException({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: `User #${userId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (error.meta?.cause?.includes('Flag')) {
        throw new ApiException({
          code: ApiErrorCode.FLAG_NOT_FOUND,
          message: `Flag #${data.flagId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
      if (error.meta?.cause?.includes('Bank')) {
        throw new ApiException({
          code: ApiErrorCode.BANK_NOT_FOUND,
          message: `Bank #${data.bankId} not found`,
          statusCode: HttpStatus.NOT_FOUND,
        });
      }
    }

    // Unique constraint errors
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('cardName')) {
        throw new ApiException({
          code: ApiErrorCode.CARD_NAME_ALREADY_EXISTS,
          message: 'Card name already exists for this user',
          statusCode: HttpStatus.CONFLICT,
        });
      }
    }

    // Generic database errors
    throw new ApiException({
      code: ApiErrorCode.INTERNAL_SERVER_ERROR,
      message: 'An unexpected error occurred while processing your request',
      details: error.message,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
