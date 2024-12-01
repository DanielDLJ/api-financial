import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

function configSwagger(app: INestApplication) {
  const configService = app.get(ConfigService);

  const documentBuilder = new DocumentBuilder()
    .setTitle(configService.getOrThrow<string>('swagger.title'))
    .setDescription(configService.getOrThrow<string>('swagger.description'))
    .setContact(
      configService.getOrThrow<string>('swagger.contact.name'),
      '',
      configService.getOrThrow<string>('swagger.contact.email'),
    )
    .setVersion(configService.getOrThrow<string>('swagger.version'))
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);
  SwaggerModule.setup('swagger', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  if (configService.getOrThrow<boolean>('swagger.enable')) {
    configSwagger(app);
  }
  const corsOptions = {
    // origin: 'http://meu-app-react-native.com', // Allow only this origin
    optionsSuccessStatus: 200, // Some old browsers (IE11, some SmartTVs) cannot handle 204
  };
  app.enableCors(corsOptions);

  await app.listen(configService.getOrThrow<number>('port'));
}
bootstrap();
