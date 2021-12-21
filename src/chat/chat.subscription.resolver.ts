import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { ChatService } from './chat.service';

@Resolver()
export class ChatSubscriptionResolver {
  constructor(private chatService: ChatService) {}

  @Subscription(() => String, {
    resolve: (data) => {
      return data;
    },
  })
  async testSubscription(@Args('roomId') roomId: number) {
    return await this.chatService.testSubscription(roomId);
  }

  @Mutation(() => String)
  async testPublish(
    @Args('roomId') roomId: number,
    @Args('text') text: string,
  ) {
    return await this.chatService.testPublish(roomId, text);
  }
}
