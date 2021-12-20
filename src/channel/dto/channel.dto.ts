import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base.dto';
import { Channel } from '../entity/channel.entity';

@ObjectType()
export class JoinChannelResponse extends BaseResponse {
  @Field(() => Channel, { nullable: true })
  channel?: Channel;
}
