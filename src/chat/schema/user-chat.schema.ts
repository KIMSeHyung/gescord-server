import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserForMongo } from 'src/user/schema/user.schema';

export type UserChatDocument = UserChat & Document;

@Schema()
export class UserChat {
  @Prop({
    type: Types.ObjectId,
    ref: 'UserForMongo',
  })
  fromUser: UserForMongo;

  @Prop({
    type: Types.ObjectId,
    ref: 'UserForMongo',
  })
  toUser: UserForMongo;

  @Prop()
  type: string;

  @Prop()
  contents: string;

  @Prop({
    default: new Date(),
  })
  createdAt: string;
}

export const UserChatSchema = SchemaFactory.createForClass(UserChat);
