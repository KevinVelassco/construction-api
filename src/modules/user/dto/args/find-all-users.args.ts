import { ArgsType, Field, PartialType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationArgs } from '../../../../common/dto';

@ArgsType()
export class FindAllUsersArgs extends PartialType(PaginationArgs) {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly isAdmin?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly isActive?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  readonly verifiedEmail?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @IsUUID()
  readonly authUid?: string;
}
