import { join } from 'path';
import { config } from 'dotenv';
import { execSync } from 'child_process';

config({ path: join(__dirname, '../../.env.test') });

beforeAll(async () => {
  try {
    execSync('npx prisma migrate deploy', {
      stdio: 'inherit',
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });
  } catch (error) {
    console.error('Error deploying migrations:', error);
    throw error;
  }
});

jest.setTimeout(60000);
