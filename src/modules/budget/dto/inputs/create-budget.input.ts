import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { IsNotEmptyCustom } from '../../../../common/decorators';

@InputType()
export class CreateBudgetInput {
  @Field(() => String)
  @IsNotEmptyCustom()
  @IsString()
  @MaxLength(100)
  description: string;

  @Field(() => String)
  @IsNotEmptyCustom()
  @IsString()
  @MaxLength(100)
  responsible: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(400)
  observation?: string;
}
