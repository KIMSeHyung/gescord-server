import { Args, Resolver, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { ChannelChat } from './schema/channel-chat.schema';

@Resolver()
export class ChatSubscriptionResolver {
  constructor(private chatService: ChatService) {}

  @Subscription(() => ChannelChat, {
    resolve: (data: ChannelChat) => data,
  })
  async getChannelChatSubscription(@Args('roomId') roomId: number) {
    return await this.chatService.channelChatSubscription(roomId);
  }
}
