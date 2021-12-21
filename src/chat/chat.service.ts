import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { Model } from 'mongoose';
import { Channel } from 'src/channel/entity/channel.entity';
import { REDIS_PUB_SUB } from 'src/common/constants';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { ChannelChatDto } from './dto/chat.dto';
import {
  ChannelChatRoom,
  ChannelChatType,
} from './entity/channel-chat-room.entity';
import { UserChatRoom } from './entity/user-chat-room.entity';
import { ChannelChat } from './schema/channel-chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Channel) private channels: Repository<Channel>,
    @InjectRepository(ChannelChatRoom)
    private channelChatRooms: Repository<ChannelChatRoom>,
    @InjectRepository(UserChatRoom)
    private userChatRooms: Repository<UserChatRoom>,
    @InjectModel(ChannelChat.name) private channeChats: Model<ChannelChat>,
    @Inject(REDIS_PUB_SUB) private pubsub: RedisPubSub,
  ) {}

  async createChannelChatRoom(
    user: User,
    channelId: number,
    name: string,
    type: ChannelChatType,
  ) {
    const channel = await this.channels.findOne({
      id: channelId,
      master: user,
    });
    if (!channel) {
      throw new BadRequestException('권한이 없습니다.');
    }
    const room = this.channelChatRooms.create();
    room.channel = channel;
    room.name = name;
    room.type = type;
    const chatRoom = await this.channelChatRooms.save(room);
    return chatRoom;
  }

  async insertChat(user: User, data: ChannelChatDto): Promise<ChannelChat> {
    const chat = await this.channeChats.create({
      channel: data.channel,
      contents: data.contents,
      room: data.room,
      user: user.id,
    });
    return chat;
  }

  async getChat(user: User, channel: number, room: number) {
    const isParticipants = await this.channels
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.participants', 'p', 'userId = :userId', {
        userId: user.id,
      })
      .where('c.id = :id', { id: channel })
      .getOne();
    if (!isParticipants.participants) {
      throw new BadRequestException('채널 참가자가 아닙니다.');
    }
    const chat = await this.channeChats
      .find({
        channel,
        room,
      })
      .select(['user', 'contents', 'createdAt'])
      .limit(20);
    return chat;
  }

  async testPublish(roomId: number, text: string) {
    await this.pubsub.publish(`rooms-${roomId}`, text);
    return 'text';
  }

  async testSubscription(roomId: number) {
    return this.pubsub.asyncIterator(`rooms-${roomId}`);
  }
}
