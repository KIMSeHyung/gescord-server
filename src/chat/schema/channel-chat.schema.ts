import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChannelChatDocument = ChannelChat & Document;

@ObjectType()
@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class ChannelChat {
  @Field(() => Int)
  @Prop()
  channel: number;

  @Field(() => Int)
  @Prop()
  room: number;

  @Field(() => Int)
  @Prop()
  user: number;

  @Prop()
  type: string;

  @Field(() => String)
  @Prop()
  contents: string;

  @Field(() => String, { nullable: true })
  createdAt?: string;
}

export const ChannelChatSchema = SchemaFactory.createForClass(ChannelChat);
