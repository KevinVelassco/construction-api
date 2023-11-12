import { ObjectType, Field, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Budget } from '../budget/budget.entity';

@ObjectType()
@Entity({ name: 'budget_details' })
@Unique('uq_budget_detail_material', ['budget', 'material'])
export class BudgetDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Generated('uuid')
  @Column()
  uid: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 200 })
  material: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => Budget)
  @ManyToOne(() => Budget, (budget: Budget) => budget.budgetDetails, {
    nullable: false,
  })
  @JoinColumn({ name: 'budget_id' })
  budget: Budget;
}
