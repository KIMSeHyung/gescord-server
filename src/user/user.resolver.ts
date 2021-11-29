import { BadRequestException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { authUser, Public } from 'src/auth/auth.decorator';
import { AuthService } from 'src/auth/auth.service';
import { BaseResponse } from 'src/common/dto/base.dto';
import {
  AuthUser,
  CurrentUserResponse,
  LoginDto,
  SignUpDto,
  SignUpResponse,
} from './dto/user.dto';
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
    if (!signUpData.email) {
      throw new BadRequestException('이메일이 필요합니다.');
    }
    if (!signUpData.password) {
      throw new BadRequestException('비밀번호가 필요합니다.');
    }
    if (!signUpData.name) {
      throw new BadRequestException('이름이 필요합니다.');
    }
    try {
      const user = await this.userService.signUp(signUpData);
      return { ok: true, user };
    } catch (e) {
      return { ok: false, message: '회원가입 에러' };
    }
  }

  @Public()
  @Query(() => BaseResponse)
  async login(
    @Context() context: any,
    @Args() loginData: LoginDto,
  ): Promise<BaseResponse> {
    if (!loginData.email) {
      throw new BadRequestException('이메일이 필요합니다.');
    }
    if (!loginData.password) {
      throw new BadRequestException('비밀번호가 필요합니다.');
    }
    try {
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
      context.res.cookie('Authorization', token, { httpOnly: true });
      return { ok: true };
    } catch (e) {
      return { ok: false, message: '로그인 에러.' };
    }
  }

  @Query(() => CurrentUserResponse)
  async currentUser(@authUser() user: AuthUser): Promise<CurrentUserResponse> {
    return { ok: true, user };
  }
}
