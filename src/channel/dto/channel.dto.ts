import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base.dto';
import { JoinChannel } from 'src/user/dto/user.dto';
import { Channel } from '../entity/channel.entity';

@ObjectType()
export class CreateChannelResponse extends BaseResponse {
  @Field(() => JoinChannel, { nullable: true })
  channel?: JoinChannel;
}

@ObjectType()
export class getChannelInfoResponse extends BaseResponse {
  @Field(() => Channel, { nullable: true })
  channel?: Channel;
}

@ObjectType()
export class JoinChannelResponse extends BaseResponse {
  @Field(() => JoinChannel, { nullable: true })
  channel?: JoinChannel;
}
