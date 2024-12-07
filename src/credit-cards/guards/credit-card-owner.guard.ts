import { Injectable } from '@nestjs/common';
import { ResourceOwnerGuard } from '@/common/guard/resource-owner.guard';
import { CreditCardsService } from '../service/credit-cards.service';

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
    return creditCard.userId === userId;
  }
}
