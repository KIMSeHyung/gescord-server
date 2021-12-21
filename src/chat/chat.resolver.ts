import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { authUser } from 'src/auth/auth.decorator';
import { BaseResponse } from 'src/common/dto/base.dto';
import { User } from 'src/user/entity/user.entity';
import { ChatService } from './chat.service';
import { ChannelChatDto } from './dto/chat.dto';
import { ChannelChatType } from './entity/channel-chat-room.entity';

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => BaseResponse)
  async createChannelChatRoom(
    @authUser() user: User,
    @Args('channelId') channelId: number,
    @Args('name') name: string,
    @Args('type') type: ChannelChatType,
  ) {
    const room = await this.chatService.createChannelChatRoom(
      user,
      channelId,
      name,
      type,
    );
    return { ok: true };
  }

  // subscription으로 변경
  @Mutation(() => BaseResponse)
  async insertChat(@authUser() user: User, @Args() data: ChannelChatDto) {
    await this.chatService.insertChat(user, data);
    return { ok: true };
  }

  // subscription으로 변경
  @Query(() => BaseResponse)
  async getChat(
    @authUser() user: User,
    @Args('channelId') channelId: number,
    @Args('roomId') roomId: number,
  ) {
    await this.chatService.getChat(user, channelId, roomId);
    return { ok: true };
  }
}
