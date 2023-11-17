import { ObjectType, Field } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { BudgetDetail } from '../budget-detail/budget-detail.entity';
import { Customer } from '../customer/customer.entity';
import { BudgetDetailsResponse } from '../budget-detail/dto';

@ObjectType()
@Entity({ name: 'budgets' })
@Unique('uq_budget_uid', ['uid'])
@Unique('uq_budget_description', ['user', 'description'])
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Generated('uuid')
  @Column()
  uid: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  description: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 400, nullable: true })
  observation?: string;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.budgets, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Customer)
  @ManyToOne(() => Customer, (customer: Customer) => customer.budgets, {
    nullable: false,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Field(() => BudgetDetailsResponse)
  @OneToMany(
    () => BudgetDetail,
    (budgetDetail: BudgetDetail) => budgetDetail.budget,
  )
  budgetDetails: BudgetDetail[];
}
