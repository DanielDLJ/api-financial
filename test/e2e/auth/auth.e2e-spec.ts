import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../../src/app.module';
import { PrismaService } from '../../../src/prisma/service/prisma.service';
import { Role } from '@prisma/client';
import { ApiErrorCode } from '../../../src/common/enums/api-error-codes.enum';
import { EncryptionModule } from '../../../src/encryption/encryption.module';
import { EncryptionService } from '../../../src/encryption/service/encryption.service';
import { VALIDATION_PIPE_OPTIONS } from '../../../src/common/config/validation.config';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let encryptionService: EncryptionService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, EncryptionModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    encryptionService = app.get<EncryptionService>(EncryptionService);

    app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));

    await app.init();
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('/auth/sign-in (POST)', () => {
    it('should authenticate user with valid credentials', async () => {
      const password = 'password123';
      const email = 'test@example.com';
      const hashedPassword = encryptionService.generateHashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Test User',
          role: Role.USER,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email,
          password,
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      expect(response.body.user).toEqual({
        id: user.id,
        email: user.email,
        name: user.name,
        role: Role.USER,
      });
    });

    it('should return error for non-existent user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body).toEqual({
        code: ApiErrorCode.AUTH_USER_NOT_FOUND,
        message: 'User not found',
      });
    });

    it('should return error for invalid password', async () => {
      const password = 'password123';
      const hashedPassword = encryptionService.generateHashPassword(password);
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Test User',
          role: Role.USER,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toEqual({
        code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
        message: 'Invalid credentials',
      });
    });
  });

  describe('/auth/sign-up (POST)', () => {
    it('should create new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({
          email: 'newuser@example.com',
          password: 'password123',
          name: 'New User',
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      expect(response.body.user).toMatchObject({
        email: 'newuser@example.com',
        name: 'New User',
        role: Role.USER,
      });
    });

    it('should return error for existing email', async () => {
      const password = 'password123';
      const hashedPassword = encryptionService.generateHashPassword(password);
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          password: hashedPassword,
          name: 'Existing User',
          role: Role.USER,
        },
      });

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({
          email: 'existing@example.com',
          password: password,
          name: 'New User',
        })
        .expect(409);

      expect(response.body).toEqual({
        code: ApiErrorCode.AUTH_USER_ALREADY_EXISTS,
        message: 'User already exists.',
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({})
        .expect(400);

      expect(response.body).toEqual({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: expect.arrayContaining([
          'email must be a string',
          'password must be a string',
          'name must be a string',
        ]),
      });
    });
  });
});
