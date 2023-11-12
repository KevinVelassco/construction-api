import { ArgsType, Field, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationArgs } from '../../../../common/dto';

@ArgsType()
export class FindAllMaterialsArgs extends PartialType(PaginationArgs) {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;
}
