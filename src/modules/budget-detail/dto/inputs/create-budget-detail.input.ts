import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateBudgetDetailInput {
  @Field(() => String)
  @IsString()
  @IsUUID()
  readonly materialUid: string;

  @Field(() => String)
  @IsString()
  @IsUUID()
  readonly budgetUid: string;
}
