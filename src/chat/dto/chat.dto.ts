import { ArgsType, Field, ObjectType, OmitType } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base.dto';
import { ChannelChatRoom } from '../entity/channel-chat-room.entity';
import { ChannelChat } from '../schema/channel-chat.schema';

@ArgsType()
export class ChannelChatDto extends OmitType(ChannelChat, ['user'], ArgsType) {}

@ObjectType()
export abstract class CreateChannelChatRoomResponse extends BaseResponse {
  @Field(() => ChannelChatRoom, { nullable: true })
  room?: ChannelChatRoom;
}

@ObjectType()
export abstract class GetChatResponse extends BaseResponse {
  @Field(() => [ChannelChat], { nullable: true })
  chat?: ChannelChat[];
}
