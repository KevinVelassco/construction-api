import { Field, ObjectType } from '@nestjs/graphql';

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
import { Budget } from '../budget/budget.entity';
import { BudgetsResponse } from '../budget/dto';

@ObjectType()
@Entity({ name: 'customers' })
@Unique('uq_customer_uid', ['uid'])
@Unique('uq_customer_email', ['email'])
@Unique('uq_customer_phone', ['phone'])
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Generated('uuid')
  @Column()
  uid: string;

  @Field(() => String)
  @Column({ name: 'full_name', type: 'varchar', length: 100 })
  fullName: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 10, nullable: true })
  phone?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  address?: string;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user: User) => user.customers, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => BudgetsResponse)
  @OneToMany(() => Budget, (budget: Budget) => budget.customer)
  budgets: Budget[];
}
