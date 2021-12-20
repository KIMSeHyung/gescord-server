import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelChat, ChannelChatSchema } from './schema/channel-chat.schema';
import { UserChat, UserChatSchema } from './schema/user-chat.schema';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChannelChat.name, schema: ChannelChatSchema },
      { name: UserChat.name, schema: UserChatSchema },
    ]),
  ],
  providers: [ChatService, ChatResolver],
})
export class ChatModule {}
