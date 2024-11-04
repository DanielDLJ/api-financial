import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { UpdateExpenseDto } from '../dto/update-expense.dto';
import { ExpensesRepository } from '../repository/expenses.repository';
import { ListAllDto } from 'src/common/dto/list-all.dto';

@Injectable()
export class ExpensesService {
  constructor(private readonly expensesRepository: ExpensesRepository) {}
  create(userId: number, createExpenseDto: CreateExpenseDto) {
    return this.expensesRepository.create(userId, createExpenseDto);
  }

  findAll(userId: number, query: ListAllDto) {
    return this.expensesRepository.findAll(userId, query);
  }

  async findOne(userId: number, expenseId: number, showDeleted: boolean) {
    const expense = await this.expensesRepository.findOne(
      expenseId,
      userId,
      showDeleted,
    );

    if (!expense) {
      throw new NotFoundException(`Expense #${expenseId} not found`);
    }

    return expense;
  }

  async update(
    userId: number,
    expenseId: number,
    updateExpenseDto: UpdateExpenseDto,
  ) {
    await this.findOne(userId, expenseId, false);

    return await this.expensesRepository.update(expenseId, updateExpenseDto);
  }

  async remove(userId: number, expenseId: number) {
    await this.findOne(userId, expenseId, false);

    return await this.expensesRepository.remove(expenseId);
  }
}
