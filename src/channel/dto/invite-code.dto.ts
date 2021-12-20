import { Field, ObjectType } from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base.dto';

@ObjectType()
export class CreateInviteCodeResponse extends BaseResponse {
  @Field(() => String, { nullable: true })
  code?: string;
}
