import * as DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { BudgetService } from '../budget/budget.service';

@Injectable({ scope: Scope.REQUEST })
export class BudgetDetailLoaders {
  constructor(private readonly budgetService: BudgetService) {}

  public readonly batchBudgets = new DataLoader(async (masterIds: number[]) => {
    const masters = await this.budgetService.getByIds(masterIds);
    const mastersMap = new Map(masters.map((item) => [item.id, item]));
    return masterIds.map((masterId) => mastersMap.get(masterId));
  });
}
