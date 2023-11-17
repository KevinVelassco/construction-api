import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import { UserService } from './user.service';
import { User } from './user.entity';
import { Admin, FieldsResult, GetFiledsList } from '../../common/decorators';
import {
  CreateUserInput,
  FindAllUsersArgs,
  FindOneUserInput,
  UpdateUserInput,
  UsersResponse,
} from './dto';
import { PaginationArgs } from '../../common/dto';
import { BudgetsResponse } from '../budget/dto';
import { CustomersResponse } from '../customer/dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UserService) {}

  @Admin()
  @Mutation(() => User, { name: 'createUser' })
  create(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.create(createUserInput);
  }

  @Admin()
  @Query(() => UsersResponse, { name: 'users' })
  findAll(
    @Args() findAllUsersArgs: FindAllUsersArgs,
    @GetFiledsList() fieldsList: FieldsResult,
  ): Promise<UsersResponse> {
    return this.userService.findAll(findAllUsersArgs, fieldsList);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('findOneUserInput') findOneUserInput: FindOneUserInput,
  ): Promise<User> {
    return this.userService.findOne({
      ...findOneUserInput,
      checkIfExists: true,
    });
  }

  @Mutation(() => User, { name: 'updateUser' })
  update(
    @Args('findOneUserInput') findOneUserInput: FindOneUserInput,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<User> {
    return this.userService.update(findOneUserInput, updateUserInput);
  }

  @Admin()
  @Mutation(() => User, { name: 'deleteUser' })
  delete(
    @Args('findOneUserInput') findOneUserInput: FindOneUserInput,
  ): Promise<User> {
    return this.userService.delete(findOneUserInput);
  }

  @ResolveField(() => BudgetsResponse, { name: 'budgets' })
  budgets(
    @Parent() parent: User,
    @Args() paginationArgs: PaginationArgs,
    @GetFiledsList() fieldsList: FieldsResult,
  ): Promise<BudgetsResponse> {
    return this.userService.budgets(parent, paginationArgs, fieldsList);
  }

  @ResolveField(() => CustomersResponse, { name: 'customers' })
  customers(
    @Parent() parent: User,
    @Args() paginationArgs: PaginationArgs,
    @GetFiledsList() fieldsList: FieldsResult,
  ): Promise<CustomersResponse> {
    return this.userService.customers(parent, paginationArgs, fieldsList);
  }
}
