import { ArgsType, PickType } from '@nestjs/graphql';
import { InviteChannel } from '../entity/invite-channel.entity';

@ArgsType()
export class InviteChannelDto extends PickType(
  InviteChannel,
  ['channelId', 'toUserId'],
  ArgsType,
) {}
