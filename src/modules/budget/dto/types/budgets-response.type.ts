import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Budget } from '../../budget.entity';

@ObjectType()
export class BudgetsResponse {
  @Field(() => Int)
  readonly count: number;

  @Field(() => [Budget])
  readonly results: Budget[];
}
