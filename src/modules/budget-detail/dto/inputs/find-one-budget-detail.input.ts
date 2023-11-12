import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class FindOneBudgetDetailInput {
  @Field(() => String)
  @IsString()
  @IsUUID()
  readonly uid: string;

  @Field(() => String)
  @IsString()
  @IsUUID()
  readonly budgetUid: string;

  @IsOptional()
  @IsBoolean()
  readonly checkIfExists?: boolean;
}
