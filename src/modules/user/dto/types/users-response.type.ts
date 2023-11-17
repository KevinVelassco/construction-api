import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../user.entity';

@ObjectType()
export class UsersResponse {
  @Field(() => Int)
  readonly count: number;

  @Field(() => [User])
  readonly results: User[];
}
