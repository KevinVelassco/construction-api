import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class FindAllBudgetDetailByBudgetInput {
  @Field(() => String)
  @IsString()
  @IsUUID()
  readonly budgetUid: string;
}
