import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelChat, ChannelChatSchema } from './schema/channel-chat.schema';
import { UserChat, UserChatSchema } from './schema/user-chat.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChannelChat.name, schema: ChannelChatSchema },
      { name: UserChat.name, schema: UserChatSchema },
    ]),
  ],
})
export class ChatModule {}
