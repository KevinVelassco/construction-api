import { ObjectType } from '@nestjs/graphql';

import { BudgetDetail } from '../../budget-detail.entity';
import { ResultsResponse } from '../../../../common/dto';

@ObjectType()
export class BudgetDetailsResponse extends ResultsResponse(BudgetDetail) {}
