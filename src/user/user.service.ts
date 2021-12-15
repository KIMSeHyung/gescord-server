import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthUser, SignUpDto } from './dto/user.dto';
import {
  FriendRequest,
  FriendRequestStatus,
} from './entity/friend-request.entity';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequest: Repository<FriendRequest>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.users.findOne({ email });
    return user;
  }

  async signUp(data: SignUpDto): Promise<User> {
    const exists = await this.users.findOne({ email: data.email });
    if (exists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }
    const user = this.users.create();
    user.email = data.email;
    user.password = data.password;
    user.name = data.name;
    await this.users.save(user);
    return user;
  }

  async hasRequestBeenSentOrReceived(
    creator: User,
    receiver: User,
  ): Promise<boolean> {
    const exists = await this.friendRequest.findOne({
      where: [
        { creator, receiver },
        { creator: receiver, receiver: creator },
      ],
    });
    if (exists) return true;
    return false;
  }

  async sendFriendRequest(creatorId: number, receiverId: number) {
    if (creatorId === receiverId) {
      throw new BadRequestException('자기 자신에게는 요청 할 수 없습니다.');
    }
    const creator = await this.users.findOne({ id: creatorId });
    const receiver = await this.users.findOne({ id: receiverId });

    if (!receiver) {
      throw new BadRequestException('존재하지 않는 사용자 입니다');
    }
    const exists = await this.hasRequestBeenSentOrReceived(creator, receiver);
    if (exists) {
      throw new BadRequestException('친구 요청을 받았거나 신청한 상태입니다.');
    }

    const req = this.friendRequest.create();
    req.creator = creator;
    req.receiver = receiver;
    req.status = FriendRequestStatus.PENDING;
    await this.friendRequest.save(req);
  }

  async responseFriendRequest(
    friendRequestId: number,
    status: FriendRequestStatus,
  ) {
    const req = await this.friendRequest.findOne({ id: friendRequestId });
    if (req.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException('이미 처리된 요청입니다.');
    }
    await this.friendRequest.save({ ...req, status }, { transaction: true });
  }

  async getFriendRequestsFromRecipients(
    currentUser: number,
  ): Promise<FriendRequest[]> {
    return await this.friendRequest.find({
      where: [{ receiver: currentUser, status: FriendRequestStatus.PENDING }],
      relations: ['receiver', 'creator'],
    });
  }

  async getFriendRequestsStatus(currentUser: number): Promise<FriendRequest[]> {
    return await this.friendRequest.find({
      where: [{ creator: currentUser }],
      relations: ['creator', 'receiver'],
    });
  }

  async getFriends(userId: number): Promise<AuthUser[]> {
    const currentUser = await this.users.findOne({ id: userId });
    const friendRequests = await this.friendRequest.find({
      where: [
        { creator: currentUser, status: FriendRequestStatus.ACCEPTED },
        { receiver: currentUser, status: FriendRequestStatus.ACCEPTED },
      ],
      relations: ['creator', 'receiver'],
    });

    const friends: AuthUser[] = [];
    friendRequests.forEach((req: FriendRequest) => {
      if (currentUser.id === req.creator.id) {
        const friend: AuthUser = req.receiver;
        friends.push(friend);
      } else if (currentUser.id === req.receiver.id) {
        const friend: AuthUser = req.creator;
        friends.push(friend);
      }
    });

    return friends;
  }
}
