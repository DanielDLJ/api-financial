import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiProperty,
  getSchemaPath,
} from '@nestjs/swagger';

export class MetaData {
  constructor(page: number, limit: number, total: number) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
  }

  @ApiProperty({ default: 1 })
  page = 1;

  @ApiProperty({ default: 10 })
  limit = 10;

  @ApiProperty({ default: 0 })
  total = 0;

  @ApiProperty({ default: 0 })
  totalPages = 0;
}

export class PaginatedResponseDto<T> {
  constructor(data: T[], metaData: MetaData) {
    this.data = data;
    this.metaData = metaData;
  }

  @ApiProperty({ type: [Object] })
  data: T[];

  @ApiProperty({ type: MetaData })
  metaData: MetaData;
}

export const ApiOkResponsePaginated = <DataDto extends Type<unknown>>(
  dataDto: DataDto,
) =>
  applyDecorators(
    ApiExtraModels(PaginatedResponseDto, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
