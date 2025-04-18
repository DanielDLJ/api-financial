import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/service/prisma.service';
import { Role } from '@prisma/client';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { VALIDATION_PIPE_OPTIONS } from '@/common/config/validation.config';
import { EncryptionService } from '@/encryption/service/encryption.service';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let encryptionService: EncryptionService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    encryptionService = app.get<EncryptionService>(EncryptionService);

    app.useGlobalFilters(new HttpExceptionFilter());
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
      const user = await createUser(Role.USER, password);

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: user.email,
          password,
        })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      expect(response.body.user).toEqual({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: Role.USER,
      });
    });

    it('should return error for deleted user', async () => {
      const password = 'password123';
      const user = await createUser(Role.USER, password);
      await deleteUser(user.id);

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: user.email,
          password,
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        code: ApiErrorCode.AUTH_USER_NOT_FOUND,
        message: 'Authentication failed. Please check your email and password.',
      });
    });

    it('should return error for non-existent user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        code: ApiErrorCode.AUTH_USER_NOT_FOUND,
        message: 'Authentication failed. Please check your email and password.',
      });
    });

    it('should return error for invalid password', async () => {
      const password = 'password123';
      const user = await createUser(Role.USER, password);

      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: user.email,
          password: 'wrongpassword',
        })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        code: ApiErrorCode.AUTH_INVALID_CREDENTIALS,
        message: 'Authentication failed. Please check your email and password.',
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: expect.arrayContaining([
          'email must be a string',
          'password must be a string',
        ]),
      });
    });
  });

  describe('/auth/sign-up (POST)', () => {
    it('should create new user', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        name: 'New User',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send(userData)
        .expect(HttpStatus.CREATED);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('refresh_token');
      expect(response.body.user).toMatchObject({
        email: userData.email,
        name: userData.name,
        role: Role.USER,
      });

      // Verify user was created in database
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      expect(user).toBeTruthy();
      expect(user.role).toBe(Role.USER);
    });

    it('should return error for trying to create deleted user', async () => {
      const password = 'password123';
      const user = await createUser(Role.USER, password);
      await deleteUser(user.id);
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({
          email: user.email,
          password,
          name: 'New User',
        })
        .expect(HttpStatus.CONFLICT);
      expect(response.body).toEqual({
        code: ApiErrorCode.AUTH_USER_ALREADY_EXISTS,
        message:
          'This email address is already registered. Please use a different email or try to login.',
      });
    });

    it('should return error for existing email', async () => {
      const password = 'password123';
      const user = await createUser(Role.USER, password);

      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({
          email: user.email,
          password,
          name: 'New User',
        })
        .expect(HttpStatus.CONFLICT);

      expect(response.body).toEqual({
        code: ApiErrorCode.AUTH_USER_ALREADY_EXISTS,
        message:
          'This email address is already registered. Please use a different email or try to login.',
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

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

  describe('/auth/refresh-token (POST)', () => {
    it('should refresh access token with valid refresh token', async () => {
      const password = 'password123';
      const user = await createUser(Role.USER, password);

      // Simulate sign-in to get refresh token
      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: user.email,
          password,
        })
        .expect(HttpStatus.OK);

      const refreshToken = signInResponse.body.refresh_token;

      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .send({ token: refreshToken })
        .expect(HttpStatus.OK);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user).toEqual({
        sub: user.id,
        email: user.email,
        name: user.name,
        role: Role.USER,
      });
    });

    it('should return error for deleted user', async () => {
      const password = 'password123';
      const user = await createUser(Role.USER, password);

      // Simulate sign-in to get refresh token
      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: user.email,
          password,
        })
        .expect(HttpStatus.OK);

      // Delete the user
      await deleteUser(user.id);

      const refreshToken = signInResponse.body.refresh_token;

      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .send({ token: refreshToken })
        .expect(HttpStatus.NOT_FOUND);

      expect(response.body).toEqual({
        code: ApiErrorCode.USER_NOT_FOUND,
        message: `User #${user.id} not found`,
      });
    });

    it('should return error for invalid scope', async () => {
      const password = 'password123';
      const user = await createUser(Role.USER, password);
      const signInResponse = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          email: user.email,
          password,
        })
        .expect(HttpStatus.OK);

      const accessToken = signInResponse.body.access_token;

      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .send({ token: accessToken })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        code: ApiErrorCode.TOKEN_REFRESH_INVALID,
        message: 'Invalid refresh token',
      });
    });

    it('should return error for invalid refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .send({ token: 'invalid-token' })
        .expect(HttpStatus.UNAUTHORIZED);

      expect(response.body).toEqual({
        code: ApiErrorCode.TOKEN_REFRESH_INVALID,
        message: 'Invalid refresh token',
      });
    });

    it('should validate required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: ['token must be a string'],
      });
    });
  });

  // Helper functions
  const createUser = async (role: Role, password: string) => {
    const timestamp = Date.now();
    const hashedPassword = encryptionService.generateHashPassword(password);
    return await prisma.user.create({
      data: {
        email: `test-${timestamp}-${Math.random()
          .toString(36)
          .substring(7)}@example.com`,
        password: hashedPassword,
        name: `Test User ${timestamp}`,
        role,
      },
    });
  };

  const deleteUser = async (id: number) => {
    const data = {
      deletedAt: new Date(),
    };
    return await prisma.user.update({ where: { id }, data });
  };
});
