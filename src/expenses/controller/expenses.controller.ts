import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ExpensesService } from '../service/expenses.service';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { ApiTags } from '@nestjs/swagger';
import { ListAllDto } from '../../common/dto/list-all.dto';
import { FindExpenseDto } from '../dto/find-expense.dto';

@Controller('users')
@ApiTags('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post(':userId/expenses')
  create(
    @Param('userId') userId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expensesService.create(+userId, createExpenseDto);
  }

  @Get(':userId/expenses')
  findAll(@Param('userId') userId: string, @Query() query: ListAllDto) {
    return this.expensesService.findAll(+userId, query);
  }

  @Get(':userId/expenses/:expenseId')
  findOne(
    @Param('userId') userId: string,
    @Param('expenseId') expenseId: string,
    @Query() query: FindExpenseDto,
  ) {
    return this.expensesService.findOne(+userId, +expenseId, query.showDeleted);
  }

  @Patch(':userId/expenses/:expenseId')
  update(
    @Param('userId') userId: string,
    @Param('expenseId') expenseId: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(+userId, +expenseId, updateExpenseDto);
  }

  @Delete(':userId/expenses/:expenseId')
  remove(
    @Param('userId') userId: string,
    @Param('expenseId') expenseId: string,
  ) {
    return this.expensesService.remove(+userId, +expenseId);
  }
}
