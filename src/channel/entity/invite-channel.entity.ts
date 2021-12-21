import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ChannelChatType } from 'src/chat/entity/channel-chat-room.entity';
import { BaseComlum } from 'src/common/entity/base.entity';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Channel } from './channel.entity';

export enum InviteChannelStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLIEND = 'declined',
}

registerEnumType(InviteChannelStatus, {
  name: 'InviteChannelStatus',
  description: ' invite channel status',
});

@ObjectType()
@Entity()
export class InviteChannel extends BaseComlum {
  @Field(() => Channel)
  @ManyToOne(() => Channel, (channel) => channel.inviteChannel)
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @Field(() => Int)
  @Column()
  channelId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user)
  fromUser: User;

  // 객체말고 number로 찾으려 joincolumn 설정
  @Field(() => User)
  @ManyToOne(() => User, (user) => user)
  @JoinColumn({ name: 'toUserId' })
  toUser: User;

  @Field(() => Int)
  @Column()
  toUserId: number;

  @Field(() => ChannelChatType)
  @Column({ type: 'enum', enum: ChannelChatType })
  chatType: ChannelChatType;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  roomId?: number;

  @Field(() => InviteChannelStatus)
  @Column({
    type: 'enum',
    enum: InviteChannelStatus,
    default: InviteChannelStatus.PENDING,
  })
  status: InviteChannelStatus;
}
