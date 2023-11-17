import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { Customer } from './customer.entity';
import { Budget } from '../budget/budget.entity';
import { User } from '../user/user.entity';
import { FieldsResult } from '../../common/decorators';
import { PaginationArgs } from '../../common/dto';
import {
  CreateCustomerInput,
  CustomersResponse,
  FindOneCustomerInput,
  UpdateCustomerInput,
} from './dto';
import { BudgetsResponse } from '../budget/dto';

@Injectable()
export class CustomerService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(
    authUser: User,
    createCustomerInput: CreateCustomerInput,
  ): Promise<Customer> {
    const { email, phone } = createCustomerInput;

    if (email) {
      const customer = await this.customerRepository.findOneBy({ email });

      if (customer) {
        throw new ConflictException(
          `customer with email ${email} already exists.`,
        );
      }
    }

    if (phone) {
      const customer = await this.customerRepository.findOneBy({ phone });

      if (customer)
        throw new ConflictException(
          `customer with phone ${phone} already exists.`,
        );
    }

    const created = this.customerRepository.create({
      ...createCustomerInput,
      user: authUser,
    });

    const saved = await this.customerRepository.save(created);

    return saved;
  }

  async findAll(
    authUser: User,
    paginationArgs: PaginationArgs,
    fieldsList: FieldsResult,
  ): Promise<CustomersResponse> {
    const { limit, offset, q } = paginationArgs;

    const query = this.customerRepository
      .createQueryBuilder('customer')
      .loadAllRelationIds()
      .where('customer.user_id = :userId', { userId: authUser.id });

    if (q)
      query.andWhere(
        '(customer.fullName ilike :q OR customer.address ilike :q OR customer.email ilike :q OR customer.phone ilike :q)',
        {
          q: `%${q}%`,
        },
      );

    query
      .take(limit || 10)
      .skip(offset)
      .orderBy('customer.id', 'DESC');

    const { fields, numberOfFields } = fieldsList;

    if (numberOfFields <= 1 && fields[0] === 'count') {
      const count = await query.getCount();
      return { count, results: null };
    }

    if (numberOfFields <= 1 && fields[0] === 'results') {
      const results = await query.getMany();
      return { count: null, results };
    }

    const [results, count] = await query.getManyAndCount();

    return { count, results };
  }

  async findOne(
    authUser: User,
    findOneCustomerInput: FindOneCustomerInput,
  ): Promise<Customer | null> {
    const { uid, checkIfExists = false } = findOneCustomerInput;

    const item = await this.customerRepository.findOne({
      loadRelationIds: true,
      where: {
        uid,
        user: {
          id: authUser.id,
        },
      },
    });

    if (checkIfExists && !item) {
      throw new NotFoundException(`can't get the customer with id ${uid}.`);
    }

    return item || null;
  }

  async update(
    authUser: User,
    findOneCustomerInput: FindOneCustomerInput,
    updateCustomerInput: UpdateCustomerInput,
  ): Promise<Customer> {
    const existingCustomer = await this.findOne(authUser, {
      ...findOneCustomerInput,
      checkIfExists: true,
    });

    const { email, phone } = updateCustomerInput;

    if (email) {
      const customer = await this.customerRepository.findOneBy({ email });

      if (customer) {
        throw new ConflictException(
          `customer with email ${email} already exists.`,
        );
      }
    }

    if (phone) {
      const customer = await this.customerRepository.findOneBy({ phone });

      if (customer)
        throw new ConflictException(
          `customer with phone ${phone} already exists.`,
        );
    }

    const preloaded = await this.customerRepository.preload({
      id: existingCustomer.id,
      ...updateCustomerInput,
    });

    const saved = await this.customerRepository.save(preloaded);

    return { ...existingCustomer, ...saved };
  }

  async delete(
    authUser: User,
    findOneCustomerInput: FindOneCustomerInput,
  ): Promise<Customer> {
    const existingCustomer = await this.findOne(authUser, {
      ...findOneCustomerInput,
      checkIfExists: true,
    });

    const deleted = await this.customerRepository.remove(existingCustomer);

    return deleted;
  }

  getByIds(ids: number[]): Promise<Customer[]> {
    return this.customerRepository.find({
      where: {
        id: In(ids),
      },
      loadRelationIds: true,
    });
  }

  async budgets(
    authUser: User,
    parent: Customer,
    paginationArgs: PaginationArgs,
    fieldsList: FieldsResult,
  ): Promise<BudgetsResponse> {
    const { limit, offset, q } = paginationArgs;

    const query = this.dataSource
      .getRepository(Budget)
      .createQueryBuilder('budget')
      .loadAllRelationIds()
      .innerJoin('budget.customer', 'customer')
      .where('budget.user_id = :userId', { userId: authUser.id })
      .andWhere('customer.id = :customerId', { customerId: parent.id });

    if (q)
      query.andWhere(
        '(budget.description ilike :q OR customer.fullName ilike :q OR budget.observation ilike :q)',
        {
          q: `%${q}%`,
        },
      );

    query
      .take(limit || 10)
      .skip(offset)
      .orderBy('budget.id', 'DESC');

    const { fields, numberOfFields } = fieldsList;

    if (numberOfFields <= 1 && fields[0] === 'count') {
      const count = await query.getCount();
      return { count, results: null };
    }

    if (numberOfFields <= 1 && fields[0] === 'results') {
      const results = await query.getMany();
      return { count: null, results };
    }

    const [results, count] = await query.getManyAndCount();

    return { count, results };
  }
}
