import { Controller, Get, Param, Query } from '@nestjs/common';
import { FlagsService } from '../service/flags.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Flag } from '../entities/flag.entity';
import { ApiOkResponsePaginated } from '../../common/dto/paginated-response.dto';
import { ListAllFlagsDto } from '../dto/list-all-flags.dto';
import { Role } from '@prisma/client';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('flags')
@ApiTags('flags')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Get()
  @ApiOperation({ summary: 'List flags' })
  @ApiOkResponsePaginated(Flag)
  @Roles(Role.ADMIN, Role.USER)
  findAll(@Query() query: ListAllFlagsDto) {
    return this.flagsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get flag' })
  @ApiOkResponse({ description: 'Flag', type: Flag })
  @Roles(Role.ADMIN, Role.USER)
  findOne(@Param('id') id: string) {
    return this.flagsService.findOne(+id);
  }
}
