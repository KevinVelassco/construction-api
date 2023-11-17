import * as DataLoader from 'dataloader';

import { Injectable, Scope } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { CustomerService } from '../customer/customer.service';

@Injectable({ scope: Scope.REQUEST })
export class BudgetLoaders {
  constructor(
    private readonly userService: UserService,
    private readonly customerService: CustomerService,
  ) {}

  public readonly batchUsers = new DataLoader(async (masterIds: number[]) => {
    const masters = await this.userService.getByIds(masterIds);
    const mastersMap = new Map(masters.map((item) => [item.id, item]));
    return masterIds.map((masterId) => mastersMap.get(masterId));
  });

  public readonly batchCustomers = new DataLoader(
    async (masterIds: number[]) => {
      const masters = await this.customerService.getByIds(masterIds);
      const mastersMap = new Map(masters.map((item) => [item.id, item]));
      return masterIds.map((masterId) => mastersMap.get(masterId));
    },
  );
}
