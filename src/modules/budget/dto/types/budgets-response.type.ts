import { ObjectType } from '@nestjs/graphql';

import { Budget } from '../../budget.entity';
import { ResultsResponse } from '../../../../common/dto';

@ObjectType()
export class BudgetsResponse extends ResultsResponse(Budget) {}
