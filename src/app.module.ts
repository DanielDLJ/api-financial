import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EncryptionModule } from './encryption/encryption.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './common/config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CreditCardsModule } from './credit-cards/credit-cards.module';
import { FlagsModule } from './flags/flags.module';
import { BanksModule } from './banks/banks.module';
import { ExpensesModule } from './expenses/expenses.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guard/auth.guard';
import { RolesGuard } from './common/guard/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        global: true,
      }),
    }),
    UsersModule,
    EncryptionModule,
    PrismaModule,
    AuthModule,
    CreditCardsModule,
    FlagsModule,
    BanksModule,
    ExpensesModule,
    TokenModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
