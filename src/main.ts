import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { VALIDATION_PIPE_OPTIONS } from './common/config/validation.config';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
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

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));
  app.useGlobalFilters(new HttpExceptionFilter());

  if (configService.getOrThrow<boolean>('swagger.enable')) {
    configSwagger(app);
  }

  app.enableCors();

  const port = configService.getOrThrow<number>('port');
  await app.listen(port, '0.0.0.0', () => {
    console.log('Server is running on port', port);
  });
}
bootstrap();
