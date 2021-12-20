import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserForMongo } from 'src/user/schema/user.schema';

export type ChannelChatDocument = ChannelChat & Document;

@ObjectType()
@Schema()
export class ChannelChat {
  @Prop()
  channel: number;

  @Prop()
  room: number;

  @Field(() => UserForMongo)
  @Prop({
    type: Types.ObjectId,
    ref: 'UserForMongo',
  })
  user: UserForMongo;

  @Prop()
  type: string;

  @Field(() => String)
  @Prop()
  contents: string;

  @Field(() => Date)
  @Prop({
    default: new Date(),
  })
  createdAt: Date;
}

export const ChannelChatSchema = SchemaFactory.createForClass(ChannelChat);
