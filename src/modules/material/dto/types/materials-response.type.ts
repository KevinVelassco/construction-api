import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Material } from '../../material.entity';

@ObjectType()
export class MaterialsResponse {
  @Field(() => Int)
  readonly count: number;

  @Field(() => [Material])
  readonly results: Material[];
}
