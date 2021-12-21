import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { ChannelChatRoom } from 'src/chat/entity/channel-chat-room.entity';
import { BaseComlum } from 'src/common/entity/base.entity';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { InviteChannel } from './invite-channel.entity';

@ObjectType()
@Entity()
export class Channel extends BaseComlum {
  @Field(() => String)
  @Column({ length: 30 })
  @MinLength(3, { message: '채널명은 최소 3자 이상입니다.' })
  @MaxLength(30, { message: '채널명은 최대 30자 이하 입니다.' })
  name: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.channel)
  master: User;

  @Field(() => [User])
  @ManyToMany(() => User, (user) => user, { cascade: true })
  @JoinTable()
  participants: User[];

  @OneToMany(() => InviteChannel, (invite) => invite.channel)
  inviteChannel: InviteChannel[];

  @Field(() => [ChannelChatRoom])
  @OneToMany(() => ChannelChatRoom, (room) => room.channel, { cascade: true })
  chatRoom: ChannelChatRoom[];
}
