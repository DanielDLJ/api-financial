import { ApiProperty } from '@nestjs/swagger';
import { Bank as BankEntity } from '@prisma/client';

export class Bank implements BankEntity {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'BCO DO BRASIL S.A.' })
  name: string;
  @ApiProperty({ example: 0 })
  ispb: number;
  @ApiProperty({ example: 1 })
  code: number;
  @ApiProperty({ example: 'Banco do Brasil S.A.' })
  fullName: string;
  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;
  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;
  @ApiProperty({ example: new Date().toISOString() })
  deletedAt: Date;
}
