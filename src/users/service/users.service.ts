import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { EncryptionService } from '../../encryption/service/encryption.service';
import { ListAllDto } from '../../common/dto/list-all.dto';
import { UsersRepository } from '../repository/user.repository';
import { ApiErrorCode } from '@/common/enums/api-error-codes.enum';
import { ApiException } from '@/common/exceptions/api.exception';

@Injectable()
export class UsersService {
  constructor(
    private readonly encryptionService: EncryptionService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = this.encryptionService.generateHashPassword(
      createUserDto.password,
    );

    return await this.usersRepository.create(createUserDto);
  }

  async findAll(query: ListAllDto) {
    return await this.usersRepository.findAll(query);
  }

  async findOne(id: number, showDeleted?: boolean) {
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

  async findByEmail(email: string) {
    return await this.usersRepository.findByEmail(email);
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
    await this.findOne(id, true);

    return await this.usersRepository.remove(id);
  }
}
