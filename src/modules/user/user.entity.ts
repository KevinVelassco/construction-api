import { Field, ObjectType } from '@nestjs/graphql';

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Budget } from '../budget/budget.entity';
import { Customer } from '../customer/customer.entity';
import { BudgetsResponse } from '../budget/dto';
import { CustomersResponse } from '../customer/dto';

@ObjectType()
@Entity({ name: 'users' })
@Unique('uq_user_auth_uid', ['authUid'])
@Unique('uq_user_email', ['email'])
@Unique('uq_user_phone', ['phone'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Generated('uuid')
  @Column({ name: 'auth_uid' })
  authUid: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Field(() => String)
  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 10, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Field(() => Boolean)
  @Column({ name: 'is_admin', type: 'bool', default: false })
  isAdmin: boolean;

  @Field(() => Boolean)
  @Column({ name: 'is_active', type: 'bool', default: true })
  isActive: boolean;

  @Field(() => Boolean)
  @Column({ name: 'verified_email', type: 'bool', default: false })
  verifiedEmail: boolean;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @Field(() => BudgetsResponse)
  @OneToMany(() => Budget, (budget: Budget) => budget.user)
  budgets: Budget[];

  @Field(() => CustomersResponse)
  @OneToMany(() => Customer, (customer: Customer) => customer.user)
  customers: Customer[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
