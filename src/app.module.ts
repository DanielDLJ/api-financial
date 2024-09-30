import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EncryptionModule } from './encryption/encryption.module';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './common/config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    UsersModule,
    EncryptionModule,
    PrismaModule,
    AuthModule,
    CreditCardsModule,
  ],
})
export class AppModule {}
