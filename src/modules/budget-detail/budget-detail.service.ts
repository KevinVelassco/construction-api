import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { BudgetDetail } from './budget-detail.entity';
import { User } from '../user/user.entity';
import { BudgetService } from '../budget/budget.service';
import { MaterialService } from '../material/material.service';
import { FieldsResult } from '../../common/decorators';

import {
  CreateBudgetDetailInput,
  UpdateBudgetDetailInput,
  BudgetDetailsResponse,
  FindOneBudgetDetailInput,
  FindAllBudgetDetailByBudgetInput,
} from './dto';
import { PaginationArgs } from '../../common/dto';

@Injectable()
export class BudgetDetailService {
  constructor(
    @InjectRepository(BudgetDetail)
    private readonly budgetDetailRepository: Repository<BudgetDetail>,
    private readonly budgetService: BudgetService,
    private readonly materialService: MaterialService,
  ) {}

  async create(
    authUser: User,
    createBudgetDetailInput: CreateBudgetDetailInput,
  ): Promise<BudgetDetail> {
    const { budgetUid, materialUid } = createBudgetDetailInput;

    const budget = await this.budgetService.findOne(authUser, {
      uid: budgetUid,
      checkIfExists: true,
    });

    const material = await this.materialService.findOne({
      uid: materialUid,
      checkIfExists: true,
    });

    const existingByMaterial = await this.budgetDetailRepository
      .createQueryBuilder('budget_detail')
      .where('budget_detail.budget_id = :budgetId', { budgetId: budget.id })
      .andWhere('lower(budget_detail.material) = lower(:material)', {
        material: material.name,
      })
      .getOne();

    if (existingByMaterial)
      throw new ConflictException(
        `budget detail with material ${material.name} already exists.`,
      );

    const created = this.budgetDetailRepository.create({
      material: material.name,
      price: material.price,
      budget,
    });

    const saved = await this.budgetDetailRepository.save(created);

    return saved;
  }

  async findAllByBudget(
    authUser: User,
    findAllBudgetDetailByBudgetInput: FindAllBudgetDetailByBudgetInput,
    paginationArgs: PaginationArgs,
    fieldsList: FieldsResult,
  ): Promise<BudgetDetailsResponse> {
    const { limit, offset, q } = paginationArgs;

    const { budgetUid } = findAllBudgetDetailByBudgetInput;

    const budget = await this.budgetService.findOne(authUser, {
      uid: budgetUid,
      checkIfExists: true,
    });

    const query = this.budgetDetailRepository
      .createQueryBuilder('budget_detail')
      .loadAllRelationIds()
      .innerJoin('budget_detail.budget', 'budget')
      .where('budget.id = :budgetId ', { budgetId: budget.id })
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

  async findOne(
    authUser: User,
    findOneBudgetDetailInput: FindOneBudgetDetailInput,
  ): Promise<BudgetDetail | null> {
    const { uid, budgetUid, checkIfExists = false } = findOneBudgetDetailInput;

    const item = await this.budgetDetailRepository
      .createQueryBuilder('budget_detail')
      .loadAllRelationIds()
      .innerJoin('budget_detail.budget', 'budget')
      .where('budget_detail.uid = :budgetDetailUid', { budgetDetailUid: uid })
      .andWhere('budget.uid = :budgetUid', { budgetUid })
      .andWhere('budget.user_id = :userId', { userId: authUser.id })
      .getOne();

    if (checkIfExists && !item) {
      throw new NotFoundException(
        `can't get the budget detail with id ${uid}.`,
      );
    }

    return item || null;
  }

  async update(
    authUser: User,
    findOneBudgetDetailInput: FindOneBudgetDetailInput,
    updateBudgetDetailInput: UpdateBudgetDetailInput,
  ): Promise<BudgetDetail> {
    const { uid, budgetUid } = findOneBudgetDetailInput;

    const existingBudgetDetail = await this.findOne(authUser, {
      uid,
      budgetUid,
      checkIfExists: true,
    });

    const { materialUid } = updateBudgetDetailInput;

    const material = await this.materialService.findOne({
      uid: materialUid,
      checkIfExists: true,
    });

    const existingByMaterial = await this.budgetDetailRepository
      .createQueryBuilder('budget_detail')
      .innerJoin('budget_detail.budget', 'budget')
      .where('budget.uid = :budgetUid', { budgetUid })
      .andWhere('lower(budget_detail.material) = lower(:material)', {
        material: material.name,
      })
      .getOne();

    if (existingByMaterial)
      throw new ConflictException(
        `budget detail with material ${material.name} already exists.`,
      );

    const preloaded = await this.budgetDetailRepository.preload({
      id: existingBudgetDetail.id,
      material: material.name,
      price: material.price,
    });

    const saved = await this.budgetDetailRepository.save(preloaded);

    return { ...existingBudgetDetail, ...saved };
  }

  async delete(
    authUser: User,
    findOneBudgetDetailInput: FindOneBudgetDetailInput,
  ): Promise<BudgetDetail> {
    const existingBudgetDetail = await this.findOne(authUser, {
      ...findOneBudgetDetailInput,
      checkIfExists: true,
    });

    const deleted = await this.budgetDetailRepository.remove(
      existingBudgetDetail,
    );

    return deleted;
  }
}
