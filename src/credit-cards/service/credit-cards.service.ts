import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCreditCardDto } from '../dto/create-credit-card.dto';
import { UpdateCreditCardDto } from '../dto/update-credit-card.dto';
import { CreditCardsRepository } from '../repository/credit-cards.repository';
import { ListAllDto } from 'src/common/dto/list-all.dto';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { ApiException } from '@/common/exceptions/api.exception';

@Injectable()
export class CreditCardsService {
  constructor(private readonly creditCardsRepository: CreditCardsRepository) {}
  async create(userId: number, createCreditCardDto: CreateCreditCardDto) {
    return this.creditCardsRepository.create(userId, createCreditCardDto);
  }

  async findAll(userId: number, query: ListAllDto) {
    return this.creditCardsRepository.findAll(userId, query);
  }

  async findOne(userId: number, creditCardId: number, showDeleted: boolean) {
    const creditCard = await this.creditCardsRepository.findOne(
      creditCardId,
      userId,
      showDeleted,
    );

    if (!creditCard) {
      throw new ApiException({
        code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
        message: `Credit card #${creditCardId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return creditCard;
  }

  async update(
    userId: number,
    creditCardId: number,
    updateCreditCardDto: UpdateCreditCardDto,
  ) {
    await this.findOne(userId, creditCardId, false);

    return await this.creditCardsRepository.update(
      creditCardId,
      updateCreditCardDto,
    );
  }

  async remove(userId: number, creditCardId: number) {
    await this.findOne(userId, creditCardId, false);

    return await this.creditCardsRepository.remove(creditCardId);
  }
}
