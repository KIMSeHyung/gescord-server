import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { authUser } from 'src/auth/auth.decorator';
import { BaseResponse } from 'src/common/dto/base.dto';
import { User } from 'src/user/entity/user.entity';
import { ChannelService } from './channel.service';
import { JoinChannelResponse } from './dto/channel.dto';
import { InviteChannelDto } from './dto/invite-channel.dto';
import { CreateInviteCodeResponse } from './dto/invite-code.dto';

@Resolver()
export class ChannelResolver {
  constructor(private channelService: ChannelService) {}

  @Mutation(() => BaseResponse)
  async createChannel(
    @authUser() user: User,
    @Args('channelName') name: string,
  ): Promise<BaseResponse> {
    await this.channelService.createChannel(user, name);
    return { ok: true };
  }

  @Mutation(() => CreateInviteCodeResponse)
  async createInviteCode(
    @authUser() user: User,
    @Args('channelId') channelId: number,
  ): Promise<CreateInviteCodeResponse> {
    const code = await this.channelService.createInviteCode(user, channelId);
    return { ok: true, code };
  }

  @Mutation(() => JoinChannelResponse)
  async joinChannelByCode(
    @authUser() user: User,
    @Args('code') code: string,
  ): Promise<JoinChannelResponse> {
    const channel = await this.channelService.joinChannelByCode(user, code);
    return { ok: true, channel };
  }

  @Mutation(() => BaseResponse)
  async inviteChannelToFriend(
    @authUser() user: User,
    @Args() data: InviteChannelDto,
  ) {
    await this.channelService.inviteChannelToFriend(
      data.channelId,
      user,
      data.toUserId,
    );
    return { ok: true };
  }
}
