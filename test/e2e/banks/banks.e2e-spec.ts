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

describe('BanksController (e2e)', () => {
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
    await prisma.bank.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.bank.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('GET /banks', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .get('/banks')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should list banks for admin user', async () => {
      const user = await createUser(Role.ADMIN);
      const token = await generateToken(user);

      const response = await request(app.getHttpServer())
        .get('/banks')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.metaData).toBeDefined();
      expect(response.body.metaData.total).toBe(0);
    });

    it('should list banks for user', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      // Create some banks
      await prisma.bank.createMany({
        data: [
          { name: 'Bank A', fullName: 'Bank A Full', code: 1, ispb: 1 },
          { name: 'Bank B', fullName: 'Bank B Full', code: 2, ispb: 2 },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/banks')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.metaData).toBeDefined();
      expect(response.body.metaData.total).toBe(2);
    });

    it('should filter banks by name', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      await prisma.bank.createMany({
        data: [
          { name: 'Bank A', fullName: 'Bank A Full', code: 1, ispb: 1 },
          { name: 'Bank B', fullName: 'Bank B Full', code: 2, ispb: 2 },
          { name: 'Bank C', fullName: 'Bank C Full', code: 3, ispb: 3 },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/banks?name=Bank A')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Bank A');
    });

    it('should filter banks by fullName', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      await prisma.bank.createMany({
        data: [
          { name: 'Bank A', fullName: 'Bank A Full', code: 1, ispb: 1 },
          { name: 'Bank B', fullName: 'Bank B Full', code: 2, ispb: 2 },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/banks?fullName=A Full')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].fullName).toBe('Bank A Full');
    });

    it('should filter banks by code', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      await prisma.bank.createMany({
        data: [
          { name: 'Bank A', fullName: 'Bank A Full', code: 1, ispb: 1 },
          { name: 'Bank B', fullName: 'Bank B Full', code: 2, ispb: 2 },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/banks?code=1')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].code).toBe(1);
    });

    it('should handle pagination', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      // Create multiple banks
      await prisma.bank.createMany({
        data: Array(15)
          .fill(0)
          .map((_, i) => ({
            name: `Bank ${i + 1}`,
            fullName: `Bank ${i + 1} Full`,
            code: i + 1,
            ispb: i + 1,
          })),
      });

      const response = await request(app.getHttpServer())
        .get('/banks?page=2&limit=10')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toHaveLength(5);
      expect(response.body.metaData.page).toBe(2);
      expect(response.body.metaData.limit).toBe(10);
      expect(response.body.metaData.total).toBe(15);
      expect(response.body.metaData.totalPages).toBe(2);
    });
  });

  describe('GET /banks/:id', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .get('/banks/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return a bank by id', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/banks/${bank.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.id).toBe(bank.id);
      expect(response.body.name).toBe(bank.name);
      expect(response.body.fullName).toBe(bank.fullName);
      expect(response.body.code).toBe(bank.code);
    });

    it('should return 404 for non-existent bank', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      return request(app.getHttpServer())
        .get('/banks/999999')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.BANK_NOT_FOUND,
          message: 'Bank #999999 not found',
        });
    });

    it('should not return deleted banks by default', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      const bank = await prisma.bank.create({
        data: {
          name: 'Deleted Bank',
          fullName: 'Deleted Bank Full',
          code: 1,
          ispb: 1,
          deletedAt: new Date(),
        },
      });

      return request(app.getHttpServer())
        .get(`/banks/${bank.id}`)
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
