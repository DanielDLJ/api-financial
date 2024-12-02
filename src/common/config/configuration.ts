export const configuration = () => {
  return {
    port: Number(process.env.PORT) || 8080,
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN,
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
