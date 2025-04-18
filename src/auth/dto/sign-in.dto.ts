import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { randomUUID } from 'crypto';

export class SignInDto {
  @ApiProperty({ example: 'ana@hotmail.com' })
  @IsString()
  email: string;
  @ApiProperty({ example: randomUUID() })
  @IsString()
  password: string;
}
