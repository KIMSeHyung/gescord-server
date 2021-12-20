import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
export abstract class BaseComlum extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Field(() => Date)
  @CreateDateColumn({ select: false })
  createdAt: Date;

  @Exclude()
  @Field(() => Date)
  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
