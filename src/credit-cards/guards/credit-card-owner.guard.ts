import { HttpStatus, Injectable } from '@nestjs/common';
import { ResourceOwnerGuard } from '@/common/guard/resource-owner.guard';
import { CreditCardsService } from '../service/credit-cards.service';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { ApiException } from '@/common/exceptions/api.exception';

@Injectable()
export class CreditCardOwnerGuard extends ResourceOwnerGuard {
  constructor(private creditCardsService: CreditCardsService) {
    super();
  }

  getResourceId(params: any): string {
    return params.creditCardId;
  }

  getUserId(params: any): string {
    return params.userId;
  }

  protected async validateOwnership(
    userId: number,
    resourceId: string | number,
  ): Promise<boolean> {
    const creditCard = await this.creditCardsService.findOne(
      userId,
      +resourceId,
      true,
    );

    if (!creditCard) {
      throw new ApiException({
        code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
        message: `Credit card #${resourceId} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }

    return creditCard.userId === userId;
  }
}
