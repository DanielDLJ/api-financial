import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/service/prisma.service';
import { Role } from '@prisma/client';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { VALIDATION_PIPE_OPTIONS } from '@/common/config/validation.config';
import { EncryptionService } from '@/encryption/service/encryption.service';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { CreateUserDto } from '@/users/dto/create-user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let encryptionService: EncryptionService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    encryptionService = app.get<EncryptionService>(EncryptionService);
    jwtService = app.get<JwtService>(JwtService);

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
  describe('POST /users', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .post('/users')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should require admin role', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      const createUserDto: CreateUserDto = {
        email: 'ana@example.com',
        password: 'password123',
        role: Role.USER,
        name: 'ana User',
      };

      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(createUserDto)
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You do not have permission to access this resource',
        });
    });

    it('should create a user', async () => {
      const admin = await createUser(Role.ADMIN);
      const token = await generateToken(admin);

      const createUserDto: CreateUserDto = {
        email: 'ana@example.com',
        password: 'password123',
        role: Role.USER,
        name: 'ana User',
      };

      return request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send(createUserDto)
        .expect(HttpStatus.CREATED);
    });

    it('should return 400 for empty payload', async () => {
      const admin = await createUser(Role.ADMIN);
      const token = await generateToken(admin);

      const response = await request(app.getHttpServer())
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body).toEqual({
        code: ApiErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: expect.arrayContaining([
          'email must be shorter than or equal to 240 characters',
          'email must be an email',
          'email must be a string',
          'name must be shorter than or equal to 240 characters',
          'name must be longer than or equal to 3 characters',
          'name must be a string',
          'password must be shorter than or equal to 240 characters',
          'password must be longer than or equal to 6 characters',
          'password must be a string',
        ]),
      });
    });
  });

  describe('GET /users', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should require admin role', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      return request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You do not have permission to access this resource',
        });
    });

    it('should list users for admin', async () => {
      const admin = await createUser(Role.ADMIN);
      const token = await generateToken(admin);

      const response = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.metaData).toBeDefined();
    });
  });

  describe('GET /users/:id', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .get('/users/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should allow user to get their own profile', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.id).toBe(user.id);
      expect(response.body.email).toBe(user.email);
    });

    it('should not allow user to get other profiles', async () => {
      const user1 = await createUser(Role.USER);
      const user2 = await createUser(Role.USER);
      const user1Token = await generateToken(user1);

      return request(app.getHttpServer())
        .get(`/users/${user2.id}`)
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You can only access your own resources',
        });
    });

    it('should return 404 for non-existent user', async () => {
      const admin = await createUser(Role.ADMIN);
      const token = await generateToken(admin);

      return request(app.getHttpServer())
        .get('/users/999999')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: 'User #999999 not found',
        });
    });
  });

  describe('PATCH /users/:id', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .patch('/users/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should allow user to update their own profile', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const updateData = { name: 'Updated Name' };

      const response = await request(app.getHttpServer())
        .patch(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(HttpStatus.OK);

      expect(response.body.name).toBe(updateData.name);
      expect(response.body.id).toBe(user.id);
    });

    it('should not allow user to update other profiles', async () => {
      const user1 = await createUser(Role.USER);
      const user2 = await createUser(Role.USER);
      const token = await generateToken(user1);

      return request(app.getHttpServer())
        .patch(`/users/${user2.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Name' })
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You can only access your own resources',
        });
    });
  });

  describe('DELETE /users/:id', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .delete('/users/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should allow user to delete their own profile', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const deletedUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      expect(deletedUser.deletedAt).toBeTruthy();
    });

    it('should not allow user to delete other profiles', async () => {
      const user1 = await createUser(Role.USER);
      const user2 = await createUser(Role.USER);
      const tokenUser1 = await generateToken(user1);

      return request(app.getHttpServer())
        .delete(`/users/${user2.id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You can only access your own resources',
        });
    });

    it('should return 404 for deleting a deleted user', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  // Helper functions
  const createUser = async (role: Role) => {
    const password = encryptionService.generateHashPassword('password123');
    return await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        password,
        name: 'Test User',
        role,
      },
    });
  };

  const generateToken = async (user: any) => {
    return jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  };
});
