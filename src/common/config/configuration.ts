export const configuration = () => {
  return {
    port: Number(process.env.PORT) || 8080,
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
      title: process.env.SWAGGER_TITLE,
      description: process.env.SWAGGER_DESCRIPTION,
      version: process.env.SWAGGER_VERSION,
      contact: {
        name: process.env.SWAGGER_CONTACT_NAME,
        email: process.env.SWAGGER_CONTACT_EMAIL,
      },
      enable: process.env.SWAGGER_ENABLE === 'true',
    },
  };
};
