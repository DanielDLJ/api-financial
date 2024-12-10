import { HttpStatus, Injectable } from '@nestjs/common';
import { FlagsRepository } from '../repository/flags.repository';
import { ListAllFlagsDto } from '../dto/list-all-flags.dto';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { ApiException } from '@/common/exceptions/api.exception';

@Injectable()
export class FlagsService {
  constructor(private readonly flagsRepository: FlagsRepository) {}

  async findAll(query: ListAllFlagsDto) {
    return await this.flagsRepository.findAll(query);
  }

  async findOne(id: number, showDeleted = false) {
    const flag = await this.flagsRepository.findOne(id, showDeleted);

    if (!flag) {
      throw new ApiException({
        code: ApiErrorCode.FLAG_NOT_FOUND,
        message: `Flag #${id} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return flag;
  }
}
