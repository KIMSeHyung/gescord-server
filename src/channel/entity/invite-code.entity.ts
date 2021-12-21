import { Field, ObjectType } from '@nestjs/graphql';
import { BaseComlum } from 'src/common/entity/base.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as randomString from 'randomstring';

@ObjectType({ description: '채널 초대 코드' })
@Entity()
export class InviteCode extends BaseComlum {
  @Field(() => String)
  @Column({ length: 8 })
  code: string;

  @Column()
  channelId: number;

  @Column()
  issueUserId: number;

  @Field(() => Date)
  @Column()
  expiredAt: Date;

  @BeforeInsert()
  setData() {
    const code = randomString.generate(8);
    this.code = code;
    const date = new Date();
    date.setDate(date.getDate() + 7);
    this.expiredAt = date;
  }
}
