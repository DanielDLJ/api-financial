import { Controller, Get, Param, Query } from '@nestjs/common';
import { BanksService } from '../service/banks.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Bank } from '../entities/bank.entity';
import { ApiOkResponsePaginated } from '../../common/dto/paginated-response.dto';
import { ListAllBanksDto } from '../dto/list-all-banks.dto';

@Controller('banks')
@ApiTags('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @Get()
  @ApiOperation({ summary: 'List banks' })
  @ApiOkResponsePaginated(Bank)
  findAll(@Query() query: ListAllBanksDto) {
    return this.banksService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get bank' })
  @ApiOkResponse({ description: 'Bank', type: Bank })
  findOne(@Param('id') id: string) {
    return this.banksService.findOne(+id);
  }
}
