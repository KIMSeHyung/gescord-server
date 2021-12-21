import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelChat, ChannelChatSchema } from './schema/channel-chat.schema';
import { UserChat, UserChatSchema } from './schema/user-chat.schema';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { UserForMongo, UserForMongoSchema } from 'src/user/schema/user.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/channel/entity/channel.entity';
import { ChannelChatRoom } from './entity/channel-chat-room.entity';
import { UserChatRoom } from './entity/user-chat-room.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, ChannelChatRoom, UserChatRoom]),
    MongooseModule.forFeature([
      { name: ChannelChat.name, schema: ChannelChatSchema },
      { name: UserChat.name, schema: UserChatSchema },
      { name: UserForMongo.name, schema: UserForMongoSchema },
    ]),
  ],
  providers: [ChatService, ChatResolver],
})
export class ChatModule {}
