import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';

@InputType()
export class UpdateBudgetDetailInput {
  @Field(() => String)
  @IsString()
  @IsUUID()
  readonly materialUid: string;
}
