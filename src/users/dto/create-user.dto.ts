import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'ana@hotmail.com', minLength: 6, maxLength: 240 })
  @IsString()
  @IsEmail()
  @MaxLength(240)
  email: string;
  @ApiProperty({ example: 'Ana', minLength: 3, maxLength: 240 })
  @IsString()
  @MinLength(3)
  @MaxLength(240)
  name: string;
  @ApiProperty({ example: '123456', minLength: 6, maxLength: 240 })
  @IsString()
  @MinLength(6)
  @MaxLength(240)
  password: string;
  @IsOptional()
  @ApiProperty({ default: Role.USER })
  role: Role = Role.USER;
}
