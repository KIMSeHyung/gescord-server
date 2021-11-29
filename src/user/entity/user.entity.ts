import { Field, ObjectType } from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';

import { hash, compare } from 'bcrypt';
import { BaseComlum } from 'src/common/entity/base.entity';
import { IsEmail, MaxLength, Min, MinLength } from 'class-validator';

@ObjectType()
@Entity()
export class User extends BaseComlum {
  @Field(() => String)
  @Column({ length: 50 })
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @Field(() => String)
  @Column({ length: 250 })
  @MinLength(8, { message: '비밀번호는 최소 8자 이상입니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자 이하입니다.' })
  password: string;

  @Field(() => String)
  @Column({ length: 30 })
  name: string;

  private hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  public comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async savePassword(): Promise<void> {
    if (this.password) {
      this.password = await this.hashPassword(this.password);
    }
  }
}
