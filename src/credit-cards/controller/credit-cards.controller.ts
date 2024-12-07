import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreditCardsService } from '../service/credit-cards.service';
import { CreateCreditCardDto } from '../dto/create-credit-card.dto';
import { UpdateCreditCardDto } from '../dto/update-credit-card.dto';
import { ApiTags } from '@nestjs/swagger';
import { UserInterceptor } from '../interceptor/user.interceptor';
import { ListAllDto } from '../../common/dto/list-all.dto';
import { FindCreditCardDto } from '../dto/find-credit-card.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreditCardOwnerGuard } from '../guards/credit-card-owner.guard';

@Controller('users')
@ApiTags('credit-cards')
@UseInterceptors(UserInterceptor)
export class CreditCardsController {
  constructor(private readonly creditCardsService: CreditCardsService) {}

  @Post(':userId/credit-cards')
  @Roles(Role.ADMIN, Role.USER)
  create(
    @Param('userId') userId: string,
    @Body() createCreditCardDto: CreateCreditCardDto,
  ) {
    return this.creditCardsService.create(+userId, createCreditCardDto);
  }

  @Get(':userId/credit-cards')
  @Roles(Role.ADMIN, Role.USER)
  findAll(@Param('userId') userId: string, @Query() query: ListAllDto) {
    return this.creditCardsService.findAll(+userId, query);
  }

  @Get(':userId/credit-cards/:creditCardId')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(CreditCardOwnerGuard)
  findOne(
    @Param('userId') userId: string,
    @Param('creditCardId') creditCardId: string,
    @Query() query: FindCreditCardDto,
  ) {
    return this.creditCardsService.findOne(
      +userId,
      +creditCardId,
      query.showDeleted,
    );
  }

  @Patch(':userId/credit-cards/:creditCardId')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(CreditCardOwnerGuard)
  update(
    @Param('userId') userId: string,
    @Param('creditCardId') creditCardId: string,
    @Body() updateCreditCardDto: UpdateCreditCardDto,
  ) {
    return this.creditCardsService.update(
      +userId,
      +creditCardId,
      updateCreditCardDto,
    );
  }

  @Delete(':userId/credit-cards/:creditCardId')
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(CreditCardOwnerGuard)
  remove(
    @Param('userId') userId: string,
    @Param('creditCardId') creditCardId: string,
  ) {
    return this.creditCardsService.remove(+userId, +creditCardId);
  }
}
