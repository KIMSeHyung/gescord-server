import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserForMongo } from 'src/user/schema/user.schema';

export type ChannelChatDocument = ChannelChat & Document;

@Schema()
export class ChannelChat {
  @Prop()
  channel: number;

  @Prop()
  room: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'UserForMongo',
  })
  user: UserForMongo;

  @Prop()
  type: string;

  @Prop()
  contents: string;

  @Prop({
    default: new Date(),
  })
  createdAt: string;
}

export const ChannelChatSchema = SchemaFactory.createForClass(ChannelChat);
