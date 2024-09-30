import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @ApiProperty({ default: 1 })
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({ default: 10 })
  limit = 10;
}
