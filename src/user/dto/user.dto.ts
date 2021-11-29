import {
  ArgsType,
  Field,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { BaseResponse } from 'src/common/dto/base.dto';
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
export class LoginResonse extends BaseResponse {
  @Field(() => String, { nullable: true })
  token?: string;
}

@ObjectType()
export class CurrentUserResponse extends BaseResponse {
  @Field(() => AuthUser, { nullable: true })
  user?: AuthUser;
}
