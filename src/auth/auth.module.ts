import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './service/auth.service';
import { EncryptionModule } from '../encryption/encryption.module';
import { ErrorInterceptor } from '../common/interceptors/error.interceptor';
import { ValidationInterceptor } from '../common/interceptors/validation.interceptor';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    EncryptionModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          global: true,
          secret: config.getOrThrow<string>('jwt.secret'),
          signOptions: {
            expiresIn: config.getOrThrow<string>('jwt.expiresIn'),
          },
        };
      },
    }),
  ],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ValidationInterceptor,
    },
  ],
})
export class AuthModule {}
