import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { IsNotEmptyCustom } from '../../../../common/decorators';

@InputType()
export class CreateBudgetInput {
  @Field(() => String)
  @IsNotEmptyCustom()
  @IsString()
  @MaxLength(100)
  readonly description: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  readonly observation?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly address?: string;

  @Field(() => String)
  @IsString()
  @IsUUID()
  readonly customerUid: string;
}
