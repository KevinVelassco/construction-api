import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { BudgetService } from './budget.service';
import { Budget } from './budget.entity';
import { User } from '../user/user.entity';
import { Customer } from '../customer/customer.entity';
import {
  FieldsResult,
  GetCurrentUser,
  GetFiledsList,
} from '../../common/decorators';
import { BudgetLoaders } from './budget.loaders';
import {
  CreateBudgetInput,
  UpdateBudgetInput,
  BudgetsResponse,
  FindOneBudgetInput,
} from './dto';
import { PaginationArgs } from '../../common/dto';
import { BudgetDetailsResponse } from '../budget-detail/dto';

@Resolver(() => Budget)
export class BudgetResolver {
  constructor(
    private readonly budgetService: BudgetService,
    private readonly budgetLoaders: BudgetLoaders,
  ) {}

  @Mutation(() => Budget, { name: 'createBudget' })
  create(
    @GetCurrentUser() authUser: User,
    @Args('createBudgetInput') createBudgetInput: CreateBudgetInput,
  ): Promise<Budget> {
    return this.budgetService.create(authUser, createBudgetInput);
  }

  @Query(() => BudgetsResponse, { name: 'Budgets' })
  findAll(
    @GetCurrentUser() authUser: User,
    @Args() paginationArgs: PaginationArgs,
    @GetFiledsList() fieldsList: FieldsResult,
  ): Promise<BudgetsResponse> {
    return this.budgetService.findAll(authUser, paginationArgs, fieldsList);
  }

  @Query(() => Budget, { name: 'Budget' })
  findOne(
    @GetCurrentUser() authUser: User,
    @Args('findOneUserInput') findOneBudgetInput: FindOneBudgetInput,
  ): Promise<Budget> {
    return this.budgetService.findOne(authUser, {
      ...findOneBudgetInput,
      checkIfExists: true,
    });
  }

  @Mutation(() => Budget, { name: 'updateBudget' })
  update(
    @GetCurrentUser() authUser: User,
    @Args('findOneUserInput') findOneBudgetInput: FindOneBudgetInput,
    @Args('updateBudgetInput') updateBudgetInput: UpdateBudgetInput,
  ): Promise<Budget> {
    return this.budgetService.update(
      authUser,
      findOneBudgetInput,
      updateBudgetInput,
    );
  }

  @Mutation(() => Budget, { name: 'deleteBudget' })
  delete(
    @GetCurrentUser() authUser: User,
    @Args('findOneUserInput') findOneBudgetInput: FindOneBudgetInput,
  ): Promise<Budget> {
    return this.budgetService.delete(authUser, findOneBudgetInput);
  }

  @ResolveField(() => User, { name: 'user' })
  user(@Parent() parent: Budget): Promise<User> {
    const value = parent.user;

    const id = typeof value !== 'number' ? value.id : value;

    return this.budgetLoaders.batchUsers.load(id);
  }

  @ResolveField(() => User, { name: 'customer' })
  customer(@Parent() parent: Budget): Promise<Customer> {
    const value = parent.customer;

    const id = typeof value !== 'number' ? value.id : value;

    return this.budgetLoaders.batchCustomers.load(id);
  }

  @ResolveField(() => BudgetDetailsResponse, { name: 'budgetDetails' })
  budgetDetails(
    @GetCurrentUser() authUser: User,
    @Parent() parent: Budget,
    @Args() paginationArgs: PaginationArgs,
    @GetFiledsList() fieldsList: FieldsResult,
  ): Promise<BudgetDetailsResponse> {
    return this.budgetService.budgetDetails(
      authUser,
      parent,
      paginationArgs,
      fieldsList,
    );
  }
}
