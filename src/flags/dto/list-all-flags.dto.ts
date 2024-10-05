import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ListAllDto } from '../../common/dto/list-all.dto';

export class ListAllFlagsDto extends ListAllDto {
  @IsOptional()
  @ApiProperty({ example: 'Visa' })
  name?: string;
}
