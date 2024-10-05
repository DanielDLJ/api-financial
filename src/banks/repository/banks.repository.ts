import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import {
  MetaData,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto';
import { Bank } from '@prisma/client';
import { ListAllBanksDto } from '../dto/list-all-banks.dto';

@Injectable()
export class BanksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListAllBanksDto) {
    const { page, limit, showDeleted } = query;
    const skip = (page - 1) * limit;
    const where = showDeleted ? {} : { deletedAt: null };
    if (query.name) {
      where['name'] = {
        contains: query.name,
      };
    }

    if (query.fullName) {
      where['fullName'] = {
        contains: query.fullName,
      };
    }

    console.log('query.code', typeof query.code, query.code);
    if (query.code) {
      where['code'] = query.code;
    }

    try {
      const banks = await this.prisma.bank.findMany({
        where,
        take: limit,
        skip,
      });

      const total = await this.prisma.bank.count({ where });
      return new PaginatedResponseDto<Bank>(
        banks,
        new MetaData(page, limit, total),
      );
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding banks',
        cause: error,
      });
    }
  }

  async findOne(id: number, showDeleted?: boolean): Promise<Bank | null> {
    const where = showDeleted ? { id } : { id, deletedAt: null };

    try {
      const bank = await this.prisma.bank.findUnique({
        where,
      });
      return bank;
    } catch (error) {
      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding bank',
        cause: error,
      });
    }
  }
}
