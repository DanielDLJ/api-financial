import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindExpenseDto {
  @ApiPropertyOptional({ default: false, example: false })
  @IsOptional()
  @Type(() => Boolean)
  showDeleted? = false;
}
