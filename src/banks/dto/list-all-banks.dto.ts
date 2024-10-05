import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { ListAllDto } from '../../common/dto/list-all.dto';
import { Transform } from 'class-transformer';

export class ListAllBanksDto extends ListAllDto {
  @IsOptional()
  @ApiProperty({ example: 'BCO DO BRASIL S.A.' })
  name?: string;

  @IsOptional()
  @ApiProperty({ example: 'Banco do Brasil S.A.' })
  fullName?: string;

  @IsOptional()
  @ApiProperty({ example: 1 })
  @Transform(({ value }) => parseInt(value))
  code?: number;
}
