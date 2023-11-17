import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { IsNotEmptyCustom } from '../../../../common/decorators';

@InputType()
export class CreateCustomerInput {
  @Field(() => String)
  @IsNotEmptyCustom()
  @IsString()
  @MaxLength(100)
  readonly fullName: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  readonly email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNumberString()
  @Length(10)
  readonly phone?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  readonly address?: string;
}
