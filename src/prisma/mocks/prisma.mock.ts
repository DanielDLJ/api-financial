import { PrismaClient } from '@prisma/client';

export class MockPrismaClient
  implements Pick<PrismaClient, '$connect' | '$disconnect' | '$on'>
{
  $connect = jest.fn();
  $disconnect = jest.fn();
  $on = jest.fn();
}

export const mockPrismaService = {
  provide: PrismaClient,
  useClass: MockPrismaClient,
};
