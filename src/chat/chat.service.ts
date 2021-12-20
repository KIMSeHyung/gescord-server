import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChannelChat } from './schema/channel-chat.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChannelChat.name) private channeChats: Model<ChannelChat>,
  ) {}
  async insertChat(data: any): Promise<ChannelChat> {
    const chat = await this.channeChats.create(data);
    return chat;
  }
}
