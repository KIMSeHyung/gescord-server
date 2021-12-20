import { ArgsType, Field, ObjectType, PickType } from '@nestjs/graphql';
import { MaxLength, MinLength } from 'class-validator';
import { BaseResponse } from 'src/common/dto/base.dto';
import { FriendRequest } from '../entity/friend-request.entity';
import { User } from '../entity/user.entity';

@ArgsType()
export class SignUpDto extends PickType(User, ['email', 'name'], ArgsType) {
  @Field(() => String)
  @MinLength(8, { message: '비밀번호는 최소 8자 이상입니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자 이하입니다.' })
  password: string;
}

@ObjectType()
export class SignUpResponse extends BaseResponse {
  @Field(() => User, { nullable: true })
  user?: User;
}

@ArgsType()
export class LoginDto extends PickType(User, ['email'], ArgsType) {
  @Field(() => String)
  @MinLength(8, { message: '비밀번호는 최소 8자 이상입니다.' })
  @MaxLength(20, { message: '비밀번호는 최대 20자 이하입니다.' })
  password: string;
}

@ObjectType()
export class CurrentUserResponse extends BaseResponse {
  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class GetFriendRequestResponse extends BaseResponse {
  @Field(() => [FriendRequest], { nullable: true })
  friendRequest?: FriendRequest[];
}

@ObjectType()
export class GetFriendsResponse extends BaseResponse {
  @Field(() => [User], { nullable: true })
  friends?: User[];
}

@ObjectType()
export class FindUserResponse extends BaseResponse {
  @Field(() => User, { nullable: true })
  user?: User;
}
