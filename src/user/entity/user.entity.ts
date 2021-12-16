import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

import { hash, compare } from 'bcrypt';
import { BaseComlum } from 'src/common/entity/base.entity';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { FriendRequest } from './friend-request.entity';
import { Channel } from 'src/channel/entity/channel.entity';

export enum ActiveStatus {
  ON = 'on',
  OFF = 'off',
}

registerEnumType(ActiveStatus, {
  name: 'activeStatus',
  description: 'user active or not',
});

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

  @Field(() => String)
  @Column({ length: 5 })
  tag: string;

  @Field(() => ActiveStatus, { nullable: true })
  @Column({ type: 'enum', enum: ActiveStatus, default: ActiveStatus.OFF })
  isActive?: ActiveStatus;

  @Field(() => [FriendRequest])
  @OneToMany(() => FriendRequest, (f) => f.creator)
  sentFriendRequest: FriendRequest[];

  @Field(() => [FriendRequest])
  @OneToMany(() => FriendRequest, (f) => f.receiver)
  recivedFriendRequest: FriendRequest[];

  @Field(() => Channel)
  @OneToMany(() => Channel, (channel) => channel.master)
  channel: Channel[];

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
