import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  OneToMany,
} from 'typeorm';

import { hash, compare } from 'bcrypt';
import { BaseComlum } from 'src/common/entity/base.entity';
import { IsEmail } from 'class-validator';
import { FriendRequest } from './friend-request.entity';
import { Channel } from 'src/channel/entity/channel.entity';
import { Exclude } from 'class-transformer';

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
  @Index({ unique: true })
  @Column({ length: 50 })
  @IsEmail({}, { message: '이메일 형식이 아닙니다.' })
  email: string;

  @Column({ select: false, length: 250 })
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

  @Exclude()
  private hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  @Exclude()
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
