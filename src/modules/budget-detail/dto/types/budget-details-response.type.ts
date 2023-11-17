import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BudgetDetail } from '../../budget-detail.entity';

@ObjectType()
export class BudgetDetailsResponse {
  @Field(() => Int)
  readonly count: number;

  @Field(() => [BudgetDetail])
  readonly results: BudgetDetail[];
}
