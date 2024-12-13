import { PrismaService } from '@/prisma/service/prisma.service';

export class TestSetup {
  private static instance: TestSetup;
  private mockPrisma: jest.SpyInstance | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static getInstance(): TestSetup {
    if (!TestSetup.instance) {
      TestSetup.instance = new TestSetup();
    }
    return TestSetup.instance;
  }

  mockPrismaError(prisma: PrismaService, method: string, entity: string): void {
    if (this.mockPrisma) {
      this.mockPrisma.mockRestore();
    }
    this.mockPrisma = jest
      .spyOn(prisma[entity] as any, method)
      .mockRejectedValue(new Error('Database error'));
  }

  resetMocks(): void {
    if (this.mockPrisma) {
      this.mockPrisma.mockRestore();
      this.mockPrisma = null;
    }
  }
}
