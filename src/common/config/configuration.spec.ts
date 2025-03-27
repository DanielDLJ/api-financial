import { configuration } from './configuration';

describe('Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    process.env = {
      NODE_ENV: 'test',
      PORT: '3001',
      DB_HOST: 'localhost',
      DB_PORT: '3306',
      DB_USER: 'root',
      DB_PASS: 'password',
      DB_NAME: 'test_db',
      JWT_ACCESS_SECRET: 'access-secret',
      JWT_ACCESS_EXPIRES_IN: '15m',
      JWT_REFRESH_SECRET: 'refresh-secret',
      JWT_REFRESH_EXPIRES_IN: '7d',
      ENCRYPTION_SECRET_KEY: 'encryption-key',
      ENCRYPTION_IV_LENGTH: '16',
      ENCRYPTION_SALT: '10',
      SWAGGER_TITLE: 'API Test',
      SWAGGER_DESCRIPTION: 'Test Description',
      SWAGGER_VERSION: '1.0',
      SWAGGER_CONTACT_NAME: 'Test User',
      SWAGGER_CONTACT_EMAIL: 'test@example.com',
      SWAGGER_ENABLE: 'true',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('app config', () => {
    it('should return correct app configuration', () => {
      const config = configuration();

      expect(config.app).toEqual({
        nodeEnv: 'test',
        port: 3001,
      });
    });

    it('should use default port when PORT is not set', () => {
      delete process.env.PORT;
      const config = configuration();

      expect(config.app.port).toBe(8080);
    });
  });

  describe('database config', () => {
    it('should return correct database configuration', () => {
      const config = configuration();

      expect(config.database).toEqual({
        host: 'localhost',
        port: 3306,
        user: 'root',
        pass: 'password',
        name: 'test_db',
      });
    });

    it('should parse DB_PORT as number', () => {
      process.env.DB_PORT = '5432';
      const config = configuration();

      expect(config.database.port).toBe(5432);
    });
  });

  describe('jwt config', () => {
    it('should return correct jwt configuration', () => {
      const config = configuration();

      expect(config.jwt).toEqual({
        access: {
          secret: 'access-secret',
          expiresIn: '15m',
        },
        refresh: {
          secret: 'refresh-secret',
          expiresIn: '7d',
        },
      });
    });
  });

  describe('encryption config', () => {
    it('should return correct encryption configuration', () => {
      const config = configuration();

      expect(config.encryption).toEqual({
        secretKey: 'encryption-key',
        ivLength: 16,
        salt: 10,
      });
    });

    it('should parse numeric values correctly', () => {
      process.env.ENCRYPTION_IV_LENGTH = '32';
      process.env.ENCRYPTION_SALT = '12';

      const config = configuration();

      expect(config.encryption.ivLength).toBe(32);
      expect(config.encryption.salt).toBe(12);
    });
  });

  describe('swagger config', () => {
    it('should return correct swagger configuration', () => {
      const config = configuration();

      expect(config.swagger).toEqual({
        title: 'API Test',
        description: 'Test Description',
        version: '1.0',
        contact: {
          name: 'Test User',
          email: 'test@example.com',
        },
        enable: true,
      });
    });

    it('should parse SWAGGER_ENABLE as boolean', () => {
      process.env.SWAGGER_ENABLE = 'false';
      const config = configuration();

      expect(config.swagger.enable).toBe(false);
    });

    it('should use default values when swagger env vars are not set', () => {
      delete process.env.SWAGGER_TITLE;
      delete process.env.SWAGGER_DESCRIPTION;
      delete process.env.SWAGGER_VERSION;
      delete process.env.SWAGGER_CONTACT_NAME;
      delete process.env.SWAGGER_CONTACT_EMAIL;
      delete process.env.SWAGGER_ENABLE;

      const config = configuration();

      expect(config.swagger).toEqual({
        title: 'API',
        description: 'API Description',
        version: '1.0.0',
        contact: {
          name: '',
          email: '',
        },
        enable: false,
      });
    });
  });
});
