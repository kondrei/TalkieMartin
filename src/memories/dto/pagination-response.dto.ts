import { ApiProperty, ApiExtraModels } from '@nestjs/swagger';

@ApiExtraModels() // This ensures nested models are registered in Swagger
export class PaginationResponseDto<T> {
  @ApiProperty({ description: 'Paginated data' })
  data: T[];

  @ApiProperty({ description: 'Total number of items' })
  pages: number = 1;

  @ApiProperty({ default: 25 })
  currentPage: number = 25;

  @ApiProperty({ description: 'Total number of items' })
  total: number;
}
