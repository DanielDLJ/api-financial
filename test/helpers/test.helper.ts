import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/service/prisma.service';

export async function createTestingApp() {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  return {
    app,
    moduleRef,
    prisma: moduleRef.get<PrismaService>(PrismaService),
  };
}
