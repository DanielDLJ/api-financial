import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
      });
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target.includes('card_name')) {
        throw new ConflictException('Card name already exists');
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
    showDeleted?: boolean,
  ): Promise<CreditCard | null> {
    const where = showDeleted
      ? { id: creditCardId }
      : { id: creditCardId, deletedAt: null };

    try {
      return await this.prisma.creditCard.findUnique({
        where,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, data: UpdateCreditCardDto) {
    try {
      return await this.prisma.creditCard.update({ where: { id }, data });
    } catch (error) {
      if (error.code === 'P2002' && error.meta.target.includes('card_name')) {
        throw new ConflictException('Card name already exists');
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    try {
      const data = {
        deletedAt: new Date(),
      };
      return await this.prisma.creditCard.update({ where: { id }, data });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
