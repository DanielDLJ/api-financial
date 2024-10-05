import { Injectable, NotFoundException } from '@nestjs/common';
import { FlagsRepository } from '../repository/flags.repository';
import { ListAllFlagsDto } from '../dto/list-all-flags.dto';

@Injectable()
export class FlagsService {
  constructor(private readonly flagsRepository: FlagsRepository) {}

  async findAll(query: ListAllFlagsDto) {
    return await this.flagsRepository.findAll(query);
  }

  async findOne(id: number, showDeleted?: boolean) {
    const flag = await this.flagsRepository.findOne(id, showDeleted);

    if (!flag) {
      throw new NotFoundException(`Flag #${id} not found`);
    }
    return flag;
  }
}
