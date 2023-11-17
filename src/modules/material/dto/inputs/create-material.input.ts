import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsNotEmptyCustom } from '../../../../common/decorators';

@InputType()
export class CreateMaterialInput {
  @Field(() => String)
  @IsNotEmptyCustom()
  @IsString()
  @MaxLength(200)
  readonly name: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  readonly price?: number;
}
