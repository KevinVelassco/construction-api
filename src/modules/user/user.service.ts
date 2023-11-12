import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { User } from './user.entity';
import { Budget } from '../budget/budget.entity';
import { FieldsResult } from '../../common/decorators';

import {
  CreateUserInput,
  FindAllUsersArgs,
  FindOneUserInput,
  UpdateUserInput,
  UsersResponse,
} from './dto';

import { PaginationArgs } from '../../common/dto';
import { BudgetsResponse } from '../budget/dto';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const { email, phone } = createUserInput;

    const user = await this.userRepository.findOneBy({ email });

    if (user)
      throw new ConflictException(`user with email ${email} already exists.`);

    if (phone) {
      const user = await this.userRepository.findOneBy({ phone });

      if (user)
        throw new ConflictException(`user with phone ${phone} already exists.`);
    }

    const created = this.userRepository.create({
      ...createUserInput,
      isAdmin: false,
      // TODO changes to false when email verification functionality is implemented
      verifiedEmail: true,
    });

    const saved = await this.userRepository.save(created);

    return saved;
  }

  async findAll(
    findAllUsersArgs: FindAllUsersArgs,
    fieldsList: FieldsResult,
  ): Promise<UsersResponse> {
    const { limit, offset, q, ...filters } = findAllUsersArgs;

    const query = this.userRepository.createQueryBuilder('user');

    if (Object.keys(filters).length > 0) {
      Object.entries(filters).forEach(([key, value]) => {
        query.andWhere(`user.${key} = :${key}`, { [key]: value });
      });
    }

    if (q)
      query.andWhere(
        '(user.name ilike :q OR user.lastName ilike :q OR user.email ilike :q OR user.phone ilike :q)',
        {
          q: `%${q}%`,
        },
      );

    query
      .take(limit || 10)
      .skip(offset)
      .orderBy('user.id', 'DESC');

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

  async findOne(findOneUserInput: FindOneUserInput): Promise<User | null> {
    const { authUid, checkIfExists = false } = findOneUserInput;
    const item = await this.userRepository.findOneBy({ authUid });

    if (checkIfExists && !item) {
      throw new NotFoundException(
        `can't get the user with authUid ${authUid}.`,
      );
    }

    return item || null;
  }

  async update(
    findOneUserInput: FindOneUserInput,
    updateUserInput: UpdateUserInput,
  ): Promise<User> {
    const existingUser = await this.findOne({
      ...findOneUserInput,
      checkIfExists: true,
    });

    const preloaded = await this.userRepository.preload({
      id: existingUser.id,
      ...updateUserInput,
    });

    const saved = await this.userRepository.save(preloaded);

    return saved;
  }

  async delete(findOneUserInput: FindOneUserInput): Promise<User> {
    const existingUser = await this.findOne({
      ...findOneUserInput,
      checkIfExists: true,
    });

    const deleted = await this.userRepository.softRemove(existingUser);

    return deleted;
  }

  getByIds(ids: number[]): Promise<User[]> {
    return this.userRepository.find({
      where: {
        id: In(ids),
      },
      loadRelationIds: true,
    });
  }

  async budgets(
    parent: User,
    paginationArgs: PaginationArgs,
    fieldsList: FieldsResult,
  ): Promise<BudgetsResponse> {
    const { limit, offset, q } = paginationArgs;

    const query = this.dataSource
      .getRepository(Budget)
      .createQueryBuilder('budget')
      .where('budget.user_id = :userId', { userId: parent.id });

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
}
