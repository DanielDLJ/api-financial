import { ApiProperty } from '@nestjs/swagger';
import { Role, User as UserEntity } from '@prisma/client';

export class User implements UserEntity {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'ana@hotmail.com' })
  email: string;
  @ApiProperty({ example: 'Ana' })
  name: string;
  @ApiProperty({ example: '123456' })
  password: string;
  @ApiProperty({ example: Role.USER, enum: Role })
  role: Role;
  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;
  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;
  @ApiProperty({ example: new Date().toISOString() })
  deletedAt: Date;
}
