import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserForMongo } from 'src/user/schema/user.schema';

export type ChannelChatDocument = ChannelChat & Document;

@ObjectType()
@Schema()
export class ChannelChat {
  @Field(() => Int)
  @Prop()
  channel: number;

  @Field(() => Int)
  @Prop()
  room: number;

  @Field(() => UserForMongo)
  @Prop({
    type: Types.ObjectId,
    ref: UserForMongo.name,
  })
  user: UserForMongo;

  @Prop()
  type: string;

  @Field(() => String)
  @Prop()
  contents: string;

  @Field(() => Date, { nullable: true })
  @Prop({
    default: new Date(),
  })
  createdAt: Date;
}

export const ChannelChatSchema = SchemaFactory.createForClass(ChannelChat);
