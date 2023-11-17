import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Customer } from '../../customer.entity';

@ObjectType()
export class CustomersResponse {
  @Field(() => Int)
  readonly count: number;

  @Field(() => [Customer])
  readonly results: Customer[];
}
