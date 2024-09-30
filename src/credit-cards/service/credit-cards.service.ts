import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCreditCardDto } from '../dto/create-credit-card.dto';
import { UpdateCreditCardDto } from '../dto/update-credit-card.dto';
import { CreditCardsRepository } from '../repository/credit-cards.repository';
import { ListAllDto } from 'src/common/dto/list-all.dto';

@Injectable()
export class CreditCardsService {
  constructor(private readonly creditCardsRepository: CreditCardsRepository) {}
  create(userId: number, createCreditCardDto: CreateCreditCardDto) {
    return this.creditCardsRepository.create(userId, createCreditCardDto);
  }

  findAll(userId: number, query: ListAllDto) {
    return this.creditCardsRepository.findAll(userId, query);
  }

  async findOne(userId: number, creditCardId: number) {
    const creditCard = await this.creditCardsRepository.findOne(
      creditCardId,
      true,
    );

    if (!creditCard) {
      throw new NotFoundException(`Credit card #${creditCardId} not found`);
    }

    if (creditCard.userId !== userId) {
      throw new NotFoundException(
        `Credit card #${creditCardId} not found for user #${userId}`,
      );
    }

    return creditCard;
  }

  async update(
    userId: number,
    creditCardId: number,
    updateCreditCardDto: UpdateCreditCardDto,
  ) {
    await this.findOne(userId, creditCardId);

    return await this.creditCardsRepository.update(
      creditCardId,
      updateCreditCardDto,
    );
  }

  async remove(userId: number, creditCardId: number) {
    await this.findOne(userId, creditCardId);

    return await this.creditCardsRepository.remove(creditCardId);
  }
}
