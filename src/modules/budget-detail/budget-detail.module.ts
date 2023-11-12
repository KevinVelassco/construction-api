import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BudgetModule } from '../budget/budget.module';
import { MaterialModule } from '../material/material.module';
import { BudgetDetailService } from './budget-detail.service';
import { BudgetDetailResolver } from './budget-detail.resolver';
import { BudgetDetail } from './budget-detail.entity';
import { BudgetDetailLoaders } from './budget-detail.loaders';

@Module({
  imports: [
    TypeOrmModule.forFeature([BudgetDetail]),
    BudgetModule,
    MaterialModule,
  ],
  providers: [BudgetDetailResolver, BudgetDetailService, BudgetDetailLoaders],
})
export class BudgetDetailModule {}
