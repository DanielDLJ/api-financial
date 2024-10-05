import { ApiProperty } from '@nestjs/swagger';
import { Flag as FlagEntity } from '@prisma/client';

export class Flag implements FlagEntity {
  @ApiProperty({ example: 1 })
  id: number;
  @ApiProperty({ example: 'Visa' })
  name: string;
  @ApiProperty({ example: new Date().toISOString() })
  createdAt: Date;
  @ApiProperty({ example: new Date().toISOString() })
  updatedAt: Date;
  @ApiProperty({ example: new Date().toISOString() })
  deletedAt: Date;
}
