import { HttpStatus, Injectable } from '@nestjs/common';
import { BanksRepository } from '../repository/banks.repository';
import { ListAllBanksDto } from '../dto/list-all-banks.dto';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { ApiException } from '@/common/exceptions/api.exception';

@Injectable()
export class BanksService {
  constructor(private readonly banksRepository: BanksRepository) {}

  async findAll(query: ListAllBanksDto) {
    return await this.banksRepository.findAll(query);
  }

  async findOne(id: number, showDeleted = false) {
    const bank = await this.banksRepository.findOne(id, showDeleted);

    if (!bank) {
      throw new ApiException({
        code: ApiErrorCode.BANK_NOT_FOUND,
        message: `Bank #${id} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return bank;
  }
}
