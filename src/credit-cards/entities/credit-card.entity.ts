import { ApiProperty } from '@nestjs/swagger';
import { CreditCard as CreditCardEntity } from '@prisma/client';

export class CreditCard implements CreditCardEntity {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: '1234 5678 9012 3456' })
  cardName: string;
  @ApiProperty({ example: 10 })
  dueDate: number;
  @ApiProperty({ example: 10 })
  closingDate: number;
  @ApiProperty({ example: 1000 })
  creditLimit: number;
  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;
  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;
  @ApiProperty({ example: new Date().toISOString() })
  deletedAt: Date;
  @ApiProperty({ example: 1 })
  bankId: number;
  @ApiProperty({ example: 1 })
  flagId: number;
  @ApiProperty({ example: 1 })
  userId: number;
}
