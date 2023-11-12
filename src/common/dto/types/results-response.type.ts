import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export function ResultsResponse<Model>(ModelType: Type<Model>) {
  @ObjectType()
  abstract class ResultsResponseClass {
    @Field(() => Int, { nullable: true })
    readonly count?: number;

    @Field(() => [ModelType], { nullable: true })
    readonly results?: Model[];
  }

  return ResultsResponseClass;
}
