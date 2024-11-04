import { ApiProperty } from '@nestjs/swagger';
import { Expense as ExpenseEntity } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class Expense implements ExpenseEntity {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Netflix' })
  description: string;
  @ApiProperty({ example: new Date().toISOString() })
  expense_date: Date;
  @ApiProperty({ example: 100 })
  total_amount: Decimal;
  @ApiProperty({ example: false })
  superficial: boolean;
  @ApiProperty({ example: 1 })
  userId: number;
  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;
  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;
  @ApiProperty({ example: new Date().toISOString() })
  deletedAt: Date;
}
