import { ApiProperty } from '@nestjs/swagger';
import { randomUUID } from 'crypto';
import { UserToken } from './user-token.dto';

export class RefreshTokenResponseDto {
  @ApiProperty({ example: randomUUID() })
  access_token: string;
  @ApiProperty({ example: randomUUID() })
  refresh_token: string;
  @ApiProperty({ type: UserToken })
  user: UserToken;
}
