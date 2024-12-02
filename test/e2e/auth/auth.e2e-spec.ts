import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PrismaService } from '../../../src/prisma/service/prisma.service';
import { EncryptionService } from '../../../src/encryption/service/encryption.service';
import { createTestingApp } from '../../helpers/test.helper';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let encryptionService: EncryptionService;

  beforeAll(async () => {
    const testApp = await createTestingApp();
    app = testApp.app;
    prisma = testApp.prisma;
    encryptionService =
      testApp.moduleRef.get<EncryptionService>(EncryptionService);
  });

  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/auth/login (POST)', async () => {
    const password = 'password123';
    const hashedPassword = encryptionService.generateHashPassword(password);

    await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
      },
    });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: password });

    expect(response.status).toBe(200);
    expect(response.body.access_token).toBeDefined();
    expect(response.body.refresh_token).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('/auth/login (POST) - invalid password', async () => {
    const password = 'password123';
    const hashedPassword = encryptionService.generateHashPassword(password);

    await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
      },
    });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'wrong_password' })
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toBe('Unauthorized');
      });
  });
});
