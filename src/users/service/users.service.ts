import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UsersRepository } from '../repository/user.repository';
import { EncryptionService } from '@/encryption/service/encryption.service';
import { ListAllDto } from '@/common/dto/list-all.dto';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { ApiException } from '@/common/exceptions/api.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (existingUser) {
      throw new ApiException({
        code: ApiErrorCode.USER_ALREADY_EXISTS,
        message: 'User already exists',
        statusCode: HttpStatus.CONFLICT,
      });
    }

    const hashedPassword = this.encryptionService.generateHashPassword(
      createUserDto.password,
    );

    return this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async findAll(query: ListAllDto) {
    return await this.usersRepository.findAll(query);
  }

  async findOne(id: number, showDeleted = false) {
    const user = await this.usersRepository.findOne(id, showDeleted);

    if (!user) {
      throw new ApiException({
        code: ApiErrorCode.USER_NOT_FOUND,
        message: `User #${id} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return user;
  }

  async findByEmail(email: string, showDeleted = false) {
    const user = await this.usersRepository.findByEmail(email, showDeleted);

    if (!user) {
      throw new ApiException({
        code: ApiErrorCode.USER_NOT_FOUND,
        message: `User #${email} not found`,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id, false);

    if (updateUserDto.password) {
      updateUserDto.password = this.encryptionService.generateHashPassword(
        updateUserDto.password,
      );
    }

    try {
      return await this.usersRepository.update(id, updateUserDto);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: number) {
    await this.findOne(id, false);

    return await this.usersRepository.remove(id);
  }
}
