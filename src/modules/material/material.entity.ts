import { ObjectType, Field, Float } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'materials' })
@Unique('uq_material_uid', ['uid'])
@Unique('uq_material_name', ['name'])
export class Material {
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Generated('uuid')
  @Column()
  uid: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Field(() => Float, { nullable: true })
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  price: number;

  @Field(() => Boolean)
  @Column({ name: 'is_active', type: 'bool', default: true })
  isActive: boolean;

  @Field(() => Date)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
