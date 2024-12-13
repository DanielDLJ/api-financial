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
import { CreateCreditCardDto } from '@/credit-cards/dto/create-credit-card.dto';
import { TestSetup } from '../../config/setupFiles';

describe('CreditCardsController (e2e)', () => {
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
    await prisma.creditCard.deleteMany();
    await prisma.bank.deleteMany();
    await prisma.flag.deleteMany();
    await prisma.user.deleteMany();
    TestSetup.getInstance().resetMocks();
  });

  afterAll(async () => {
    await prisma.creditCard.deleteMany();
    await prisma.bank.deleteMany();
    await prisma.flag.deleteMany();
    await prisma.user.deleteMany();
    await app.close();
  });

  describe('POST /users/:userId/credit-cards', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .post('/users/1/credit-cards')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should create a credit card', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });

      const createDto: CreateCreditCardDto = {
        cardName: 'Test Card',
        bankId: bank.id,
        flagId: flag.id,
        dueDate: 10,
        closingDate: 5,
        creditLimit: 1000,
      };

      const response = await request(app.getHttpServer())
        .post(`/users/${user.id}/credit-cards`)
        .set('Authorization', `Bearer ${token}`)
        .send(createDto)
        .expect(HttpStatus.CREATED);

      expect(response.body).toMatchObject({
        cardName: createDto.cardName,
        userId: user.id,
        bank: expect.objectContaining({ id: bank.id }),
        flag: expect.objectContaining({ id: flag.id }),
      });
    });

    it('should not allow creating card for another user', async () => {
      const user1 = await createUser(Role.USER);
      const user2 = await createUser(Role.USER);
      const tokenUser1 = await generateToken(user1);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });

      const createDto: CreateCreditCardDto = {
        cardName: 'Test Card',
        bankId: bank.id,
        flagId: flag.id,
        dueDate: 10,
        closingDate: 5,
        creditLimit: 1000,
      };

      return request(app.getHttpServer())
        .post(`/users/${user2.id}/credit-cards`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send(createDto)
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You can only access your own resources',
        });
    });

    it('should not allow creating card with invalid user id', async () => {
      const user = await createUser(Role.ADMIN);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });

      const createDto: CreateCreditCardDto = {
        cardName: 'Test Card',
        bankId: bank.id,
        flagId: flag.id,
        dueDate: 10,
        closingDate: 5,
        creditLimit: 1000,
      };

      return request(app.getHttpServer())
        .post(`/users/999999/credit-cards`)
        .set('Authorization', `Bearer ${token}`)
        .send(createDto)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.USER_NOT_FOUND,
          message: 'User #999999 not found',
        });
    });

    it('should not allow creating card with invalid bank id', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });

      const createDto: CreateCreditCardDto = {
        cardName: 'Test Card',
        bankId: 999999,
        flagId: flag.id,
        dueDate: 10,
        closingDate: 5,
        creditLimit: 1000,
      };

      return request(app.getHttpServer())
        .post(`/users/${user.id}/credit-cards`)
        .set('Authorization', `Bearer ${token}`)
        .send(createDto)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.BANK_NOT_FOUND,
          message: 'Bank #999999 not found',
        });
    });

    it('should not allow creating card with invalid flag id', async () => {
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

      const createDto: CreateCreditCardDto = {
        cardName: 'Test Card',
        bankId: bank.id,
        flagId: 999999,
        dueDate: 10,
        closingDate: 5,
        creditLimit: 1000,
      };

      return request(app.getHttpServer())
        .post(`/users/${user.id}/credit-cards`)
        .set('Authorization', `Bearer ${token}`)
        .send(createDto)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.FLAG_NOT_FOUND,
          message: 'Flag #999999 not found',
        });
    });

    it('should not allow creating card with duplicate card name', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      const createDto: CreateCreditCardDto = {
        cardName: 'Test Card',
        bankId: bank.id,
        flagId: flag.id,
        dueDate: 10,
        closingDate: 5,
        creditLimit: 1000,
      };

      return request(app.getHttpServer())
        .post(`/users/${user.id}/credit-cards`)
        .set('Authorization', `Bearer ${token}`)
        .send(createDto)
        .expect(HttpStatus.CONFLICT)
        .expect({
          code: ApiErrorCode.CARD_NAME_ALREADY_EXISTS,
          message: 'Card name already exists for this user',
        });
    });

    it('should allow duplicate card name for different users', async () => {
      const user1 = await createUser(Role.USER);
      const user2 = await createUser(Role.USER);
      const tokenUser2 = await generateToken(user2);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user1.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      const createDto: CreateCreditCardDto = {
        cardName: 'Test Card',
        bankId: bank.id,
        flagId: flag.id,
        dueDate: 10,
        closingDate: 5,
        creditLimit: 1000,
      };

      return request(app.getHttpServer())
        .post(`/users/${user2.id}/credit-cards`)
        .set('Authorization', `Bearer ${tokenUser2}`)
        .send(createDto)
        .expect(HttpStatus.CREATED);
    });

    it('should return 500 when creating card fails', async () => {
      const user = await createUser(Role.ADMIN);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });

      TestSetup.getInstance().mockPrismaError(prisma, 'create', 'creditCard');

      const createDto: CreateCreditCardDto = {
        cardName: 'Test Card',
        bankId: bank.id,
        flagId: flag.id,
        dueDate: 10,
        closingDate: 5,
        creditLimit: 1000,
      };

      return request(app.getHttpServer())
        .post(`/users/${user.id}/credit-cards`)
        .set('Authorization', `Bearer ${token}`)
        .send(createDto)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect({
          code: ApiErrorCode.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred while processing your request',
          details: 'Database error',
        });
    });
  });

  describe('GET /users/:userId/credit-cards', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .get('/users/1/credit-cards')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should list user credit cards', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}/credit-cards`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]).toMatchObject({
        cardName: 'Test Card',
        userId: user.id,
      });
    });

    it('should not list other user credit cards', async () => {
      const user1 = await createUser(Role.USER);
      const user2 = await createUser(Role.USER);
      const tokenUser1 = await generateToken(user1);

      return request(app.getHttpServer())
        .get(`/users/${user2.id}/credit-cards`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You can only access your own resources',
        });
    });

    it('should allow admin to list any user credit cards', async () => {
      const admin = await createUser(Role.ADMIN);
      const user = await createUser(Role.USER);
      const tokenAdmin = await generateToken(admin);

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}/credit-cards`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(HttpStatus.OK);

      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.metaData).toBeDefined();
    });

    it('should return 500 when fetching credit cards fails', async () => {
      const user = await createUser(Role.ADMIN);
      const token = await generateToken(user);

      TestSetup.getInstance().mockPrismaError(prisma, 'findMany', 'creditCard');

      return request(app.getHttpServer())
        .get(`/users/${user.id}/credit-cards`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect({
          code: ApiErrorCode.INTERNAL_SERVER_ERROR,
          message: 'Error fetching credit cards',
          details: 'Database error',
        });
    });
  });

  describe('GET /users/:userId/credit-cards/:creditCardId', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .get('/users/1/credit-cards/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should get credit card by id', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCard = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}/credit-cards/${creditCard.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: creditCard.id,
        cardName: creditCard.cardName,
        userId: user.id,
      });
    });

    it('should allow admin to get any user credit card', async () => {
      const admin = await createUser(Role.ADMIN);
      const user = await createUser(Role.USER);
      const tokenAdmin = await generateToken(admin);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCard = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/users/${user.id}/credit-cards/${creditCard.id}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: creditCard.id,
        cardName: creditCard.cardName,
        userId: user.id,
      });
    });

    it('should not get other user credit card', async () => {
      const user1 = await createUser(Role.USER);
      const user2 = await createUser(Role.USER);
      const tokenUser1 = await generateToken(user1);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCardUser2 = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user2.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      return request(app.getHttpServer())
        .get(`/users/${user1.id}/credit-cards/${creditCardUser2.id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: `Credit card #${creditCardUser2.id} not found`,
        });
    });

    it('should return 404 for non-existent credit card', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      return request(app.getHttpServer())
        .get(`/users/${user.id}/credit-cards/999999`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: 'Credit card #999999 not found',
        });
    });

    it('should return 404 for non-existent user', async () => {
      const admin = await createUser(Role.ADMIN);
      const tokenAdmin = await generateToken(admin);

      return request(app.getHttpServer())
        .get('/users/999999/credit-cards/900000')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: `Credit card #900000 not found`,
        });
    });

    it('should return 500 when fetching credit card fails', async () => {
      const user = await createUser(Role.ADMIN);
      const token = await generateToken(user);

      TestSetup.getInstance().mockPrismaError(
        prisma,
        'findUnique',
        'creditCard',
      );

      return request(app.getHttpServer())
        .get(`/users/${user.id}/credit-cards/999999`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect({
          code: ApiErrorCode.INTERNAL_SERVER_ERROR,
          message: 'Error fetching credit card',
          details: 'Database error',
        });
    });
  });

  describe('PATCH /users/:userId/credit-cards/:creditCardId', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .patch('/users/1/credit-cards/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should update a credit card', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCard = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      const updateDto = {
        cardName: 'Updated Card',
        dueDate: 15,
        closingDate: 10,
        creditLimit: 2000,
      };

      const response = await request(app.getHttpServer())
        .patch(`/users/${user.id}/credit-cards/${creditCard.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateDto)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: creditCard.id,
        ...updateDto,
        userId: user.id,
      });
    });

    it('should not update other user credit card', async () => {
      const user1 = await createUser(Role.USER);
      const user2 = await createUser(Role.USER);
      const tokenUser1 = await generateToken(user1);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCard = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user2.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      return request(app.getHttpServer())
        .patch(`/users/${user2.id}/credit-cards/${creditCard.id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .send({ cardName: 'Updated Card' })
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You can only access your own resources',
        });
    });

    it('should allow admin to update any user credit card', async () => {
      const admin = await createUser(Role.ADMIN);
      const user = await createUser(Role.USER);
      const tokenAdmin = await generateToken(admin);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCard = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      const updateDto = { cardName: 'Admin Updated Card' };

      const response = await request(app.getHttpServer())
        .patch(`/users/${user.id}/credit-cards/${creditCard.id}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .send(updateDto)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: creditCard.id,
        ...updateDto,
        userId: user.id,
      });
    });

    it('should not allow updating card with invalid bank id', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCard = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      return request(app.getHttpServer())
        .patch(`/users/${user.id}/credit-cards/${creditCard.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ bankId: 999999 })
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.BANK_NOT_FOUND,
          message: 'Bank #999999 not found',
        });
    });

    it('should not allow updating card with invalid flag id', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCard = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      return request(app.getHttpServer())
        .patch(`/users/${user.id}/credit-cards/${creditCard.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ flagId: 999999 })
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.FLAG_NOT_FOUND,
          message: 'Flag #999999 not found',
        });
    });

    it('should not allow update card with duplicate card name', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCard1 = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });
      const creditCard2 = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card 2',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      return request(app.getHttpServer())
        .patch(`/users/${user.id}/credit-cards/${creditCard2.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ cardName: creditCard1.cardName })
        .expect(HttpStatus.CONFLICT)
        .expect({
          code: ApiErrorCode.CARD_NAME_ALREADY_EXISTS,
          message: 'Card name already exists for this user',
        });
    });

    it('should allow duplicate card name for different users', async () => {
      const user1 = await createUser(Role.USER);
      const user2 = await createUser(Role.USER);
      const tokenUser2 = await generateToken(user2);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user1.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });
      const creditCard2 = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card 2',
          userId: user2.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      return request(app.getHttpServer())
        .patch(`/users/${user2.id}/credit-cards/${creditCard2.id}`)
        .set('Authorization', `Bearer ${tokenUser2}`)
        .send({ cardName: 'Test Card' })
        .expect(HttpStatus.OK);
    });

    it('should return 404 for non-existent credit card', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      return request(app.getHttpServer())
        .patch(`/users/${user.id}/credit-cards/999999`)
        .set('Authorization', `Bearer ${token}`)
        .send({ cardName: 'Updated Card' })
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: 'Credit card #999999 not found',
        });
    });

    it('should return 500 when updating credit card fails', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCard = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      TestSetup.getInstance().mockPrismaError(prisma, 'update', 'creditCard');

      return request(app.getHttpServer())
        .patch(`/users/${user.id}/credit-cards/${creditCard.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ cardName: 'Updated Card' })
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect({
          code: ApiErrorCode.INTERNAL_SERVER_ERROR,
          message: 'An unexpected error occurred while processing your request',
          details: 'Database error',
        });
    });
  });

  describe('DELETE /users/:userId/credit-cards/:creditCardId', () => {
    it('should require authentication', () => {
      return request(app.getHttpServer())
        .delete('/users/1/credit-cards/1')
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should soft delete a credit card', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });

      const creditCard = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/users/${user.id}/credit-cards/${creditCard.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: creditCard.id,
        deletedAt: expect.any(String),
      });

      // Verify card is not returned in normal queries
      const listResponse = await request(app.getHttpServer())
        .get(`/users/${user.id}/credit-cards`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      expect(listResponse.body.data).toHaveLength(0);
    });

    it('should not delete other user credit card', async () => {
      const user1 = await createUser(Role.USER);
      const user2 = await createUser(Role.USER);
      const tokenUser1 = await generateToken(user1);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCardUser2 = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user2.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      return request(app.getHttpServer())
        .delete(`/users/${user2.id}/credit-cards/${creditCardUser2.id}`)
        .set('Authorization', `Bearer ${tokenUser1}`)
        .expect(HttpStatus.FORBIDDEN)
        .expect({
          code: ApiErrorCode.FORBIDDEN,
          message: 'You can only access your own resources',
        });
    });

    it('should allow admin to delete any user credit card', async () => {
      const admin = await createUser(Role.ADMIN);
      const user = await createUser(Role.USER);
      const tokenAdmin = await generateToken(admin);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCardUser1 = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      const response = await request(app.getHttpServer())
        .delete(`/users/${user.id}/credit-cards/${creditCardUser1.id}`)
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .expect(HttpStatus.OK);

      expect(response.body).toMatchObject({
        id: creditCardUser1.id,
        deletedAt: expect.any(String),
      });
    });

    it('should return 404 for non-existent credit card', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);

      return request(app.getHttpServer())
        .delete(`/users/${user.id}/credit-cards/999999`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.NOT_FOUND)
        .expect({
          code: ApiErrorCode.CREDIT_CARD_NOT_FOUND,
          message: 'Credit card #999999 not found',
        });
    });

    it('should return 500 when deleting credit card fails', async () => {
      const user = await createUser(Role.USER);
      const token = await generateToken(user);
      const flag = await prisma.flag.create({ data: { name: 'Test Flag' } });
      const bank = await prisma.bank.create({
        data: {
          name: 'Test Bank',
          fullName: 'Test Bank Full',
          code: 1,
          ispb: 1,
        },
      });
      const creditCard = await prisma.creditCard.create({
        data: {
          cardName: 'Test Card',
          userId: user.id,
          bankId: bank.id,
          flagId: flag.id,
          dueDate: 10,
          closingDate: 5,
          creditLimit: 1000,
        },
      });

      TestSetup.getInstance().mockPrismaError(prisma, 'update', 'creditCard');

      return request(app.getHttpServer())
        .delete(`/users/${user.id}/credit-cards/${creditCard.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR)
        .expect({
          code: ApiErrorCode.INTERNAL_SERVER_ERROR,
          message: 'Error removing credit card',
          details: 'Database error',
        });
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
