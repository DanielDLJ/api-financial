import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { ListAllDto } from '../../common/dto/list-all.dto';
import { ApiOkResponsePaginated } from '../../common/dto/paginated-response.dto';
import { Role } from '@prisma/client';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserOwnerGuard } from '../guards/user-owner.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiCreatedResponse({ description: 'User created', type: User })
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponsePaginated(User)
  @Roles(Role.ADMIN)
  findAll(@Query() query: ListAllDto) {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user' })
  @ApiOkResponse({ description: 'User', type: User })
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(UserOwnerGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiOkResponse({ description: 'User updated', type: User })
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(UserOwnerGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete user' })
  @ApiOkResponse({ description: 'User deleted', type: User })
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(UserOwnerGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
