import { Controller, Get, Param, Query } from '@nestjs/common';
import { FlagsService } from '../service/flags.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Flag } from '../entities/flag.entity';
import { ApiOkResponsePaginated } from '../../common/dto/paginated-response.dto';
import { ListAllFlagsDto } from '../dto/list-all-flags.dto';

@Controller('flags')
@ApiTags('flags')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Get()
  @ApiOperation({ summary: 'List flags' })
  @ApiOkResponsePaginated(Flag)
  findAll(@Query() query: ListAllFlagsDto) {
    return this.flagsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get flag' })
  @ApiOkResponse({ description: 'Flag', type: Flag })
  findOne(@Param('id') id: string) {
    return this.flagsService.findOne(+id);
  }
}
