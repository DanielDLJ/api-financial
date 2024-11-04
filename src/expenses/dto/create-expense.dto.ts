import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @ApiPropertyOptional({ example: 'Netflix' })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({ example: new Date().toISOString() })
  @IsDateString()
  @IsString()
  expense_date: Date;
  @ApiProperty({ example: 100 })
  @IsNumber()
  total_amount: number;
  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  superficial = false;
}
