import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UsersService } from '../../users/service/users.service';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UsersService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const userId = context.switchToHttp().getRequest().params.userId;
    console.log('UserInterceptor', userId);

    // const user = await this.userService.findOne(+userId);
    return next.handle().pipe();
  }
}
