import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserForMongo & Document;

@Schema()
export class UserForMongo {
  @Prop({ required: true })
  userId: number;

  @Prop()
  email: string;
}

export const UserForMongoSchema = SchemaFactory.createForClass(UserForMongo);
