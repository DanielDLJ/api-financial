import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class ListAllDto extends PaginationDto {
  @IsOptional()
  @ApiProperty({ default: false })
  showDeleted = false;
}
