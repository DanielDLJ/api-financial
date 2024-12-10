import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/service/prisma.service';
import {
  MetaData,
  PaginatedResponseDto,
} from '../../common/dto/paginated-response.dto';
import { Flag } from '@prisma/client';
import { ListAllFlagsDto } from '../dto/list-all-flags.dto';

@Injectable()
export class FlagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListAllFlagsDto) {
    const { page, limit, showDeleted } = query;
    const skip = (page - 1) * limit;
    const where = showDeleted ? {} : { deletedAt: null };
    if (query.name) {
      where['name'] = {
        contains: query.name,
      };
    }

    try {
      const flags = await this.prisma.flag.findMany({
        where,
        take: limit,
        skip,
      });

      const total = await this.prisma.flag.count({ where });
      return new PaginatedResponseDto<Flag>(
        flags,
        new MetaData(page, limit, total),
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number, showDeleted?: boolean): Promise<Flag | null> {
    const where = showDeleted ? { id } : { id, deletedAt: null };

    try {
      const user = await this.prisma.flag.findUnique({
        where,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
