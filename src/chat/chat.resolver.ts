import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { authUser } from 'src/auth/auth.decorator';
import { BaseResponse } from 'src/common/dto/base.dto';
import { User } from 'src/user/entity/user.entity';
import { ChatService } from './chat.service';

@Resolver()
export class ChatResolver {
  constructor(private readonly chatService: ChatService) {}

  @Mutation(() => BaseResponse)
  async insertChat(@authUser() user: User, @Args() data: any) {
    await this.chatService.insertChat(data);
    return { ok: true };
  }
}
