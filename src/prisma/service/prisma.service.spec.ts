import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { MockPrismaClient } from '../mocks/prisma.mock';
import { PrismaClient } from '@prisma/client';

describe('PrismaService', () => {
  let prismaService: PrismaService;
  let mockPrismaClient: MockPrismaClient;
  let processOnSpy: jest.SpyInstance;
  let originalEnv: string | undefined;

  beforeAll(() => {
    originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
  });

  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });

  beforeEach(async () => {
    const mockClient = new MockPrismaClient();
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaClient,
          useValue: mockClient,
        },
        PrismaService,
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    mockPrismaClient = mockClient;
    processOnSpy = jest.spyOn(process, 'on');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not connect to prisma on module init when in test environment', async () => {
    await prismaService.onModuleInit();
    expect(mockPrismaClient.$connect).not.toHaveBeenCalled();
  });

  it('should setup shutdown hooks using process.on', async () => {
    const mockApp = {
      close: jest.fn(),
    };

    await prismaService.enableShutdownHooks(mockApp as any);
    expect(processOnSpy).toHaveBeenCalledWith(
      'beforeExit',
      expect.any(Function),
    );
  });
});
