import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = UserForMongo & Document;

@ObjectType()
@Schema()
export class UserForMongo {
  @Field(() => Int)
  @Prop({ required: true })
  userId: number;

  @Field(() => String)
  @Prop()
  email: string;

  @Field(() => String)
  @Prop()
  name: string;
}

export const UserForMongoSchema = SchemaFactory.createForClass(UserForMongo);
