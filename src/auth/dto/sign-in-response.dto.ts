import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { randomUUID } from 'crypto';

export class SignInResponseDto {
  @ApiProperty({ example: randomUUID() })
  @IsString()
  access_token: string;
}
