import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class FindOneUserInput {
  @Field(() => String)
  @IsString()
  @IsUUID()
  readonly authUid: string;

  @IsOptional()
  @IsBoolean()
  readonly checkIfExists?: boolean;
}
