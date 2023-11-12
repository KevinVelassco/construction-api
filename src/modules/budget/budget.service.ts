import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DataSource, In, Repository } from 'typeorm';
import { Budget } from './budget.entity';
import { User } from '../user/user.entity';
import { BudgetDetail } from '../budget-detail/budget-detail.entity';
import { FieldsResult } from '../../common/decorators';

import {
  CreateBudgetInput,
  UpdateBudgetInput,
  BudgetsResponse,
  FindOneBudgetInput,
} from './dto';
import { PaginationArgs } from '../../common/dto';
import { BudgetDetailsResponse } from '../budget-detail/dto';

@Injectable()
export class BudgetService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Budget)
    private readonly budgetRepository: Repository<Budget>,
  ) {}

  async create(
    authUser: User,
    createBudgetInput: CreateBudgetInput,
  ): Promise<Budget> {
    const { description } = createBudgetInput;

    const existingByDescription = await this.budgetRepository
      .createQueryBuilder('budget')
      .where('budget.user_id = :userId', { userId: authUser.id })
      .andWhere('lower(budget.description) = lower(:description)', {
        description,
      })
      .getOne();

    if (existingByDescription)
      throw new ConflictException(
        `budget with description ${description} already exists.`,
      );

    const created = this.budgetRepository.create({
      ...createBudgetInput,
      user: authUser,
    });

    const saved = await this.budgetRepository.save(created);

    return saved;
  }

  async findAll(
    authUser: User,
    paginationArgs: PaginationArgs,
    fieldsList: FieldsResult,
  ): Promise<BudgetsResponse> {
    const { limit, offset, q } = paginationArgs;

    const query = this.budgetRepository
      .createQueryBuilder('budget')
      .loadAllRelationIds()
      .where('budget.user_id = :userId', { userId: authUser.id });

    if (q)
      query.andWhere(
        '(budget.description ilike :q OR budget.responsible ilike :q OR budget.observation ilike :q)',
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

  async findOne(
    authUser: User,
    findOneBudgetInput: FindOneBudgetInput,
  ): Promise<Budget | null> {
    const { uid, checkIfExists = false } = findOneBudgetInput;

    const item = await this.budgetRepository.findOne({
      loadRelationIds: true,
      where: {
        uid,
        user: {
          id: authUser.id,
        },
      },
    });

    if (checkIfExists && !item) {
      throw new NotFoundException(`can't get the budget with id ${uid}.`);
    }

    return item || null;
  }

  async update(
    authUser: User,
    findOneBudgetInput: FindOneBudgetInput,
    updateBudgetInput: UpdateBudgetInput,
  ): Promise<Budget> {
    const existingBudget = await this.findOne(authUser, {
      ...findOneBudgetInput,
      checkIfExists: true,
    });

    const { description } = updateBudgetInput;

    if (description) {
      const existingByDescription = await this.budgetRepository
        .createQueryBuilder('budget')
        .where('budget.user_id = :userId', { userId: authUser.id })
        .andWhere('lower(budget.description) = lower(:description)', {
          description,
        })
        .getOne();

      if (existingByDescription)
        throw new ConflictException(
          `budget with description ${description} already exists.`,
        );
    }

    const preloaded = await this.budgetRepository.preload({
      id: existingBudget.id,
      ...updateBudgetInput,
    });

    const saved = await this.budgetRepository.save(preloaded);

    return { ...existingBudget, ...saved };
  }

  async delete(
    authUser: User,
    findOneBudgetInput: FindOneBudgetInput,
  ): Promise<Budget> {
    const existingBudget = await this.findOne(authUser, {
      ...findOneBudgetInput,
      checkIfExists: true,
    });

    const deleted = await this.budgetRepository.remove(existingBudget);

    return deleted;
  }

  getByIds(ids: number[]): Promise<Budget[]> {
    return this.budgetRepository.find({
      where: {
        id: In(ids),
      },
      loadRelationIds: true,
    });
  }

  async budgetDetails(
    authUser: User,
    parent: Budget,
    paginationArgs: PaginationArgs,
    fieldsList: FieldsResult,
  ): Promise<BudgetDetailsResponse> {
    const { limit, offset, q } = paginationArgs;

    const query = this.dataSource
      .getRepository(BudgetDetail)
      .createQueryBuilder('budget_detail')
      .innerJoin('budget_detail.budget', 'budget')
      .where('budget.id = :budgetId ', { budgetId: parent.id })
      .andWhere('budget.user_id = :userId', { userId: authUser.id });

    if (q)
      query.andWhere('(budget_detail.material ilike :q)', {
        q: `%${q}%`,
      });

    query
      .take(limit || 10)
      .skip(offset)
      .orderBy('budget_detail.id', 'DESC');

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
