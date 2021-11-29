import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { authUser, Public } from 'src/auth/auth.decorator';
import { AuthService } from 'src/auth/auth.service';
import { GqlAuthGuard } from 'src/auth/gql-auth.guard';
import { BaseResponse } from 'src/common/dto/base.dto';
import {
  AuthUser,
  CurrentUserResponse,
  LoginDto,
  LoginResonse,
  SignUpDto,
  SignUpResponse,
} from './dto/user.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Public()
  @Mutation(() => SignUpResponse)
  async signUp(@Args() signUpData: SignUpDto): Promise<SignUpResponse> {
    const user = await this.userService.signUp(signUpData);
    return { ok: true, user };
  }

  @Public()
  @Query(() => LoginResonse)
  async login(@Args() loginData: LoginDto): Promise<LoginResonse> {
    const user = await this.authService.validateUser(
      loginData.email,
      loginData.password,
    );
    if (!user) {
      throw new BadRequestException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }
    const token = await this.authService.login(user);
    return { ok: true, token };
  }

  @Query(() => CurrentUserResponse)
  async currentUser(@authUser() user: AuthUser): Promise<CurrentUserResponse> {
    return { ok: true, user };
  }

  @Query(() => [User])
  async getAllUser() {
    const users = await this.userService.getAllUser();
    return users;
  }
}
