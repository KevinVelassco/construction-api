import { CreateMaterialInput } from './create-material.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateMaterialInput extends PartialType(CreateMaterialInput) {}
