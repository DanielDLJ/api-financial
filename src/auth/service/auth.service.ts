import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/service/users.service';
import { EncryptionService } from '../../encryption/service/encryption.service';
import { SignUpDto } from '../dto/sign-up.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException();

    const isMatch = await this.encryptionService.compareHashPassword(
      pass,
      user?.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, id: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const userExists = await this.usersService.findByEmail(signUpDto.email);

    if (userExists) throw new UnauthorizedException();

    const createUserDto: CreateUserDto = {
      email: signUpDto.email,
      name: signUpDto.name,
      password: signUpDto.password,
      role: Role.USER,
    };
    const user = await this.usersService.create(createUserDto);

    const payload = { email: user.email, id: user.id, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
