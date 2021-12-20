import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserForMongo } from 'src/user/schema/user.schema';

export type UserChatDocument = UserChat & Document;

@ObjectType()
@Schema()
export class UserChat {
  @Field(() => UserForMongo)
  @Prop({
    type: Types.ObjectId,
    ref: 'UserForMongo',
  })
  fromUser: UserForMongo;

  @Field(() => UserForMongo)
  @Prop({
    type: Types.ObjectId,
    ref: 'UserForMongo',
  })
  toUser: UserForMongo;

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

export const UserChatSchema = SchemaFactory.createForClass(UserChat);
