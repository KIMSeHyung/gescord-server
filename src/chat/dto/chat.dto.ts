import { ArgsType, OmitType } from '@nestjs/graphql';
import { ChannelChat } from '../schema/channel-chat.schema';

@ArgsType()
export class ChannelChatDto extends OmitType(
  ChannelChat,
  ['user', 'createdAt'],
  ArgsType,
) {}
