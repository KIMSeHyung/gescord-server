import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Channel } from 'src/channel/entity/channel.entity';
import { BaseComlum } from 'src/common/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum ChannelChatType {
  TEXT = 'text',
  VOICE = 'voice',
}

registerEnumType(ChannelChatType, {
  name: 'ChannelChatType',
  description: '일반채팅 or 음성채팅',
});

@ObjectType({ description: '채널안 채팅룸' })
@Entity()
export class ChannelChatRoom extends BaseComlum {
  @ManyToOne(() => Channel, (channel) => channel.chatRoom, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'channelId' })
  channel: Channel;

  @Field(() => Int)
  @Column()
  channelId: number;

  @Field(() => String)
  @Column({ length: 30 })
  name: string;

  @Field(() => ChannelChatType)
  @Column({ type: 'enum', enum: ChannelChatType })
  type: ChannelChatType;
}
