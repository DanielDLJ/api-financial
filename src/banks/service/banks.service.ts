import { Injectable, NotFoundException } from '@nestjs/common';
import { BanksRepository } from '../repository/banks.repository';
import { ListAllBanksDto } from '../dto/list-all-banks.dto';

@Injectable()
export class BanksService {
  constructor(private readonly banksRepository: BanksRepository) {}

  async findAll(query: ListAllBanksDto) {
    return await this.banksRepository.findAll(query);
  }

  async findOne(id: number, showDeleted?: boolean) {
    const bank = await this.banksRepository.findOne(id, showDeleted);

    if (!bank) {
      throw new NotFoundException(`Bank #${id} not found`);
    }
    return bank;
  }
}
