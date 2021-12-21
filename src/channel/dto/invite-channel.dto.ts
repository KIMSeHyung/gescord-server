import { ArgsType, Field, Int, ObjectType, PickType } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base.dto';
import { InviteChannel } from '../entity/invite-channel.entity';

@ArgsType()
export class InviteChannelDto extends PickType(
  InviteChannel,
  ['channelId', 'toUserId', 'roomId'],
  ArgsType,
) {}

@ObjectType()
export abstract class InviteChannelResponse extends BaseResponse {
  @Field(() => Int, { nullable: true })
  channelId?: number;
}
