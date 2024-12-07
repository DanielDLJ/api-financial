import { Injectable } from '@nestjs/common';
import { ResourceOwnerGuard } from '@/common/guard/resource-owner.guard';

@Injectable()
export class UserOwnerGuard extends ResourceOwnerGuard {
  getResourceId(params: any): string {
    return params.id;
  }

  getUserId(params: any): string {
    return params.id;
  }

  protected async validateOwnership(
    userId: number,
    resourceId: string | number,
  ): Promise<boolean> {
    // For users, the resourceId is the same as the userId
    return userId === +resourceId;
  }
}
