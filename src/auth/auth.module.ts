import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { EncryptionModule } from '../encryption/encryption.module';
import { TokenModule } from '../token/token.module';

@Module({
  imports: [UsersModule, EncryptionModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
