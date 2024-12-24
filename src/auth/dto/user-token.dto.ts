import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserToken {
  @ApiProperty({ example: 1 })
  sub: number;
  @ApiProperty({ example: 'Ana' })
  name: string;
  @ApiProperty({ example: 'ana@hotmail.com' })
  email: string;
  @ApiProperty({ enum: Role, example: Role.USER })
  role: Role;
}
