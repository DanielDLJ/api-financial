import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EncryptionService {
  private readonly algorithm: string = 'aes-256-cbc';
  private readonly key: string;
  private readonly ivLength: number;
  private readonly salt: number;

  constructor(private readonly configService: ConfigService) {
    this.key = this.configService.getOrThrow<string>('encryption.secretKey');
    this.ivLength = this.configService.getOrThrow<number>(
      'encryption.ivLength',
    );
    this.salt = this.configService.getOrThrow<number>('encryption.salt');
  }

  encrypt(text: string): string {
    const iv = randomBytes(this.ivLength);
    const cipher = createCipheriv(this.algorithm, Buffer.from(this.key), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(text: string): string {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = createDecipheriv(
      this.algorithm,
      Buffer.from(this.key),
      iv,
    );
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  }

  generateHashPassword(password: string): string {
    if (!password)
      throw new InternalServerErrorException('Password is required');
    return bcrypt.hashSync(password, this.salt);
  }

  compareHashPassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    if (!password || !hashPassword) {
      throw new InternalServerErrorException(
        'Problem to validate password, please try again',
      );
    }

    return bcrypt.compareSync(password, hashPassword);
  }
}
