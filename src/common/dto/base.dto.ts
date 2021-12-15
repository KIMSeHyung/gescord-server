import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseResponse {
  @Field(() => Boolean)
  ok: boolean;

  @Field(() => String, { nullable: true })
  message?: string;
}
