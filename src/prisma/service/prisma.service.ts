import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { ApiException } from '@/common/exceptions/api.exception';
import {
  HttpStatus,
  INestApplication,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    if (process.env.NODE_ENV === 'test') return;
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  handleGenericDatabaseError(service: string, operation: string, error: any) {
    throw new ApiException({
      code: ApiErrorCode.DATABASE_ERROR,
      message: 'Database operation failed',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      details: {
        service,
        operation,
        error: `Database error (code: ${error.code})`,
      },
    });
  }
}
