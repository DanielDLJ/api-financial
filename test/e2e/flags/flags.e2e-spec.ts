import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/service/prisma.service';
import { Role } from '@prisma/client';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { VALIDATION_PIPE_OPTIONS } from '@/common/config/validation.config';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from '@/common/filters/http-exception.filter';
import { EncryptionService } from '@/encryption/service/encryption.service';

describe('FlagsController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let encryptionService: EncryptionService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
    encryptionService = app.get<EncryptionService>(EncryptionService);

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));

    await app.init();
  });

  beforeEach(async () => {
    await prisma.flag.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.flag.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('GET /flags', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .get('/flags')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should list flags for admin user', async () => {
      const user = await createUser(Role.ADMIN);
      const token = await generateToken(user);

      const response = await request(app.getHttpServer())
        .get('/flags')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.metaData).toBeDefined();
      expect(response.body.metaData.total).toBe(0);
    });

    it('should list flags for user', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      // Create some flags
      await prisma.flag.createMany({
        data: [{ name: 'Visa' }, { name: 'Mastercard' }],
      });

      const response = await request(app.getHttpServer())
        .get('/flags')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.metaData).toBeDefined();
      expect(response.body.metaData.total).toBe(2);
    });

    it('should handle pagination', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      // Create multiple flags
      await prisma.flag.createMany({
        data: Array(15)
          .fill(0)
          .map((_, i) => ({ name: `Flag ${i + 1}` })),
      });

      const response = await request(app.getHttpServer())
        .get('/flags?page=2&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.metaData.page).toBe(2);
      expect(response.body.metaData.limit).toBe(10);
      expect(response.body.metaData.total).toBe(15);
      expect(response.body.metaData.totalPages).toBe(2);
    });
  });

  describe('GET /flags/:id', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .get('/flags/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return a flag by id', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      const flag = await prisma.flag.create({
        data: { name: 'Visa' },
      });

      const response = await request(app.getHttpServer())
        .get(`/flags/${flag.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.id).toBe(flag.id);
      expect(response.body.name).toBe(flag.name);
    });

    it('should return 404 for non-existent flag', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      return request(app.getHttpServer())
        .get('/flags/999999')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.FLAG_NOT_FOUND,
          message: 'Flag #999999 not found',
        });
    });

    it('should not return deleted flags by default', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      const flag = await prisma.flag.create({
        data: {
          name: 'Deleted Flag',
          deletedAt: new Date(),
        },
      });

      return request(app.getHttpServer())
        .get(`/flags/${flag.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND);
    });
  });

  // Helper functions
  const createUser = async (role: Role) => {
    const timestamp = Date.now();
    const password = 'password123';
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

  const generateToken = async (user: any) => {
    return jwtService.signAsync({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  };
});
