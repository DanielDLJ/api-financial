interface Config {
  app: {
    nodeEnv: string;
    port: number;
  };
  database: {
    host: string;
    port: number;
    user: string;
    pass: string;
    name: string;
  };
  jwt: {
    access: { secret: string; expiresIn: string };
    refresh: { secret: string; expiresIn: string };
  };
  encryption: {
    secretKey: string;
    ivLength: number;
    salt: number;
  };
  swagger: {
    title: string;
    description: string;
    version: string;
    contact: { name: string; email: string };
    enable: boolean;
  };
}

export const configuration = (): Config => {
  return {
    app: {
      nodeEnv: process.env.NODE_ENV,
      port: Number(process.env.PORT) || 8080,
    },
    database: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      name: process.env.DB_NAME,
    },
    jwt: {
      access: {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      },
    },
    encryption: {
      secretKey: process.env.ENCRYPTION_SECRET_KEY,
      ivLength: Number(process.env.ENCRYPTION_IV_LENGTH),
      salt: Number(process.env.ENCRYPTION_SALT),
    },
    swagger: {
      title: process.env.SWAGGER_TITLE || 'API',
      description: process.env.SWAGGER_DESCRIPTION || 'API Description',
      version: process.env.SWAGGER_VERSION || '1.0.0',
      contact: {
        name: process.env.SWAGGER_CONTACT_NAME || '',
        email: process.env.SWAGGER_CONTACT_EMAIL || '',
      },
      enable: process.env.SWAGGER_ENABLE === 'true',
    },
  };
};
