import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';

import { CustomerService } from './customer.service';
import { Customer } from './customer.entity';
import { User } from '../user/user.entity';
import {
  FieldsResult,
  GetCurrentUser,
  GetFiledsList,
} from '../../common/decorators';
import { CustomerLoaders } from './customer.loaders';

import { PaginationArgs } from '../../common/dto';
import {
  CreateCustomerInput,
  CustomersResponse,
  FindOneCustomerInput,
  UpdateCustomerInput,
} from './dto';
import { BudgetsResponse } from '../budget/dto';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private readonly customerService: CustomerService,
    private readonly customerLoaders: CustomerLoaders,
  ) {}

  @Mutation(() => Customer, { name: 'createCustomer' })
  create(
    @GetCurrentUser() authUser: User,
    @Args('createCustomerInput') createCustomerInput: CreateCustomerInput,
  ): Promise<Customer> {
    return this.customerService.create(authUser, createCustomerInput);
  }

  @Query(() => CustomersResponse, { name: 'customers' })
  findAll(
    @GetCurrentUser() authUser: User,
    @Args() paginationArgs: PaginationArgs,
    @GetFiledsList() fieldsList: FieldsResult,
  ): Promise<CustomersResponse> {
    return this.customerService.findAll(authUser, paginationArgs, fieldsList);
  }

  @Query(() => Customer, { name: 'customer' })
  findOne(
    @GetCurrentUser() authUser: User,
    @Args('findOneCustomerInput') findOneCustomerInput: FindOneCustomerInput,
  ): Promise<Customer> {
    return this.customerService.findOne(authUser, {
      ...findOneCustomerInput,
      checkIfExists: true,
    });
  }

  @Mutation(() => Customer, { name: 'updateCustomer' })
  update(
    @GetCurrentUser() authUser: User,
    @Args('findOneCustomerInput') findOneCustomerInput: FindOneCustomerInput,
    @Args('updateCustomerInput') updateCustomerInput: UpdateCustomerInput,
  ): Promise<Customer> {
    return this.customerService.update(
      authUser,
      findOneCustomerInput,
      updateCustomerInput,
    );
  }

  @Mutation(() => Customer, { name: 'deleteCustomer' })
  delete(
    @GetCurrentUser() authUser: User,
    @Args('findOneCustomerInput') findOneCustomerInput: FindOneCustomerInput,
  ): Promise<Customer> {
    return this.customerService.delete(authUser, findOneCustomerInput);
  }

  @ResolveField(() => User, { name: 'user' })
  user(@Parent() parent: Customer): Promise<User> {
    const value = parent.user;

    const id = typeof value !== 'number' ? value.id : value;

    return this.customerLoaders.batchUsers.load(id);
  }

  @ResolveField(() => BudgetsResponse, { name: 'budgets' })
  budgets(
    @GetCurrentUser() authUser: User,
    @Parent() parent: Customer,
    @Args() paginationArgs: PaginationArgs,
    @GetFiledsList() fieldsList: FieldsResult,
  ): Promise<BudgetsResponse> {
    return this.customerService.budgets(
      authUser,
      parent,
      paginationArgs,
      fieldsList,
    );
  }
}
