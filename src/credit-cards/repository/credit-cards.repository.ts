import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import { CreateCreditCardDto } from '../dto/create-credit-card.dto';
import { ListAllDto } from 'src/common/dto/list-all.dto';
import {
  MetaData,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto';
import { CreditCard } from '@prisma/client';
import { UpdateCreditCardDto } from '../dto/update-credit-card.dto';

@Injectable()
export class CreditCardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: number, createCreditCardDto: CreateCreditCardDto) {
    const { bankId, flagId, ...rest } = createCreditCardDto;

    try {
      return await this.prisma.creditCard.create({
        data: {
          ...rest,
          user: {
            connect: {
              id: userId,
            },
          },
          bank: {
            connect: {
              id: bankId,
            },
          },
          flag: {
            connect: {
              id: flagId,
            },
          },
        },
        include: {
          bank: true,
          flag: true,
        },
      });
    } catch (error) {
      if (
        error.code === 'P2002' &&
        error?.meta?.target === 'credit-cards_cardName_userId_key'
      ) {
        throw new ConflictException('Card name already exists');
      }
      if (error.code === 'P2025' && error?.meta?.cause?.includes(`No 'Bank'`)) {
        throw new NotFoundException('Bank not found');
      }
      if (error.code === 'P2025' && error?.meta?.cause?.includes(`No 'Flag'`)) {
        throw new NotFoundException('Flag not found');
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
      const creditCards = await this.prisma.creditCard.findMany({
        where,
        take: limit,
        skip,
        include: {
          bank: true,
          flag: true,
        },
      });
      const total = await this.prisma.creditCard.count({ where });
      return new PaginatedResponseDto<CreditCard>(
        creditCards,
        new MetaData(page, limit, total),
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(
    creditCardId: number,
    userId: number,
    showDeleted?: boolean,
  ): Promise<CreditCard | null> {
    const where = showDeleted
      ? { id: creditCardId, userId }
      : { id: creditCardId, userId, deletedAt: null };

    try {
      return await this.prisma.creditCard.findUnique({
        where,
        include: {
          bank: true,
          flag: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, data: UpdateCreditCardDto) {
    try {
      return await this.prisma.creditCard.update({
        where: { id },
        data,
        include: { bank: true, flag: true },
      });
    } catch (error) {
      if (
        error.code === 'P2002' &&
        error?.meta?.target === 'credit-cards_cardName_userId_key'
      ) {
        throw new ConflictException('Card name already exists');
      }
      if (error.code === 'P2003' && error?.meta?.field_name === 'bankId') {
        throw new NotFoundException('Bank not found');
      }
      if (error.code === 'P2003' && error?.meta?.field_name === 'flagId') {
        throw new NotFoundException('Flag not found');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    try {
      const data = {
        deletedAt: new Date(),
      };
      return await this.prisma.creditCard.update({
        where: { id },
        data,
        include: { bank: true, flag: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
