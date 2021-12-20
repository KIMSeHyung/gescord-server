import { BadRequestException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { authUser, Public } from 'src/auth/auth.decorator';
import { AuthService } from 'src/auth/auth.service';
import { BaseResponse } from 'src/common/dto/base.dto';
import {
  CurrentUserResponse,
  FindUserResponse,
  GetFriendRequestResponse,
  GetFriendsResponse,
  LoginDto,
  SignUpDto,
  SignUpResponse,
} from './dto/user.dto';
import { FriendRequestStatus } from './entity/friend-request.entity';
import { ActiveStatus, User } from './entity/user.entity';
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
    const user = await this.userService.signUp(signUpData);
    return { ok: true, user };
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
  }

  @Query(() => BaseResponse)
  async logout(@Context() context: any, @authUser() user: User) {
    await this.userService.updateUserActiveStatus(user.id, ActiveStatus.OFF);
    context.res.clearCookie('Authorization');
    return { ok: true };
  }

  @Query(() => CurrentUserResponse)
  async currentUser(@authUser() user: User): Promise<CurrentUserResponse> {
    return { ok: true, user };
  }

  @Query(() => GetFriendRequestResponse)
  async getFriendRequestsFromRecipients(
    @authUser() user: User,
  ): Promise<GetFriendRequestResponse> {
    const requests = await this.userService.getFriendRequestsFromRecipients(
      user,
    );
    return { ok: true, friendRequest: requests };
  }

  @Query(() => GetFriendRequestResponse)
  async getFriendRequestsStatus(
    @authUser() user: User,
  ): Promise<GetFriendRequestResponse> {
    const requests = await this.userService.getFriendRequestsStatus(user);
    return { ok: true, friendRequest: requests };
  }

  @Mutation(() => BaseResponse)
  async sendFriendRequest(
    @authUser() user: User,
    @Args('recieverId') recieverId: number,
  ): Promise<BaseResponse> {
    await this.userService.sendFriendRequest(user, recieverId);
    return { ok: true };
  }

  @Mutation(() => BaseResponse)
  async responseFriendRequest(
    @Args('requestId') requestId: number,
    @Args('status', { type: () => FriendRequestStatus })
    status: FriendRequestStatus,
  ): Promise<BaseResponse> {
    await this.userService.responseFriendRequest(requestId, status);
    return { ok: true };
  }

  @Query(() => GetFriendsResponse)
  async getFriends(@authUser() user: User): Promise<GetFriendsResponse> {
    try {
      const friends = await this.userService.getFriends(user);
      return { ok: true, friends };
    } catch (e) {
      return { ok: false, message: '친구목록 가져오기에 실패했습니다.' };
    }
  }

  @Query(() => FindUserResponse)
  async findUserByNameWithTag(
    @authUser() user: User,
    @Args('nameWithTag') nameWithTag: string,
  ): Promise<FindUserResponse> {
    const foundedUser = await this.userService.findUserByNameWithTag(
      nameWithTag,
    );
    return { ok: true, user: foundedUser };
  }
}
