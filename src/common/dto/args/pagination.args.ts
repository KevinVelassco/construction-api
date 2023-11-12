import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, {
    description: 'Limit the result set to the specified number of resources.',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  //@IsPositive()
  @Min(1)
  readonly limit: number = 10;

  @Field(() => Int, {
    description: 'Skip the specified number of resources in the result set.',
    nullable: true,
    defaultValue: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly offset: number = 0;

  @Field(() => String, {
    description:
      'Returns only the rows that match the specific lookup fields of the resource.',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  readonly q?: string;
}
