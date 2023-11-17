import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class FindOneCustomerInput {
  @Field(() => String)
  @IsString()
  @IsUUID()
  readonly uid: string;

  @IsOptional()
  @IsBoolean()
  readonly checkIfExists?: boolean;
}
