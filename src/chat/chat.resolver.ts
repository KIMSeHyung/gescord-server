import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { authUser } from 'src/auth/auth.decorator';
import { BaseResponse } from 'src/common/dto/base.dto';
import { User } from 'src/user/entity/user.entity';
import { ChatService } from './chat.service';
import {
  ChannelChatDto,
  CreateChannelChatRoomResponse,
  GetChatResponse,
} from './dto/chat.dto';
import { ChannelChatType } from './entity/channel-chat-room.entity';

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => CreateChannelChatRoomResponse, {
    description: '채널안 채팅룸 생성',
  })
  async createChannelChatRoom(
    @authUser() user: User,
    @Args('channelId') channelId: number,
    @Args('name') name: string,
    @Args('type', { type: () => ChannelChatType }) type: ChannelChatType,
  ) {
    const room = await this.chatService.createChannelChatRoom(
      user,
      channelId,
      name,
      type,
    );
    return { ok: true, room };
  }

  @Mutation(() => BaseResponse, { description: '채팅 인서트' })
  async insertChat(@authUser() user: User, @Args() data: ChannelChatDto) {
    await this.chatService.insertChat(user, data);
    return { ok: true };
  }

  @Query(() => GetChatResponse, { description: '채널 채팅 데이터 가져오기' })
  async getChat(
    @authUser() user: User,
    @Args('channelId') channelId: number,
    @Args('roomId') roomId: number,
  ): Promise<GetChatResponse> {
    const chat = await this.chatService.getChat(user, channelId, roomId);
    return { ok: true, chat };
  }
}
