import { ObjectType } from '@nestjs/graphql';

import { ResultsResponse } from '../../../../common/dto';
import { Material } from '../../material.entity';

@ObjectType()
export class MaterialsResponse extends ResultsResponse(Material) {}
