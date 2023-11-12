import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { BudgetDetailService } from './budget-detail.service';
import { BudgetDetail } from './budget-detail.entity';
import { User } from '../user/user.entity';
import { BudgetDetailLoaders } from './budget-detail.loaders';
import { Budget } from '../budget/budget.entity';
import {
  Admin,
  FieldsResult,
  GetCurrentUser,
  GetFiledsList,
} from '../../common/decorators';
import {
  CreateBudgetDetailInput,
  UpdateBudgetDetailInput,
  BudgetDetailsResponse,
  FindOneBudgetDetailInput,
  FindAllBudgetDetailByBudgetInput,
} from './dto';
import { PaginationArgs } from '../../common/dto';

@Resolver(() => BudgetDetail)
export class BudgetDetailResolver {
  constructor(
    private readonly budgetDetailService: BudgetDetailService,
    private readonly budgetDetailLoaders: BudgetDetailLoaders,
  ) {}

  @Admin()
  @Mutation(() => BudgetDetail, { name: 'createBudgetDetail' })
  create(
    @GetCurrentUser() authUser: User,
    @Args('createBudgetDetailInput')
    createBudgetDetailInput: CreateBudgetDetailInput,
  ): Promise<BudgetDetail> {
    return this.budgetDetailService.create(authUser, createBudgetDetailInput);
  }

  @Query(() => BudgetDetailsResponse, { name: 'BudgetDetails' })
  findAllByBudget(
    @GetCurrentUser() authUser: User,
    @Args('findAllBudgetDetailByBudgetInput')
    findAllBudgetDetailByBudgetInput: FindAllBudgetDetailByBudgetInput,
    @Args() paginationArgs: PaginationArgs,
    @GetFiledsList() fieldsList: FieldsResult,
  ): Promise<BudgetDetailsResponse> {
    return this.budgetDetailService.findAllByBudget(
      authUser,
      findAllBudgetDetailByBudgetInput,
      paginationArgs,
      fieldsList,
    );
  }

  @Query(() => BudgetDetail, { name: 'BudgetDetail' })
  findOne(
    @GetCurrentUser() authUser: User,
    @Args('findOneBudgetDetailInput')
    findOneBudgetDetailInput: FindOneBudgetDetailInput,
  ): Promise<BudgetDetail> {
    return this.budgetDetailService.findOne(authUser, {
      ...findOneBudgetDetailInput,
      checkIfExists: true,
    });
  }

  @Admin()
  @Mutation(() => BudgetDetail, { name: 'updateBudgetDetail' })
  update(
    @GetCurrentUser() authUser: User,
    @Args('findOneBudgetDetailInput')
    findOneBudgetDetailInput: FindOneBudgetDetailInput,
    @Args('updateBudgetDetailInput')
    updateBudgetDetailInput: UpdateBudgetDetailInput,
  ): Promise<BudgetDetail> {
    return this.budgetDetailService.update(
      authUser,
      findOneBudgetDetailInput,
      updateBudgetDetailInput,
    );
  }

  @Admin()
  @Mutation(() => BudgetDetail, { name: 'deleteBudgetDetail' })
  delete(
    @GetCurrentUser() authUser: User,
    @Args('findOneBudgetDetailInput')
    findOneBudgetDetailInput: FindOneBudgetDetailInput,
  ): Promise<BudgetDetail> {
    return this.budgetDetailService.delete(authUser, findOneBudgetDetailInput);
  }

  @ResolveField(() => Budget, { name: 'budget' })
  user(@Parent() parent: BudgetDetail): Promise<Budget> {
    const value = parent.budget;

    const id = typeof value !== 'number' ? value.id : value;

    return this.budgetDetailLoaders.batchBudgets.load(id);
  }
}
