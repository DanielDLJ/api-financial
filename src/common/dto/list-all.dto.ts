import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationDto } from './pagination.dto';

export class ListAllDto extends PaginationDto {
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  showDeleted = false;
}
