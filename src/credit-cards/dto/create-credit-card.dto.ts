import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCreditCardDto {
  @ApiProperty({ example: '1234 5678 9012 3456' })
  @IsString()
  cardName: string;
  @ApiProperty({ example: 'Mastercard' })
  @IsNumber()
  flagId: number;
  @ApiProperty({ example: 1 })
  @IsNumber()
  bankId: number;
  @ApiProperty({ example: 10 })
  @IsNumber()
  dueDate: number;
  @ApiProperty({ example: 10 })
  @IsNumber()
  closingDate: number;
  @ApiProperty({ example: 1000 })
  @IsNumber()
  creditLimit: number;
}
