import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { authUser } from 'src/auth/auth.decorator';
import { BaseResponse } from 'src/common/dto/base.dto';
import { User } from 'src/user/entity/user.entity';
import { ChannelService } from './channel.service';
import { getChannelInfoResponse, JoinChannelResponse } from './dto/channel.dto';
import {
  InviteChannelDto,
  InviteChannelResponse,
} from './dto/invite-channel.dto';
import { CreateInviteCodeResponse } from './dto/invite-code.dto';

@Resolver()
export class ChannelResolver {
  constructor(private channelService: ChannelService) {}

  @Mutation(() => BaseResponse, { description: '채널 생성' })
  async createChannel(
    @authUser() user: User,
    @Args('channelName') name: string,
  ): Promise<BaseResponse> {
    await this.channelService.createChannel(user, name);
    return { ok: true };
  }

  @Mutation(() => CreateInviteCodeResponse, { description: '초대코드 생성' })
  async createInviteCode(
    @authUser() user: User,
    @Args('channelId') channelId: number,
  ): Promise<CreateInviteCodeResponse> {
    const code = await this.channelService.createInviteCode(user, channelId);
    return { ok: true, code };
  }

  @Mutation(() => JoinChannelResponse, { description: '초대코드로 채널 입장' })
  async joinChannelByCode(
    @authUser() user: User,
    @Args('code') code: string,
  ): Promise<JoinChannelResponse> {
    const channel = await this.channelService.joinChannelByCode(user, code);
    return { ok: true, channel };
  }

  @Mutation(() => BaseResponse, { description: '친구를 채널에 초대' })
  async inviteChannelToFriend(
    @authUser() user: User,
    @Args() data: InviteChannelDto,
  ): Promise<BaseResponse> {
    await this.channelService.inviteChannelToFriend(
      data.channelId,
      user,
      data.toUserId,
      data.roomId,
    );
    return { ok: true };
  }

  @Mutation(() => InviteChannelResponse, {
    description: '채널에 참가(초대수락)',
  })
  async joinChannel(
    @authUser() user: User,
    @Args('channelId') channelId: number,
  ): Promise<InviteChannelResponse> {
    await this.channelService.joinChannel(channelId, user);
    return { ok: true, channelId };
  }

  @Query(() => getChannelInfoResponse, { description: '채널 정보' })
  async getChannelInfo(
    @authUser() user: User,
    @Args('channelId') channelId: number,
  ): Promise<getChannelInfoResponse> {
    const channel = await this.channelService.getChannelInfo(user, channelId);
    return { ok: true, channel };
  }

  @Mutation(() => BaseResponse, { description: '채널 나가기' })
  async awayChannel(
    @authUser() user: User,
    @Args('channelId') channelId: number,
  ): Promise<BaseResponse> {
    await this.channelService.awayChannel(user, channelId);
    return { ok: true };
  }
}
