import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BudgetService } from './budget.service';
import { BudgetResolver } from './budget.resolver';
import { BudgetLoaders } from './budget.loaders';
import { Budget } from './budget.entity';

import { UserModule } from '../user/user.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Budget]), UserModule, CustomerModule],
  providers: [BudgetResolver, BudgetService, BudgetLoaders],
  exports: [BudgetService],
})
export class BudgetModule {}
