import {
  ArgsType,
  Field,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base.dto';
import { FriendRequest } from '../entity/friend-request.entity';
import { User } from '../entity/user.entity';

@ObjectType()
export class AuthUser extends OmitType(User, [
  'password',
  'comparePassword',
  'savePassword',
] as const) {}

@ArgsType()
export class SignUpDto extends PickType(
  User,
  ['email', 'password', 'name'],
  ArgsType,
) {}

@ObjectType()
export class SignUpResponse extends BaseResponse {
  @Field(() => User, { nullable: true })
  user?: User;
}

@ArgsType()
export class LoginDto extends PickType(User, ['email', 'password'], ArgsType) {}

@ObjectType()
export class CurrentUserResponse extends BaseResponse {
  @Field(() => AuthUser, { nullable: true })
  user?: AuthUser;
}

@ObjectType()
export class GetFriendRequestResponse extends BaseResponse {
  @Field(() => [FriendRequest], { nullable: true })
  friendRequest?: FriendRequest[];
}

@ObjectType()
export class GetFriendsResponse extends BaseResponse {
  @Field(() => [AuthUser], { nullable: true })
  friends?: AuthUser[];
}

@ObjectType()
export class FindUserResponse extends BaseResponse {
  @Field(() => AuthUser, { nullable: true })
  user?: AuthUser;
}
