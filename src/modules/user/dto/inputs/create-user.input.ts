import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsNotEmptyCustom } from '../../../../common/decorators';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsNotEmptyCustom()
  @IsString()
  @MaxLength(100)
  readonly name: string;

  @Field(() => String)
  @IsNotEmptyCustom()
  @IsString()
  @MaxLength(100)
  readonly lastName: string;

  @Field(() => String)
  @IsEmail()
  @MaxLength(100)
  readonly email: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsNumberString()
  phone?: string;

  @Field(() => String)
  @IsNotEmptyCustom()
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  readonly password: string;
}
